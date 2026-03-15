# 🚀 How to Run the Project

## Quick Setup (3 Steps)

### Step 1: Install Dependencies ✅ (Already Done!)
Backend and frontend dependencies are installed.

### Step 2: Set Up Database

**Option A: If you have PostgreSQL installed**
```powershell
# Create database
createdb -U postgres bhumi_ai

# Or manually:
psql -U postgres
CREATE DATABASE bhumi_ai;
\q
```

**Option B: Use Docker (Easiest!)**
```powershell
docker run --name bhumi-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=bhumi_ai -p 5432:5432 -d postgres
```

**Option C: Use the setup script**
```powershell
.\setup-database.ps1
```

### Step 3: Configure & Run

**A. Update Database URL in `backend/.env`:**
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/bhumi_ai
```
(Change `password` to your PostgreSQL password)

**B. Run Database Migrations:**
```powershell
cd backend
npm run build
npx tsx src/db/migrate.ts
```

**C. Start All Services:**

**Easy Way - Use the script:**
```powershell
.\run-dev.ps1
```

**Manual Way - Open 3 terminals:**

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - AI Service:**
```powershell
cd ai-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**Terminal 3 - Frontend:**
```powershell
cd frontend
npm run dev
```

## 🎉 Open in Browser

Go to: **http://localhost:3000**

## What You'll See

1. **Home Page** - Overview of the platform
2. **Dashboard** - Statistics and charts
3. **Villages** - View village data (empty until you import data)
4. **Scheme Advisor** - Get scheme recommendations for farmers
5. **AI Chatbot** - Multilingual assistant

## Testing the API

- Backend Health: http://localhost:8000/api/health
- AI Service Health: http://localhost:5000/health
- API Docs: http://localhost:8000 (when backend is running)

## Troubleshooting

### "Cannot connect to database"
- Make sure PostgreSQL is running
- Check DATABASE_URL in backend/.env
- Verify database exists: `psql -U postgres -l`

### "Port already in use"
- Backend (8000): Change PORT in backend/.env
- AI Service (5000): Change PORT in ai-service/.env
- Frontend (3000): Vite will auto-use next port

### "Module not found"
- Run `npm install` in backend and frontend
- Run `pip install -r requirements.txt` in ai-service

## Next Steps

1. **Import Village Data** (if you have CSV):
   ```powershell
   cd backend
   npx tsx scripts/importVillageData.ts "path\to\your\data.csv"
   ```

2. **Create Test Data:**
   - Use the API to create villages and farmers
   - Or use the frontend forms (when implemented)

3. **Test Chatbot:**
   - Go to Chatbot page
   - Ask: "Tell me about PM-KISAN"
   - Try different languages!

## Need Help?

Check:
- `SETUP.md` - Detailed setup instructions
- `QUICK_START.md` - Quick reference
- `TECH_STACK.md` - Technology overview
