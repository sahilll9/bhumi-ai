# ============================================================================
# BHUMI AI PLATFORM - SINGLE STARTUP SCRIPT
# ============================================================================
# This script starts EVERYTHING with one command:
# 1. Starts PostgreSQL database in Docker
# 2. Waits for database to be ready
# 3. Runs database migrations
# 4. Starts Backend (Node.js)
# 5. Starts AI Service (Python)
# 6. Starts Frontend (React)
#
# Usage: .\start-all.ps1
# ============================================================================

param(
    [switch]$SkipDocker = $false  # Use -SkipDocker if database already running
)

# Colors for output
function Write-Step { param($msg) Write-Host "`n>>> $msg" -ForegroundColor Cyan }
function Write-Success { param($msg) Write-Host "[+] $msg" -ForegroundColor Green }
function Write-Error { param($msg) Write-Host "[-] $msg" -ForegroundColor Red }
function Write-Info { param($msg) Write-Host "[i] $msg" -ForegroundColor Yellow }

Write-Host @"
===========================================================
         BHUMI AI PLATFORM - STARTING ALL SERVICES         
===========================================================
"@ -ForegroundColor Green

# Step 1: Check if .env files exist, create if missing
Write-Step "Step 1: Checking environment configuration..."

if (-not (Test-Path "backend\.env")) {
    Write-Info "Creating backend/.env file..."
    @"
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5433/bhumi_ai

# Server Configuration
PORT=8000

# JWT Secret (change this in production!)
JWT_SECRET=your-secret-key-change-in-production

# AI Service URL
AI_SERVICE_URL=http://localhost:5000
"@ | Out-File -FilePath "backend\.env" -Encoding utf8
    Write-Success "Backend .env created"
}

if (-not (Test-Path "ai-service\.env")) {
    Write-Info "Creating ai-service/.env file..."
    @"
# OpenAI API Key (optional - service will use fallback if not set)
OPENAI_API_KEY=

# Server Configuration
PORT=5000
"@ | Out-File -FilePath "ai-service\.env" -Encoding utf8
    Write-Success "AI Service .env created"
}

# Step 2: Check Docker and start PostgreSQL
if (-not $SkipDocker) {
    Write-Step "Step 2: Starting PostgreSQL database in Docker..."
    
    # Check if Docker is running
    try {
        docker info | Out-Null
    } catch {
        Write-Error "Docker is not running! Please start Docker Desktop first."
        exit 1
    }
    
    # Check if container already exists
    $existingContainer = docker ps -a --filter "name=bhumi-postgres" --format "{{.Names}}"
    
    if ($existingContainer -eq "bhumi-postgres") {
        Write-Info "Database container exists, starting it..."
        docker start bhumi-postgres | Out-Null
    } else {
        Write-Info "Creating new database container..."
        docker-compose up -d
    }
    
    # Wait for database to be ready
    Write-Info "Waiting for database to be ready..."
    $maxRetries = 30
    $retryCount = 0
    
    while ($retryCount -lt $maxRetries) {
        try {
            $result = docker exec bhumi-postgres pg_isready -U postgres 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Database is ready!"
                break
            }
        } catch {
            # Continue waiting
        }
        Start-Sleep -Seconds 1
        $retryCount++
        Write-Host "." -NoNewline -ForegroundColor Gray
    }
    
    if ($retryCount -eq $maxRetries) {
        Write-Error "Database took too long to start. Please check Docker logs."
        exit 1
    }
} else {
    Write-Info "Skipping Docker setup (using existing database)"
}

# Step 3: Check if Python venv exists, create if not
Write-Step "Step 3: Setting up Python virtual environment..."

if (-not (Test-Path "ai-service\venv\Scripts\Activate.ps1")) {
    Write-Info "Creating Python virtual environment..."
    cd ai-service
    python -m venv venv
    cd ..
    
    Write-Info "Installing Python dependencies..."
    .\ai-service\venv\Scripts\pip.exe install -r ai-service\requirements.txt --quiet
    Write-Success "Python environment ready"
} else {
    Write-Success "Python environment already exists"
}

# Step 4: Run database migrations
Write-Step "Step 4: Running database migrations..."

try {
    cd backend
    $migrationResult = npx tsx src/db/migrate.ts 2>&1
    cd ..
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Database migrations completed"
    } else {
        Write-Error "Migration failed: $migrationResult"
        Write-Info "You may need to check your database connection in backend/.env"
    }
} catch {
    Write-Error "Migration error: $_"
}

# Step 5: Start all services in separate windows
Write-Step "Step 5: Starting all services..."

# Start Backend
Write-Info "Starting Backend on port 8000..."
$backendPath = (Resolve-Path "backend").Path
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'BACKEND SERVER - Port 8000' -ForegroundColor Cyan; npm run dev"

Start-Sleep -Seconds 2

# Start AI Service
Write-Info "Starting AI Service on port 5000..."
$aiServicePath = (Resolve-Path "ai-service").Path
$pythonExe = (Resolve-Path "ai-service\venv\Scripts\python.exe").Path
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$aiServicePath'; Write-Host 'AI SERVICE - Port 5000' -ForegroundColor Cyan; & '$pythonExe' app.py"

Start-Sleep -Seconds 2

# Start Frontend
Write-Info "Starting Frontend on port 3000..."
$frontendPath = (Resolve-Path "frontend").Path
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'FRONTEND - Port 3000' -ForegroundColor Cyan; npm run dev"

Start-Sleep -Seconds 2

# Final summary
Write-Host @"

╔═══════════════════════════════════════════════════════════╗
║              ALL SERVICES STARTED SUCCESSFULLY!           ║
╚═══════════════════════════════════════════════════════════╝

- Frontend:    http://localhost:3000
- Backend:     http://localhost:8000
- AI Service:  http://localhost:5000
- Database:    PostgreSQL (Docker) on port 5432

TIP: Open http://localhost:3000 in your browser to see the app!

To stop all services:
   - Close the PowerShell windows
   - Run: docker-compose down (to stop database)

"@ -ForegroundColor Green
