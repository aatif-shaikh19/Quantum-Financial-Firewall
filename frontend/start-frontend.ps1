# Start Frontend Server
# Run this from the frontend directory

Write-Host "Starting QFF Frontend Server..." -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (!(Test-Path node_modules)) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "Starting development server on http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Start vite dev server
npm run dev
