@echo off
title Notice2Action Startup

echo 🚀 Starting Notice2Action...

REM Check if .env exists
if not exist .env (
    echo ⚠️  .env file not found. Copying from .env.example...
    copy .env.example .env
    echo 📝 Please edit .env file with your API keys:
    echo    - GEMINI_API_KEY (for Gemma 4^)
    echo    - GROQ_API_KEY (for intelligent responses^)
    echo.
    pause
)

REM Start backend in new window
echo 🐍 Starting FastAPI backend...
start "Notice2Action Backend" cmd /k "cd backend && python -m venv venv & venv\Scripts\activate & pip install -r requirements.txt & python -m main"

REM Wait a bit for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend in new window
echo ⚛️  Starting React frontend...
start "Notice2Action Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo 🎉 Notice2Action is starting up!
echo 📊 Backend:  http://localhost:8000
echo 🌐 Frontend: http://localhost:3000
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo Press any key to continue...
pause >nul