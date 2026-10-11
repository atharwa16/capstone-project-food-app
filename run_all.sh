#!/usr/bin/env bash

# Resolve project root
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==================================================================="
echo " Starting BiteHub Full-Stack Platform and Python ML Microservice"
echo "==================================================================="

# Ensure Node & npm in PATH (supports nvm if installed)
if [ -d "$HOME/.nvm/versions/node" ]; then
  LATEST_NODE=$(ls "$HOME/.nvm/versions/node" 2>/dev/null | tail -n 1)
  if [ -n "$LATEST_NODE" ]; then
    export PATH="$HOME/.nvm/versions/node/$LATEST_NODE/bin:$PATH"
  fi
fi

# 1. Start Node Backend + Vite Frontend
echo "Starting Vite Frontend and Express Backend..."
(cd "$ROOT_DIR" && npm run dev:all) &
NODE_PID=$!

# 2. Start Python ML Microservice
echo "Starting ML Service..."
if [ -f "$ROOT_DIR/ml_service/.venv/bin/python" ]; then
  PYTHON_BIN="$ROOT_DIR/ml_service/.venv/bin/python"
else
  PYTHON_BIN="python3"
fi

(cd "$ROOT_DIR/ml_service" && "$PYTHON_BIN" main.py) &
ML_PID=$!

cleanup() {
  echo ""
  echo "Shutting down BiteHub services..."
  kill $NODE_PID $ML_PID 2>/dev/null
  exit 0
}

trap cleanup SIGINT SIGTERM

echo "Waiting for services to initialize..."
sleep 3

echo ""
echo "==================================================================="
echo " BiteHub is up and running!"
echo "   - Web App (Vite):         http://localhost:5173"
echo "   - Backend API & Sockets:  http://localhost:5001"
echo "   - ML Audit Dashboard:     http://localhost:8000/login"
echo "==================================================================="
echo "Press Ctrl+C to stop all services."

wait
