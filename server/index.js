import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Import database connection (temporarily commented out for debugging)
// import { connectDB } from './config/database.js';

// Import routes
console.log('📦 Importing routes...');
// Temporarily comment out routes to identify the problematic one
// import kundaliRoutes from "./routes/kundali.js";
// import horoscopeRoutes from "./routes/horoscope.js";
// import usersRoutes from "./routes/users.js";
// import compatibilityRoutes from "./routes/compatibility.js";
// import muhurtaRoutes from "./routes/muhurta.js";
// import aiRoutes from "./routes/ai.js";
console.log('✅ Routes imported (commented out for debugging)');

// Load environment variables
console.log('📁 Loading environment variables...');
dotenv.config();
console.log('✅ Environment variables loaded');

// Import environment check utility (temporarily commented out for debugging)
// import { checkEnvVariables } from './utils/envCheck.js';

// Check environment variables (temporarily disabled for debugging)
console.log('🔍 Skipping environment check for debugging...');

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.join(__dirname, "data");
const epheDir = path.join(dataDir, "ephe");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(epheDir)) {
  fs.mkdirSync(epheDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // In development, allow localhost origins
    if (process.env.NODE_ENV === 'development') {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000'
      ];
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
    }

    // In production, use the configured origin
    const allowedOrigin = process.env.CORS_ORIGIN || '*';
    if (allowedOrigin === '*' || origin === allowedOrigin) {
      return callback(null, true);
    }

    // Default fallback for development
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes (temporarily commented out for debugging)
// app.use("/api/kundali", kundaliRoutes);
// app.use("/api/horoscope", horoscopeRoutes);
// app.use("/api/users", usersRoutes);
// app.use("/api/compatibility", compatibilityRoutes);
// app.use("/api/muhurta", muhurtaRoutes);
// app.use("/api/ai", aiRoutes);

// Temporary test route
app.post("/api/kundali/generate", (req, res) => {
  console.log("Received kundali generation request:", req.body);
  res.json({
    success: true,
    message: "Temporary test endpoint - server is working",
    data: {
      name: req.body.name || "Test User",
      timestamp: new Date().toISOString()
    }
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to JyotAIshya API",
    version: "1.0.0",
    description: "Vedic Astrology API for birth chart analysis, horoscopes, compatibility matching, and more",
    endpoints: {
      kundali: "/api/kundali",
      horoscope: "/api/horoscope",
      users: "/api/users",
      compatibility: "/api/compatibility",
      muhurta: "/api/muhurta",
      ai: "/api/ai"
    }
  });
});

// Import error handler middleware
import { errorHandlerMiddleware } from './utils/errorHandler.js';

// Error handling middleware
app.use(errorHandlerMiddleware);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    console.log('🚀 Starting JyotAIshya server...');

    // Start server first
    console.log('🌐 Starting Express server...');
    const server = app.listen(PORT, () => {
      console.log(`✅ JyotAIshya API running on port ${PORT}`);
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
      console.log(`📚 Available endpoints:`);
      console.log(`   - Kundali: http://localhost:${PORT}/api/kundali`);
      console.log(`   - Horoscope: http://localhost:${PORT}/api/horoscope`);
      console.log(`   - Users: http://localhost:${PORT}/api/users`);
      console.log(`   - Compatibility: http://localhost:${PORT}/api/compatibility`);
      console.log(`   - Muhurta: http://localhost:${PORT}/api/muhurta`);
      console.log(`   - AI: http://localhost:${PORT}/api/ai`);
    });

    // Connect to MongoDB after server starts (temporarily disabled for debugging)
    console.log('⚠️ MongoDB connection disabled for debugging');

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
