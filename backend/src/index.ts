/**
 * ============================================================================
 * BACKEND SERVER - MAIN ENTRY POINT
 * ============================================================================
 * This is the main Express.js server that handles all API requests.
 * It connects to PostgreSQL database and provides RESTful API endpoints.
 * 
 * Architecture:
 * - Express.js: Web framework for Node.js
 * - PostgreSQL: Database for storing villages, farmers, schemes data
 * - CORS: Allows frontend to make API calls from different origin
 * 
 * Port: 8000 (configurable via .env file)
 * ============================================================================
 */

// Import required libraries
import express from 'express';           // Web framework for handling HTTP requests
import cors from 'cors';                 // Cross-Origin Resource Sharing - allows frontend to call API
import dotenv from 'dotenv';             // Loads environment variables from .env file
import { pool } from './db/connection';  // PostgreSQL database connection pool

// Import route handlers (each handles specific API endpoints)
import villageRoutes from './routes/villages';    // Village data CRUD operations
import farmerRoutes from './routes/farmers';      // Farmer profile management
import schemeRoutes from './routes/schemes';      // Government schemes management
import chatbotRoutes from './routes/chatbot';     // AI chatbot integration
import authRoutes from './routes/auth';           // User authentication & authorization
import dashboardRoutes from './routes/dashboard'; // Dashboard statistics

// Load environment variables from .env file (database URL, secrets, etc.)
dotenv.config();

// Create Express application instance
const app = express();

// Get port from environment variable or use default 8000
const PORT = process.env.PORT || 8000;

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================
// Middleware functions run on every request before routes

app.use(cors());          // Enable CORS - allows frontend (localhost:3000) to call this API
app.use(express.json());  // Parse JSON request bodies (convert JSON to JavaScript objects)

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// ============================================================================
// API ENDPOINTS
// ============================================================================

/**
 * Health Check Endpoint
 * GET /api/health
 * 
 * Purpose: Check if server and database are working
 * Response: { status: 'healthy', database: 'connected' }
 * 
 * Use this to verify everything is running correctly
 */
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection by running a simple query
    await pool.query('SELECT 1');
    // If query succeeds, database is connected
    res.json({ status: 'healthy', database: 'connected' });
  } catch (err) {
    // If query fails, database connection has issues
    res.status(500).json({ status: 'unhealthy', error: 'DB connection failed' });
  }
});

/**
 * Root Endpoint
 * GET /
 * 
 * Purpose: API information endpoint
 * Response: API name and version
 */
app.get('/', (req, res) => {
  res.json({
    message: 'AI Field Survey & Rural Intelligence Platform API',
    version: '1.0.0'
  });
});

// ============================================================================
// ROUTE HANDLERS
// ============================================================================
// Mount route handlers - each handles specific API endpoints

app.use('/api/auth', authRoutes);        // Authentication: /api/auth/login, /api/auth/register
app.use('/api/villages', villageRoutes); // Villages: /api/villages (GET, POST, PUT, DELETE)
app.use('/api/farmers', farmerRoutes);   // Farmers: /api/farmers (CRUD operations)
app.use('/api/schemes', schemeRoutes);   // Schemes: /api/schemes (list schemes, get details)
app.use('/api/chatbot', chatbotRoutes);  // Chatbot: /api/chatbot/chat (AI conversations)
app.use('/api/dashboard', dashboardRoutes); // Dashboard: /api/dashboard/stats (statistics)

// ============================================================================
// START SERVER
// ============================================================================
// Listen for incoming HTTP requests on specified port

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
