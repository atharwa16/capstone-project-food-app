"""
FoodPipeline — preprocessing + model + calibration, sealed in one object.

The backend never touches cleaning steps. It calls:

    pipeline = FoodPipeline.load("food_forensics_v1")
    result   = pipeline.predict(image_bytes)

Why it is one object: the model was trained on images that went through a very
specific normalisation path. If production applied even a slightly different
path, the model would silently lose accuracy with nothing in the logs to show
it. Binding them together makes that mismatch impossible.

Dependencies: numpy, pillow, opencv-python, onnxruntime. No PyTorch.
"""
from __future__ import annotations

import base64
import io
import json
import os
import time
from dataclasses import dataclass, field
from typing import Any

import cv2
import numpy as np
from PIL import Image, ImageOps

__all__ = ["Preprocessor", "FoodPipeline", "PipelineError"]

BUNDLE_VERSION = "1.0"


class PipelineError(RuntimeError):
    pass


# ----------------------------------------------------------------------------
# Preprocessor: several named cleaning stages
# ----------------------------------------------------------------------------
@dataclass
class Preprocessor:
    """Cleaning stages, each independently callable.

    Stage 1 `canonicalize`  — the ONLY thing the model sees. Byte-identical to
        what ran over the training set: strip metadata, honour orientation, RGB,
        resize long side to 384, re-encode JPEG q90 4:2:0. The re-encode matters:
        training images were all re-encoded, so an upload must be too, or the
        model sees a compression signature it never met.

    Stage 2 `denoise`       — edge-preserving noise removal.
    Stage 3 `enhance`       — CLAHE contrast on luminance, mild unsharp.
    Stage 4 `forensic`      — ELA, noise-residual and FFT scores.

    Stages 2 and 3 deliberately do NOT feed the model. Training never saw them,
    so applying them before inference would create exactly the train/production
    mismatch this class exists to prevent. They serve the forensic scores and
    the analyst-facing view.
    """

    long_side: int = 384
    jpeg_quality: int = 90
    subsampling: int = 2  # 4:2:0
    img_size: int = 384
    mean: tuple = (0.485, 0.456, 0.406)
    std: tuple = (0.229, 0.224, 0.225)
    letterbox_fill: tuple = (114, 114, 114)
    ela_quality: int = 90
    version: str = BUNDLE_VERSION

    # Squash ranges fitted to the prepared dataset (scripts/04_calibrate_forensics.py),
    # so the scores spread across 0..1 instead of pinning to the ends.
    ela_range: tuple = (8.18, 52.25)
    noise_range: tuple = (2.10, 8.97)
    fft_range: tuple = (9.92, 31.74)

    # ---- stage 1 -----------------------------------------------------------
    def canonicalize(self, img: Image.Image) -> Image.Image:
        img = ImageOps.exif_transpose(img)
        img = img.convert("RGB")
        w, h = img.size
        s = self.long_side / float(max(w, h))
        if s < 1.0:
            img = img.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)
        clean = Image.frombytes("RGB", img.size, img.tobytes())  # drops any info dict
        buf = io.BytesIO()
        clean.save(buf, format="JPEG", quality=self.jpeg_quality,
                   subsampling=self.subsampling, optimize=False, progressive=False)
        buf.seek(0)
        return Image.open(buf).convert("RGB")

    # ---- stage 2 -----------------------------------------------------------
    def denoise(self, img: Image.Image) -> Image.Image:
        a = np.asarray(img)
        return Image.fromarray(cv2.bilateralFilter(a, d=5, sigmaColor=45, sigmaSpace=45))

    # ---- stage 3 -----------------------------------------------------------
    def enhance(self, img: Image.Image) -> Image.Image:
        a = np.asarray(img)
        lab = cv2.cvtColor(a, cv2.COLOR_RGB2LAB)
        l, x, y = cv2.split(lab)
        l = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8)).apply(l)
        a = cv2.cvtColor(cv2.merge((l, x, y)), cv2.COLOR_LAB2RGB)
        blur = cv2.GaussianBlur(a, (0, 0), 1.2)
        return Image.fromarray(cv2.addWeighted(a, 1.35, blur, -0.35, 0))

    # ---- stage 4 -----------------------------------------------------------
    def forensic(self, img: Image.Image) -> dict[str, float]:
        """Deterministic signals, reported for the analyst — NOT part of the verdict.

        Measured honestly on 1,400 prepared images, these three separate the
        classes at AUC 0.53 / 0.49 / 0.53 — barely better than a coin toss.

        The reason is worth understanding. ELA works by finding regions with a
        different compression history from their surroundings. Stage 1 re-encodes
        every image once through one identical path, which is what removes the
        dataset leak — and that same step erases the compression history ELA
        depends on. The forensic signal in the raw data *was* the leak.

        They stay in the response because an analyst reviewing a flagged case
        benefits from seeing them, and because the ELA heat pattern is
        informative to a human eye even when its scalar summary is not. Nothing
        downstream should treat them as evidence; `manifest.json` carries the
        measured AUC so the UI can label them accurately.
        """
        rgb = np.asarray(img).astype(np.float32)
        gray = cv2.cvtColor(np.asarray(img), cv2.COLOR_RGB2GRAY).astype(np.float32)

        # --- ELA: re-save and look for regions that survive a second compression
        #     differently from their surroundings (a pasted patch usually does)
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=self.ela_quality)
        buf.seek(0)
        recompressed = np.asarray(Image.open(buf).convert("RGB")).astype(np.float32)
        ela = np.abs(rgb - recompressed).max(axis=2)
        ela_p999 = float(np.percentile(ela, 99.9))
        ela_mean = float(ela.mean())
        ela_score = _squash(ela_p999 / max(ela_mean, 1e-3), *self.ela_range)

        # --- noise: a pasted object carries its own grain, so the residual's
        #     local energy becomes uneven across the frame
        residual = gray - cv2.medianBlur(gray.astype(np.uint8), 3).astype(np.float32)
        k = 16
        h, w = residual.shape
        hh, ww = h // k * k, w // k * k
        if hh >= k and ww >= k:
            tiles = residual[:hh, :ww].reshape(hh // k, k, ww // k, k).transpose(0, 2, 1, 3)
            energy = tiles.reshape(-1, k * k).std(axis=1)
            spread = float(np.percentile(energy, 98) / max(np.median(energy), 1e-3))
        else:
            spread = 1.0
        noise_score = _squash(spread, *self.noise_range)

        # --- FFT: splice boundaries add high-frequency energy
        f = np.fft.fftshift(np.abs(np.fft.fft2(gray - gray.mean())))
        cy, cx = np.array(f.shape) // 2
        yy, xx = np.ogrid[: f.shape[0], : f.shape[1]]
        r = np.sqrt((yy - cy) ** 2 + (xx - cx) ** 2)
        rmax = r.max()
        high = float(f[r > 0.55 * rmax].mean())
        low = float(f[r < 0.12 * rmax].mean())
        fft_score = _squash(high / max(low, 1e-6) * 1000.0, *self.fft_range)

        return {
            "ela": round(ela_score, 4),
            "noise": round(noise_score, 4),
            "fft": round(fft_score, 4),
            "ela_peak_ratio": round(ela_p999 / max(ela_mean, 1e-3), 3),
            "noise_spread": round(spread, 3),
            "_note": "diagnostic only; measured AUC ~0.53 - do not use as evidence",
        }

    # ---- model tensor ------------------------------------------------------
    def letterbox(self, img: Image.Image) -> tuple[Image.Image, float, int, int]:
        """Pad to square rather than crop — cropping could cut the anomaly out."""
        w, h = img.size
        s = self.img_size / max(w, h)
        if s != 1.0:
            img = img.resize((max(1, round(w * s)), max(1, round(h * s))), Image.BILINEAR)
        canvas = Image.new("RGB", (self.img_size, self.img_size), tuple(self.letterbox_fill))
        ox, oy = (self.img_size - img.size[0]) // 2, (self.img_size - img.size[1]) // 2
        canvas.paste(img, (ox, oy))
        return canvas, s, ox, oy

    def to_tensor(self, img: Image.Image) -> np.ndarray:
        a = np.asarray(img, dtype=np.float32) / 255.0
        a = (a - np.array(self.mean, np.float32)) / np.array(self.std, np.float32)
        return a.transpose(2, 0, 1)[None].astype(np.float32)

    def run(self, image_bytes: bytes) -> dict[str, Any]:
        """Full path: raw upload -> everything the model and the UI need."""
        try:
            src = Image.open(io.BytesIO(image_bytes))
            src.load()
        except Exception as e:
            raise PipelineError(f"cannot decode image: {e}") from e

        canon = self.canonicalize(src)
        boxed, scale, ox, oy = self.letterbox(canon)
        return {
            "canonical": canon,
            "boxed": boxed,
            "tensor": self.to_tensor(boxed),
            "forensic": self.forensic(canon),
            "offset": (ox, oy),
            "scale": scale,
        }


def _squash(x: float, lo: float, hi: float) -> float:
    """Map a raw ratio onto 0..1 with a soft floor and ceiling."""
    return float(np.clip((x - lo) / max(hi - lo, 1e-9), 0.0, 1.0))


# ----------------------------------------------------------------------------
# Calibration
# ----------------------------------------------------------------------------
@dataclass
class Calibrator:
    """Temperature scaling.

    Networks are systematically overconfident — a raw sigmoid saying 0.99 is
    often nearer 0.85 in truth. One scalar fitted on validation data fixes the
    spread, so a reported 94% actually behaves like 94%.
    """

    temperature: float = 1.0
    bias: float = 0.0
    threshold: float = 0.0
    fitted: bool = False

    def probability(self, logit: float) -> float:
        z = (logit - self.bias) / max(self.temperature, 1e-6)
        return float(1.0 / (1.0 + np.exp(-z)))

    @staticmethod
    def fit(logits: np.ndarray, labels: np.ndarray, threshold: float) -> "Calibrator":
        best, best_nll = 1.0, float("inf")
        y = labels.astype(np.float64)
        for t in np.linspace(0.25, 6.0, 240):
            z = np.clip((logits - threshold) / t, -30, 30)
            p = 1.0 / (1.0 + np.exp(-z))
            p = np.clip(p, 1e-7, 1 - 1e-7)
            nll = -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))
            if nll < best_nll:
                best_nll, best = nll, t
        return Calibrator(temperature=float(best), bias=float(threshold),
                          threshold=float(threshold), fitted=True)


