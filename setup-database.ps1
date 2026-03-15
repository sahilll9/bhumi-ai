# Database setup script for Windows
# This helps set up PostgreSQL database

Write-Host "Database Setup Helper" -ForegroundColor Green
Write-Host "====================" -ForegroundColor Green

# Check if psql is available
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue

if (-not $psqlPath) {
    Write-Host "`nPostgreSQL not found in PATH!" -ForegroundColor Red
    Write-Host "Please install PostgreSQL from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "`nOr use Docker:" -ForegroundColor Yellow
    Write-Host "docker run --name bhumi-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=bhumi_ai -p 5432:5432 -d postgres" -ForegroundColor Cyan
    exit
}

Write-Host "`nPostgreSQL found!" -ForegroundColor Green
Write-Host "`nCreating database 'bhumi_ai'..." -ForegroundColor Cyan

# Try to create database
$env:PGPASSWORD = "password"  # Change if your postgres password is different
createdb -U postgres bhumi_ai 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database created successfully!" -ForegroundColor Green
} else {
    Write-Host "Database might already exist or there was an error." -ForegroundColor Yellow
    Write-Host "You can manually create it with:" -ForegroundColor Yellow
    Write-Host "psql -U postgres -c 'CREATE DATABASE bhumi_ai;'" -ForegroundColor Cyan
}

Write-Host "`nNext steps:" -ForegroundColor Green
Write-Host "1. Update DATABASE_URL in backend/.env" -ForegroundColor Yellow
Write-Host "2. Run: cd backend; npm run build; npm run migrate" -ForegroundColor Yellow
