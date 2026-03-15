# ⚡ QUICK START - ONE COMMAND TO RULE THEM ALL

## 🚀 START EVERYTHING

```powershell
.\start-all.ps1
```

**That's it!** This starts:
- ✅ PostgreSQL database (Docker)
- ✅ Backend API (port 8000)
- ✅ AI Service (port 5000)
- ✅ Frontend (port 3000)

**Open:** http://localhost:3000

---

## 🛑 STOP EVERYTHING

1. Close the 3 PowerShell windows
2. Stop database:
   ```powershell
   docker-compose down
   ```

---

## 📋 REQUIREMENTS

- ✅ Docker Desktop installed and running
- ✅ Node.js 18+ installed
- ✅ Python 3.11+ installed

---

## 🔍 VERIFY IT'S WORKING

- Frontend: http://localhost:3000
- Backend: http://localhost:8000/api/health
- AI Service: http://localhost:5000/health

---

## 📚 MORE INFO

See `PRESENTATION_GUIDE.md` for detailed explanation and demo flow.

---

**For presentation, just run `.\start-all.ps1` and you're ready! 🎉**
