import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import kundaliRoutes from "./routes/kundali.js";
import horoscopeRoutes from "./routes/horoscope.js";
import usersRoutes from "./routes/users.js";
import compatibilityRoutes from "./routes/compatibility.js";
import muhurtaRoutes from "./routes/muhurta.js";

// Load environment variables
dotenv.config();

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
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/kundali", kundaliRoutes);
app.use("/api/horoscope", horoscopeRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/compatibility", compatibilityRoutes);
app.use("/api/muhurta", muhurtaRoutes);

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
      muhurta: "/api/muhurta"
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`JyotAIshya API running on port ${PORT}`);
  console.log(`Server URL: http://localhost:${PORT}`);
});

export default app;
