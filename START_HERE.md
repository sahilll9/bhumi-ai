# 🎯 START HERE - How to Run Your Project
.\start-all.ps1
## ✅ What's Already Done
- ✅ All code is written
- ✅ Dependencies installed (backend & frontend)
- ✅ Backend compiled successfully

## 🚀 Quick Start (3 Steps)

### Step 1: Set Up Database

**If you have PostgreSQL:**
```powershell
createdb -U postgres bhumi_ai
```

**Or use Docker (easiest):**
```powershell
docker run --name bhumi-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=bhumi_ai -p 5432:5432 -d postgres
```

### Step 2: Configure Database Connection

Edit `backend/.env` file and update:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/bhumi_ai
```
(Change `password` to your PostgreSQL password)

### Step 3: Run Database Migration & Start Services

**A. Create database tables:**
```powershell
cd backend
npx tsx src/db/migrate.ts
```

**B. Start Backend (Terminal 1):**
```powershell
cd backend
npm run dev
```
✅ Should see: "Server running on port 8000"

**C. Start AI Service (Terminal 2):**
```powershell
cd ai-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
✅ Should see: "Running on http://0.0.0.0:5000"

**D. Start Frontend (Terminal 3):**
```powershell
cd frontend
npm run dev
```
✅ Should see: "Local: http://localhost:3000"

## 🎉 Open in Browser

**Go to: http://localhost:3000**

## 📱 What You Can Do

1. **Home Page** - See platform overview
2. **Dashboard** - View statistics (will show 0 until you add data)
3. **Villages** - Browse village data
4. **Scheme Advisor** - Get AI-powered scheme recommendations
5. **AI Chatbot** - Chat in multiple languages (English, Hindi, etc.)

## 🧪 Test It Works

1. **Backend Health:** http://localhost:8000/api/health
2. **AI Service:** http://localhost:5000/health  
3. **Frontend:** http://localhost:3000

## 💡 Quick Test - Create a Village

Once everything is running, you can test by creating a village via API:

```powershell
curl -X POST http://localhost:8000/api/villages `
  -H "Content-Type: application/json" `
  -d '{\"state_name\":\"Haryana\",\"district_name\":\"Kurukshetra\",\"village_name\":\"Test Village\",\"total_area\":100,\"net_area_sown\":60,\"unirrigated_area\":30,\"distance_to_town_km\":15}'
```

Then refresh the Villages page to see it!

## 🆘 Troubleshooting

**Database connection error?**
- Make sure PostgreSQL is running
- Check DATABASE_URL in backend/.env
- Verify database exists: `psql -U postgres -l`

**Port already in use?**
- Change PORT in backend/.env or ai-service/.env
- Frontend will auto-use next available port

**Need more help?**
- See `RUN_ME.md` for detailed instructions
- See `SETUP.md` for complete setup guide

---

**You're all set! 🎊**
