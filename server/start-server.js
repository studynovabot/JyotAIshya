// Server startup script with error handling
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

console.log('Environment variables loaded');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

console.log('Middleware configured');

// Simple routes
app.get("/", (req, res) => {
  console.log('Root endpoint hit');
  res.json({
    message: "JyotAIshya API is running",
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

app.get("/api/health", (req, res) => {
  console.log('Health endpoint hit');
  res.json({
    status: "OK",
    message: "Server is healthy"
  });
});

app.get("/api/ai/health", (req, res) => {
  console.log('AI Health endpoint hit');
  res.json({
    status: "OK",
    message: "AI service is healthy"
  });
});

console.log('Routes configured');

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// Start server with error handling
try {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server successfully started on port ${PORT}`);
    console.log(`🌐 Server URL: http://localhost:${PORT}`);
    console.log(`📡 Server listening on all interfaces (0.0.0.0:${PORT})`);
  });

  server.on('error', (err) => {
    console.error('❌ Server error:', err);
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please use a different port.`);
    }
  });

  // Handle process termination
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });

} catch (error) {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
}
