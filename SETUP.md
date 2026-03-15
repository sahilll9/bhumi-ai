# Setup Guide

Complete setup instructions for the AI Field Survey Platform.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- Python 3.11+ (for AI service only)
- npm or yarn

## Step 1: Database Setup

```bash
# Create PostgreSQL database
createdb bhumi_ai

# Or using psql
psql -U postgres
CREATE DATABASE bhumi_ai;
\q
```

## Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your database credentials:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/bhumi_ai
# JWT_SECRET=your_secret_key_here
# AI_SERVICE_URL=http://localhost:5000

# Run database migrations (creates tables and initializes schemes)
npm run build
npm run migrate

# Start backend server
npm run dev
```

Backend will run on `http://localhost:8000`

## Step 3: AI Service Setup (Python)

```bash
cd ai-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Add your OpenAI API key to .env:
# OPENAI_API_KEY=your_openai_api_key_here

# Start AI service
python app.py
```

AI service will run on `http://localhost:5000`

**Note:** If you don't have an OpenAI API key, the service will still work with fallback rule-based responses.

## Step 4: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## Step 5: Import Village Data (Optional)

If you have CSV data from your notebook:

```bash
cd backend

# Install csv-parse if not already installed
npm install csv-parse

# Run import script
npx tsx scripts/importVillageData.ts path/to/your/village_data.csv
```

## Testing the Setup

1. Open `http://localhost:3000` in your browser
2. Check backend health: `http://localhost:8000/api/health`
3. Check AI service health: `http://localhost:5000/health`

## Troubleshooting

### Database Connection Error
- Make sure PostgreSQL is running
- Check DATABASE_URL in backend/.env
- Verify database name is correct

### AI Service Not Responding
- Check if Python service is running on port 5000
- Verify OPENAI_API_KEY is set (or use fallback mode)
- Check AI_SERVICE_URL in backend/.env matches AI service port

### Frontend Can't Connect to Backend
- Verify backend is running on port 8000
- Check CORS settings in backend/src/index.ts
- Make sure VITE_API_URL in frontend matches backend URL

## Production Deployment

For production:
1. Set NODE_ENV=production
2. Use strong JWT_SECRET
3. Configure proper CORS origins
4. Use environment-specific database URLs
5. Build frontend: `cd frontend && npm run build`
6. Serve frontend build files with a web server
