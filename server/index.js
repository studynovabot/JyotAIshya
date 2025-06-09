import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Import database connection
import { connectDB } from './config/database.js';

// Import routes
console.log('📦 Importing routes...');
import kundaliRoutes from "./routes/kundali.js";
import horoscopeRoutes from "./routes/horoscope.js";
import usersRoutes from "./routes/users.js";
import compatibilityRoutes from "./routes/compatibility.js";
import muhurtaRoutes from "./routes/muhurta.js";
import aiRoutes from "./routes/ai.js";
console.log('✅ Routes imported successfully');

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
    console.log('CORS request from origin:', origin);

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // In development, allow localhost origins
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        'http://localhost:5174', // Alternative Vite port
        'http://127.0.0.1:5174'
      ];
      if (allowedOrigins.includes(origin)) {
        console.log('CORS: Allowing development origin:', origin);
        return callback(null, true);
      }
    }

    // Allow Vercel deployments
    if (origin && origin.includes('vercel.app')) {
      console.log('CORS: Allowing Vercel origin:', origin);
      return callback(null, true);
    }

    // In production, use the configured origin
    const allowedOrigin = process.env.CORS_ORIGIN || '*';
    if (allowedOrigin === '*' || origin === allowedOrigin) {
      console.log('CORS: Allowing configured origin:', origin);
      return callback(null, true);
    }

    // Default fallback for development
    if (process.env.NODE_ENV !== 'production') {
      console.log('CORS: Allowing non-production origin:', origin);
      return callback(null, true);
    }

    console.log('CORS: Rejecting origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/kundali", kundaliRoutes);
app.use("/api/horoscope", horoscopeRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/compatibility", compatibilityRoutes);
app.use("/api/muhurta", muhurtaRoutes);
app.use("/api/ai", aiRoutes);

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

    // Connect to MongoDB first
    try {
      await connectDB();
      console.log('✅ MongoDB connection established');
    } catch (dbError) {
      console.error('⚠️ MongoDB connection failed, continuing without database:', dbError.message);
    }

    // Start server only if not in Vercel environment
    if (!process.env.VERCEL) {
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
    } else {
      console.log('✅ JyotAIshya API ready for Vercel serverless deployment');
    }

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

// Start the server
startServer();

// Export the app for Vercel
export default app;
