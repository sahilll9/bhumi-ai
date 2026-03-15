# Tech Stack Overview

## Backend (Main API Server)
- **Node.js** + **TypeScript** - Primary backend language
- **Express.js** - Web framework for REST API
- **PostgreSQL** - Relational database
- **pg** (node-postgres) - PostgreSQL client
- **JWT** (jsonwebtoken) - Authentication
- **bcryptjs** - Password hashing

**Why Node.js instead of Python?**
- Better performance for I/O operations
- Single language (TypeScript) for frontend and backend
- Large ecosystem and community
- Easy deployment options

## AI Service (Microservice)
- **Python** + **Flask** - AI chatbot service
- **OpenAI API** - GPT-3.5 for multilingual conversations
- **Flask-CORS** - Cross-origin requests

**Why Python for AI only?**
- Python is industry standard for AI/ML
- Better libraries for AI (OpenAI SDK)
- Easy to integrate with AI models
- Can be scaled independently

## Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS
- **Recharts** - Data visualization
- **React Router** - Client-side routing
- **Axios** - HTTP client

## Database
- **PostgreSQL** - Production-ready relational database
- Supports JSONB for flexible data storage
- ACID compliance for data integrity

## Architecture

```
┌─────────────┐
│  Frontend   │ (React + TypeScript)
│  Port 3000  │
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────┐
│   Backend   │ (Node.js + Express)
│  Port 8000  │
└──────┬──────┘
       │
       ├──► PostgreSQL (Database)
       │
       └──► AI Service (Python Flask)
            Port 5000
```

## Key Features

1. **Separation of Concerns**
   - Backend handles business logic
   - AI service handles only AI/chatbot
   - Frontend handles UI/UX

2. **Scalability**
   - Each service can scale independently
   - Microservice architecture
   - Easy to add more services

3. **Type Safety**
   - TypeScript throughout
   - Compile-time error checking
   - Better developer experience

4. **Production Ready**
   - Environment variables for config
   - Error handling
   - Authentication & authorization
   - Database migrations
