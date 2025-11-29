@echo off
echo ================================================
echo QFF Backend Server
echo ================================================
echo.

cd /d "%~dp0backend"

if not exist .venv (
    echo ERROR: Virtual environment not found!
    echo Please run: python -m venv .venv
    echo Then run: .venv\Scripts\pip.exe install -r requirements.txt
    pause
    exit /b 1
)

echo Activating virtual environment...
call .venv\Scripts\activate.bat

echo.
echo Starting backend server on http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

python -m uvicorn app.main:app --reload --port 8000
pause
