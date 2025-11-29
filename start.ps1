# QFF Startup Script for Windows PowerShell
# Starts both backend and frontend servers

Write-Host "Starting QFF - Quantum Financial Firewall..." -ForegroundColor Cyan
Write-Host ""

# Check if Python is available
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Python not found. Please install Python 3.9+" -ForegroundColor Red
    exit 1
}

# Check if Node.js is available
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

Write-Host "Python and Node.js found" -ForegroundColor Green
Write-Host ""

# Get absolute paths
$BackendPath = Join-Path $PSScriptRoot "backend"
$FrontendPath = Join-Path $PSScriptRoot "frontend"

# Start Backend
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
$BackendCommand = @"
Set-Location '$BackendPath'
if (!(Test-Path .venv)) { 
    Write-Host 'Creating virtual environment...' -ForegroundColor Cyan
    python -m venv .venv 
}
& .\.venv\Scripts\Activate.ps1
Write-Host 'Installing backend dependencies...' -ForegroundColor Cyan
pip install -q -r requirements.txt
Write-Host 'Backend running on http://localhost:8000' -ForegroundColor Green
uvicorn app.main:app --reload --port 8000
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $BackendCommand

Start-Sleep -Seconds 5

# Start Frontend
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
$FrontendCommand = @"
Set-Location '$FrontendPath'
if (!(Test-Path node_modules)) { 
    Write-Host 'Installing frontend dependencies...' -ForegroundColor Cyan
    npm install 
}
Write-Host 'Frontend running on http://localhost:5173' -ForegroundColor Green
npm run dev
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $FrontendCommand

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "QFF is starting up!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend API:  http://localhost:8000" -ForegroundColor White
Write-Host "API Docs:     http://localhost:8000/docs" -ForegroundColor White
Write-Host "Frontend UI:  http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C in each terminal window to stop the servers" -ForegroundColor Gray
