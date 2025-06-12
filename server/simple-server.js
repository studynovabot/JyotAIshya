import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { calculateKundali, checkDoshas, calculateDasha } from "./utils/astroCalculationsNew.js";

console.log('🚀 Starting simple JyotAIshya server...');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all localhost origins
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Default fallback
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to JyotAIshya API",
    version: "1.0.0",
    description: "Vedic Astrology API for birth chart analysis",
    status: "running",
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
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
        doshas: Object.keys(doshas).filter(key => doshas[key].present).join(', ') || 'None'
      });

    } catch (calculationError) {
      console.error("❌ Error in kundali calculation:", calculationError);
      
      // Provide fallback data
      calculatedData = {
        name,
        dateOfBirth: new Date(birthDate),
        timeOfBirth: birthTime,
        placeOfBirth: birthPlace,
        coordinates: {
          latitude: 28.6139, // Default to Delhi
          longitude: 77.2090
        },
        ascendant: {
          longitude: 0,
          rashi: 0,
          rashiName: { english: "Aries", hindi: "मेष" },
          degree: 0
        },
        planets: [
          {
            id: 0,
            name: { english: "Sun", hindi: "सूर्य" },
            longitude: 30,
            rashi: 1,
            rashiName: { english: "Taurus", hindi: "वृषभ" },
            degree: 0
          }
        ],
        houses: [],
        doshas: {
          manglik: { present: false, description: "Analysis not available" },
          kaalSarp: { present: false, description: "Analysis not available" },
          sadeSati: { present: false, description: "Analysis not available" }
        },
        dashaPeriods: {
          currentDasha: {
            planet: { english: "Sun", hindi: "सूर्य" },
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
    console.error("❌ Error generating kundali:", error);
    res.status(500).json({
      success: false,
      message: "कुंडली उत्पन्न करने में विफल (Failed to generate kundali)",
      error: error.message
    });
  }
});

// CORS preflight handler
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

console.log('🌐 Starting server...');

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Simple JyotAIshya API running on port ${PORT}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`📚 Test endpoint: http://localhost:${PORT}/api/kundali/generate`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Export for Vercel
export default app;

console.log('📝 Server setup complete');
