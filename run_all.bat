@echo off
set "ROOT=%~dp0"
echo ===================================================================
echo Starting BiteHub Full-Stack Platform and Python ML Service
echo ===================================================================

start "BiteHub-App" cmd.exe /k "cd /d %ROOT% && npm run dev:all"
start "ML-Service" cmd.exe /k "cd /d %ROOT%ml_service && python main.py"

ping 127.0.0.1 -n 4 >nul
start http://localhost:5173
start http://localhost:8000/login

echo [SUCCESS] Both terminals and browser windows have been launched on your desktop!
