# AI Field Survey & Rural Intelligence Platform

Full-stack AI-powered platform for village data analysis, scheme recommendations, and rural governance intelligence.

## Tech Stack

### Backend (Main API)
- **Node.js** + **TypeScript** - Main backend server
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication

### AI Service (Microservice)
- **Python** + **Flask** - AI chatbot service
- **Groq SDK** - Llama 3.1 & 3.2 (Vision) for high-performance rural intelligence
- **Vision Models** - Llama 3.2 11B/90B for document fraud detection

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization

## Project Structure

```
bhumi-ai/
├── backend/          # Node.js/Express API
│   ├── src/
│   │   ├── routes/   # API endpoints
│   │   ├── db/       # Database connection & schema
│   │   ├── utils/    # AI calculations, scheme matching
│   │   └── middleware/ # Auth middleware
├── ai-service/       # Python Flask microservice (AI only)
│   └── app.py        # Chatbot service
├── frontend/         # React frontend
└── database/         # PostgreSQL
```

## Setup Instructions

### 1. Database Setup

```bash
# Install PostgreSQL, then create database
createdb bhumi_ai

# Or using psql
psql -U postgres
CREATE DATABASE bhumi_ai;
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file (copy from .env.example)
cp .env.example .env
# Edit .env with your database URL

# Run migrations
npm run migrate

# Start dev server
npm run dev
```

Backend runs on `http://localhost:8000`

### 3. AI Service Setup

```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add your GROQ_API_KEY

# Start service
python app.py
```

AI service runs on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/bhumi_ai
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
AI_SERVICE_URL=http://localhost:5000
PORT=8000
```

### AI Service (.env)
```
GROQ_API_KEY=your_groq_api_key
PORT=5000
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/villages` - Get villages
- `POST /api/villages` - Create village
- `GET /api/farmers` - Get farmers
- `POST /api/farmers` - Create farmer
- `GET /api/farmers/:id/schemes` - Get farmer scheme recommendations
- `POST /api/chatbot/chat` - Chat with AI assistant
- `GET /api/dashboard/stats` - Dashboard statistics

## Features

- ✅ Village data management with AI indicators
- ✅ Farmer profile management
- ✅ AI-powered scheme recommendations
- ✅ **Upgraded**: Groq-powered high-speed Multilingual Chatbot
- ✅ **New**: Vision-based Fake Document Detection (Fraud Risk Analysis)
- ✅ Anomaly detection
- ✅ Dashboard analytics
- ✅ JWT authentication

## License

MIT
