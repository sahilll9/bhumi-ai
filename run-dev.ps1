# Development startup script for Windows PowerShell
# This script starts all services in separate windows

Write-Host "Starting Bhumi AI Platform..." -ForegroundColor Green

# Check if .env files exist
if (-not (Test-Path "backend\.env")) {
    Write-Host "Creating backend/.env from template..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env" -ErrorAction SilentlyContinue
    Write-Host "Please edit backend/.env with your database credentials!" -ForegroundColor Red
}

if (-not (Test-Path "ai-service\.env")) {
    Write-Host "Creating ai-service/.env from template..." -ForegroundColor Yellow
    Copy-Item "ai-service\.env.example" "ai-service\.env" -ErrorAction SilentlyContinue
}

# Start Backend
Write-Host "Starting Backend (Node.js)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run dev"

# Wait a bit
Start-Sleep -Seconds 2

# Start AI Service
Write-Host "Starting AI Service (Python)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\ai-service'; if (Test-Path venv\Scripts\python.exe) { & '.\venv\Scripts\python.exe' app.py } else { Write-Host 'Please create venv first: python -m venv venv' }"

# Wait a bit
Start-Sleep -Seconds 2

# Start Frontend
Write-Host "Starting Frontend (React)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev"

Write-Host "`nAll services starting!" -ForegroundColor Green
Write-Host "Backend: http://localhost:8000" -ForegroundColor Yellow
Write-Host "AI Service: http://localhost:5000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "`nOpen http://localhost:3000 in your browser!" -ForegroundColor Green
