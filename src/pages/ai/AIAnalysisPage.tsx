import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Sparkles, Upload, CheckCircle, AlertCircle, Loader2, ChevronRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { analysisService } from '@/services/analysisService';
import { useAI } from '@/contexts/AIContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import type { AnalysisResult } from '@/types';

type AnalysisState = 'idle' | 'uploading' | 'analyzing' | 'done' | 'error';

const SAMPLE_IMAGES = [
  {
    name: 'Pepperoni Pizza',
    url: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&auto=format&fit=crop',
  },
  {
    name: 'Hyderabadi Biryani',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop',
  },
  {
    name: 'Paneer Butter Masala',
    url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop',
  },
  {
    name: 'Greek Salad',
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop',
  },
];

export function AIAnalysisPage() {
  const { user } = useAuth();
  const { addAnalysis, history } = useAI();
  const toast = useToast();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, setState] = useState<AnalysisState>('idle');
  const [currentStage, setCurrentStage] = useState('');
  const [stageIndex, setStageIndex] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const onDrop = useCallback((accepted: File[], rejected: any[]) => {
    if (rejected.length > 0) {
      toast.error('Please upload a valid image (JPG, PNG, WEBP) under 10MB.');
      return;
    }
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setState('idle');
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  const handleSelectSample = (sample: typeof SAMPLE_IMAGES[0]) => {
    setFile(new File([''], `${sample.name}.jpg`, { type: 'image/jpeg' }));
    setPreview(sample.url);
    setResult(null);
    setState('idle');
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    setState('analyzing');
    setStageIndex(0);
    try {
      const analysisResult = await analysisService.analyzeFoodImage(
        preview,
        file?.name || 'sample_food.jpg',
        user?.id,
        (stage, idx) => {
          setCurrentStage(stage);
          setStageIndex(idx);
        },
      );
      setResult(analysisResult);
      addAnalysis(analysisResult);
      setState('done');
      toast.success('AI Analysis Completed! 🎯');
    } catch {
      setState('error');
      toast.error('Analysis failed.');
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setState('idle');
    setCurrentStage('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-red-200 text-red-600 px-4 py-1.5 rounded-full text-xs font-bold shadow-xs">
          <Sparkles size={16} className="animate-spin" />
          <span>NEURAL VISION ENGINE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">AI Food & Calorie Scanner</h1>
        <p className="text-gray-500 text-sm font-medium">
          Upload or select any dish photo to get real-time identification, macronutrient estimation, health scores, and dietary alerts.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Upload / Preview Card */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center justify-between">
              <span>Select or Upload Photo</span>
              {preview && (
                <button onClick={handleReset} className="text-xs font-bold text-red-500 hover:underline">
                  Reset Image
                </button>
              )}
            </h3>

            {!preview ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isDragActive ? 'border-red-500 bg-red-50/50 scale-[1.02]' : 'border-gray-200 hover:border-red-400 bg-gray-50/60'
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mx-auto mb-4 shadow-sm text-red-500">
                  <Upload size={24} />
                </div>
                <p className="text-sm font-bold text-gray-800">Drag & drop your food photo here</p>
                <p className="text-xs text-gray-400 mt-1">or <span className="text-red-500 font-semibold underline">browse from files</span> (JPG, PNG, WEBP)</p>
                <p className="text-[10px] text-gray-400 mt-3">Supports high-res photos up to 10MB</p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-black group h-72">
                <img src={preview} alt="Selected food" className="w-full h-full object-cover" />
                
                {/* Laser scan effect during analysis */}
                {state === 'analyzing' && (
                  <div className="absolute inset-0 bg-red-500/10 pointer-events-none">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_#ef4444] animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs">
                      <div className="bg-white/95 p-4 rounded-2xl shadow-xl text-center space-y-2 max-w-xs">
                        <Loader2 size={24} className="animate-spin text-red-500 mx-auto" />
                        <p className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">{currentStage}</p>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full transition-all duration-300" style={{ width: `${((stageIndex + 1) / 4) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Sample Selector */}
            {!preview && (
              <div className="mt-6 space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Try 1-Click Sample Images:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SAMPLE_IMAGES.map(sample => (
                    <button
                      key={sample.name}
                      onClick={() => handleSelectSample(sample)}
                      className="group relative rounded-xl overflow-hidden border border-gray-200 h-16 text-left hover:border-red-500 transition-all"
                    >
                      <img src={sample.url} alt={sample.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-1.5 flex items-end">
                        <p className="text-[10px] font-bold text-white leading-tight line-clamp-1">{sample.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action button */}
            {preview && state !== 'analyzing' && state !== 'done' && (
              <div className="mt-6">
                <Button onClick={handleAnalyze} fullWidth size="lg" className="rounded-2xl font-bold shadow-md bg-gradient-to-r from-red-500 to-rose-600">
                  <Sparkles size={18} />
                  Analyze Dish Now
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Results Card */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm h-full flex flex-col">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center justify-between">
              <span>AI Neural Findings</span>
              {result && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">High Confidence ({Math.round(result.confidence * 100)}%)</span>}
            </h3>

            {state === 'idle' && !result && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-3">
                  <Sparkles size={24} />
                </div>
                <p className="text-sm font-bold text-gray-800">No Image Analyzed Yet</p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">Upload a food picture on the left or select one of the sample dishes to run AI recognition.</p>
              </div>
            )}

            {result && state === 'done' && (
              <div className="space-y-6 animate-fade-in flex-1 flex flex-col justify-between">
                {/* Detected Dish Title */}
                <div className="bg-gradient-to-r from-red-50 to-amber-50 p-4 rounded-2xl border border-red-100/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">Identified Dish</span>
                      <h2 className="text-xl font-extrabold text-gray-900">{result.foodName}</h2>
                      <p className="text-xs font-semibold text-gray-500 mt-0.5">{result.cuisineType} Cuisine</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-red-500">{result.nutrition.calories}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase">Est. Calories</div>
                    </div>
                  </div>
                </div>

                {/* Macronutrient Cards */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Macro Distribution</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 text-center">
                      <p className="text-lg font-extrabold text-blue-700">{result.nutrition.protein}g</p>
                      <p className="text-[10px] font-bold text-blue-500 uppercase mt-0.5">Protein</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 text-center">
                      <p className="text-lg font-extrabold text-amber-700">{result.nutrition.carbs}g</p>
                      <p className="text-[10px] font-bold text-amber-500 uppercase mt-0.5">Carbs</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-rose-50/60 border border-rose-100 text-center">
                      <p className="text-lg font-extrabold text-rose-700">{result.nutrition.fat}g</p>
                      <p className="text-[10px] font-bold text-rose-500 uppercase mt-0.5">Fat</p>
                    </div>
                  </div>
                </div>

                {/* Detected Ingredients */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Detected Ingredients</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.ingredients.map(ing => (
                      <span key={ing} className="bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full border border-gray-200">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Health Insights & Action */}
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-2.5">
                    <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-emerald-800 font-medium">{result.aiInsights}</p>
                  </div>

                  <button
                    onClick={() => navigate(`/search?q=${encodeURIComponent(result.foodName)}`)}
                    className="w-full bg-slate-900 hover:bg-black text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Order Similar Dishes Near You</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analysis History Section */}
      {history.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-gray-900">Your Recent AI Scans</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {history.slice(0, 3).map(item => (
              <div key={item.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                <div className="flex items-center gap-3">
                  <img src={item.imageUrl} alt={item.foodName} className="w-12 h-12 rounded-xl object-cover border border-gray-200" />
                  <div>
                    <p className="text-sm font-extrabold text-gray-900">{item.foodName}</p>
                    <p className="text-xs text-red-500 font-bold">{item.nutrition.calories} kcal</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
