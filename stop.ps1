# Stop QFF Servers
Write-Host "🛑 Stopping QFF servers..." -ForegroundColor Yellow

# Find and kill uvicorn processes (backend)
Get-Process | Where-Object {$_.Name -like "*uvicorn*"} | Stop-Process -Force

# Find and kill node processes (frontend)
Get-Process | Where-Object {$_.Name -like "*node*" -and $_.CommandLine -like "*vite*"} | Stop-Process -Force

Write-Host "✅ QFF servers stopped" -ForegroundColor Green
