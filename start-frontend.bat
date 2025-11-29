@echo off
echo ================================================
echo QFF Frontend Server
echo ================================================
echo.

cd /d "%~dp0frontend"

if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting frontend server on http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev
pause
