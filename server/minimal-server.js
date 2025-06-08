import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { calculateKundali, checkDoshas, calculateDasha } from "./utils/astroCalculationsNew.js";

console.log('🚀 Starting minimal server...');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log('⚙️ Setting up middleware...');

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

console.log('🛣️ Setting up routes...');

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to JyotAIshya API",
    version: "1.0.0",
    description: "Vedic Astrology API for birth chart analysis, horoscopes, compatibility matching, and more",
    status: "running",
    timestamp: new Date().toISOString()
  });
});

// Kundali generation API route
app.post("/api/kundali/generate", async (req, res) => {
  try {
    console.log("🔮 Received kundali generation request:", req.body);
    console.log("📡 Request headers:", req.headers);
    console.log("🌐 Request origin:", req.headers.origin);

    const { name, birthDate, birthTime, birthPlace } = req.body;

    // Validate input
    if (!name || !birthDate || !birthTime || !birthPlace) {
      return res.status(400).json({
        success: false,
        message: "कृपया सभी आवश्यक जानकारी प्रदान करें (Please provide all required fields)"
      });
    }

    // Calculate actual kundali using the astrological calculation functions
    console.log("🔮 Calculating kundali for:", { name, birthDate, birthTime, birthPlace });

    let calculatedData;

    try {
      // Calculate kundali using the real astrological functions
      const kundaliData = await calculateKundali(name, birthDate, birthTime, birthPlace);

      // Check for doshas
      const doshas = checkDoshas(kundaliData);

      // Calculate dasha periods
      const dashaPeriods = calculateDasha(kundaliData);

      console.log("✅ Kundali calculation completed successfully");

      // Prepare the response data
      calculatedData = {
        name,
        dateOfBirth: new Date(birthDate),
        timeOfBirth: birthTime,
        placeOfBirth: birthPlace,
        coordinates: {
          latitude: kundaliData.birthDetails.coordinates.latitude,
          longitude: kundaliData.birthDetails.coordinates.longitude
        },
        ascendant: kundaliData.ascendant,
        planets: kundaliData.planets,
        houses: kundaliData.houses,
        doshas,
        dashaPeriods,
        ayanamsa: kundaliData.ayanamsa,
        calculationInfo: kundaliData.calculationInfo
      };

      console.log("📊 Kundali data prepared:", {
        planetsCount: calculatedData.planets.length,
        ascendantRashi: calculatedData.ascendant.rashiName?.english || calculatedData.ascendant.rashiName,
        doshas: Object.keys(doshas).filter(key => doshas[key]).join(', ') || 'None'
      });

    } catch (calculationError) {
      console.error("❌ Error in kundali calculation:", calculationError);

      // If calculation fails, return a simplified mock response
      console.log("🔄 Falling back to simplified calculation...");

      calculatedData = {
        name,
        dateOfBirth: new Date(birthDate),
        timeOfBirth: birthTime,
        placeOfBirth: birthPlace,
        coordinates: {
          latitude: 28.6139, // Delhi coordinates as default
          longitude: 77.2090
        },
        ascendant: {
          longitude: 45.5,
          rashi: 1,
          rashiName: { english: "Taurus", name: "Vrishabh (वृषभ)" },
          degree: 15.5
        },
        planets: [
          {
            id: 0,
            name: "Sun",
            longitude: 280.5,
            rashi: 9,
            rashiName: "Capricorn",
            degree: 10.5,
            isRetrograde: false
          },
          {
            id: 1,
            name: "Moon",
            longitude: 120.3,
            rashi: 3,
            rashiName: "Cancer",
            degree: 0.3,
            isRetrograde: false
          }
        ],
        houses: Array.from({ length: 12 }, (_, i) => ({
          house: i + 1,
          cusp: (i * 30) % 360,
          planets: []
        })),
        doshas: {
          manglik: false,
          kaalSarp: false,
          sadeSati: false
        },
        dashaPeriods: {
          currentDasha: {
            planet: "Moon",
            startDate: birthDate,
            endDate: "2030-01-01",
            remainingYears: 5.5
          }
        },
        calculationError: calculationError.message
      };
    }

    res.status(200).json({
      success: true,
      data: {
        ...calculatedData,
        id: Date.now().toString() // Temporary ID for frontend
      },
      message: calculatedData.calculationError
        ? "Kundali generated with fallback data (calculation error occurred)"
        : "Kundali generated successfully with real astrological calculations"
    });
  } catch (error) {
    console.error("Error generating kundali:", error);
    res.status(500).json({
      success: false,
      message: "कुंडली उत्पन्न करने में विफल (Failed to generate kundali)",
      error: error.message
    });
  }
});

// Additional API endpoints that the frontend might need

// Health check endpoint
app.get("/api/health", (req, res) => {
  console.log("🏥 Health check requested from:", req.headers.origin || 'unknown');
  res.json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cors: "enabled",
    endpoints: [
      "/api/kundali/generate",
      "/api/health",
      "/api/users/me",
      "/api/users/me/kundalis"
    ]
  });
});

// User endpoints (mock for now)
app.get("/api/users/me", (req, res) => {
  res.json({
    success: true,
    data: {
      id: "mock-user-id",
      name: "Test User",
      email: "test@example.com",
      createdAt: new Date().toISOString()
    }
  });
});

app.get("/api/users/me/kundalis", (req, res) => {
  res.json({
    success: true,
    data: [],
    message: "No saved kundalis found (database not connected)"
  });
});

// CORS preflight handler
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

console.log('🌐 Starting server...');

// Start server
app.listen(PORT, () => {
  console.log(`✅ Minimal JyotAIshya API running on port ${PORT}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`📚 Test endpoint: http://localhost:${PORT}/api/kundali/generate`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

console.log('📝 Server setup complete');
