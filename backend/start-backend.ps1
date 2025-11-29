# Start Backend Server
# Run this from the backend directory

Write-Host "Starting QFF Backend Server..." -ForegroundColor Cyan
Write-Host ""

# Activate virtual environment
if (Test-Path .venv) {
    Write-Host "Activating virtual environment..." -ForegroundColor Yellow
    & .\.venv\Scripts\Activate.ps1
} else {
    Write-Host "ERROR: Virtual environment not found!" -ForegroundColor Red
    Write-Host "Please run: python -m venv .venv" -ForegroundColor Yellow
    Write-Host "Then run: pip install -r requirements.txt" -ForegroundColor Yellow
    exit 1
}

# Check if packages are installed
if (!(Test-Path .venv\Lib\site-packages\fastapi)) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    pip install -r requirements.txt
}

Write-Host ""
Write-Host "Starting server on http://localhost:8000" -ForegroundColor Green
Write-Host "API Documentation: http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Start uvicorn
python -m uvicorn app.main:app --reload --port 8000