# ----------------------------------------------------------------------------
# Pipeline
# ----------------------------------------------------------------------------
@dataclass
class FoodPipeline:
    preprocessor: Preprocessor
    calibrator: Calibrator
    config: dict = field(default_factory=dict)
    bundle_dir: str = ""
    _session: Any = None
    _cam_w: Any = None

    # thresholds for the three-zone review policy
    review_low: float = 0.40
    review_high: float = 0.90

    # ---- loading -----------------------------------------------------------
    @classmethod
    def load(cls, bundle_dir: str) -> "FoodPipeline":
        bundle_dir = os.path.abspath(bundle_dir)
        man_path = os.path.join(bundle_dir, "manifest.json")
        if not os.path.exists(man_path):
            raise PipelineError(f"no manifest.json in {bundle_dir}")
        manifest = json.load(open(man_path))

        pre = Preprocessor(**manifest["preprocessor"])
        cal = Calibrator(**manifest["calibrator"])
        obj = cls(preprocessor=pre, calibrator=cal, config=manifest,
                  bundle_dir=bundle_dir,
                  review_low=manifest.get("review_low", 0.40),
                  review_high=manifest.get("review_high", 0.90))
        obj._ensure_session()
        return obj

    def _ensure_session(self):
        if self._session is not None:
            return
        import onnxruntime as ort

        path = os.path.join(self.bundle_dir, "model.onnx")
        if not os.path.exists(path):
            raise PipelineError(f"model.onnx missing from {self.bundle_dir}")
        so = ort.SessionOptions()
        so.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        so.intra_op_num_threads = int(os.environ.get("ORT_THREADS", "4"))
        self._session = ort.InferenceSession(path, so, providers=["CPUExecutionProvider"])
        cam = os.path.join(self.bundle_dir, "cam_weights.npz")
        self._cam_w = np.load(cam)["W"] if os.path.exists(cam) else None

    # ---- inference ---------------------------------------------------------
    def predict(self, image_bytes: bytes, *, heatmap: bool = True) -> dict[str, Any]:
        t0 = time.perf_counter()
        self._ensure_session()
        pre = self.preprocessor.run(image_bytes)

        outs = self._session.run(None, {"input": pre["tensor"]})
        logit = float(np.asarray(outs[0]).reshape(-1)[0])
        features = outs[1] if len(outs) > 1 else None

        p_manip = self.calibrator.probability(logit)
        verdict, action = self._decide(p_manip)

        # `confidence` always describes the side the score actually favours. For a
        # decided case that is the verdict itself; for an UNCERTAIN one there is no
        # verdict to be confident about, so report the leaning instead — otherwise a
        # score of 0.91 (just under the reject line) would be shown as "9% confident".
        leaning = "MANIPULATED" if p_manip >= 0.5 else "AUTHENTIC"
        confidence = p_manip if leaning == "MANIPULATED" else 1.0 - p_manip

        result = {
            "verdict": verdict,
            "confidence": round(confidence, 4),
            "leaning": leaning if verdict == "UNCERTAIN" else verdict,
            "manipulation_probability": round(p_manip, 4),
            "action": action,
            "forensic": pre["forensic"],
            "model_version": self.config.get("version", BUNDLE_VERSION),
        }
        if heatmap and features is not None and self._cam_w is not None:
            result["heatmap"] = self._cam(features, pre)
        result["time_ms"] = round((time.perf_counter() - t0) * 1000, 1)
        return result

    def predict_file(self, path: str, **kw) -> dict[str, Any]:
        with open(path, "rb") as fh:
            return self.predict(fh.read(), **kw)

    def _decide(self, p: float) -> tuple[str, str]:
        """Three zones. No model is perfect, so the uncertain middle goes to a human."""
        if p >= self.review_high:
            return "MANIPULATED", "reject_refund"
        if p <= self.review_low:
            return "AUTHENTIC", "approve_refund"
        return "UNCERTAIN", "manual_review"

    def _cam(self, features: np.ndarray, pre: dict) -> str:
        """Class activation map. The head is global-pool + linear, so the map is
        just the classifier weights dotted with the feature map — no gradients."""
        f = np.asarray(features)[0]                      # C, H, W
        w = np.asarray(self._cam_w).reshape(-1)          # C
        cam = np.tensordot(w, f, axes=(0, 0))            # H, W
        cam = np.maximum(cam, 0)
        if cam.max() > cam.min():
            cam = (cam - cam.min()) / (cam.max() - cam.min())
        else:
            cam = np.zeros_like(cam)

        size = self.preprocessor.img_size
        cam = cv2.resize(cam.astype(np.float32), (size, size), interpolation=cv2.INTER_CUBIC)

        # undo the letterbox padding so the overlay lines up with the real photo
        ox, oy = pre["offset"]
        canon = pre["canonical"]
        cw, ch = canon.size
        s = pre["scale"]
        crop = cam[oy:oy + max(1, round(ch * s)), ox:ox + max(1, round(cw * s))]
        crop = cv2.resize(crop, (cw, ch), interpolation=cv2.INTER_CUBIC)

        colored = cv2.applyColorMap((np.clip(crop, 0, 1) * 255).astype(np.uint8), cv2.COLORMAP_JET)
        colored = cv2.cvtColor(colored, cv2.COLOR_BGR2RGB)
        blend = cv2.addWeighted(np.asarray(canon), 0.6, colored, 0.4, 0)

        buf = io.BytesIO()
        Image.fromarray(blend).save(buf, format="PNG", optimize=True)
        return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()

    # ---- introspection -----------------------------------------------------
    def info(self) -> dict[str, Any]:
        return {
            "version": self.config.get("version", BUNDLE_VERSION),
            "backbone": self.config.get("backbone"),
            "img_size": self.preprocessor.img_size,
            "calibrated": self.calibrator.fitted,
            "temperature": round(self.calibrator.temperature, 4),
            "review_zones": {"authentic_below": self.review_low,
                             "manipulated_above": self.review_high},
            "trained_metrics": self.config.get("metrics", {}),
        }

    # keep the object picklable: an onnxruntime session cannot be pickled
    def __getstate__(self):
        d = self.__dict__.copy()
        d["_session"] = None
        d["_cam_w"] = None
        return d

    def __setstate__(self, d):
        self.__dict__.update(d)
