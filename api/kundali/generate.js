import { calculateKundali, checkDoshas, calculateDasha } from '../../server/utils/astroCalculationsNew.js';

// CORS headers for Vercel serverless function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true'
};

export default async function handler(req, res) {
  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    console.log("🔮 Received kundali generation request:", req.body);
    console.log("📡 Request headers:", req.headers);

    const { name, birthDate, birthTime, birthPlace } = req.body;

    // Validate input
    if (!name || !birthDate || !birthTime || !birthPlace) {
      return res.status(400).json({
        success: false,
        message: "कृपया सभी आवश्यक जानकारी प्रदान करें (Please provide all required fields)"
      });
    }

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
      
      // Provide fallback data for robustness
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
          manglik: { present: false, description: "Analysis not available due to calculation error" },
          kaalSarp: { present: false, description: "Analysis not available due to calculation error" },
          sadeSati: { present: false, description: "Analysis not available due to calculation error" }
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

    return res.status(200).json({
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
    return res.status(500).json({
      success: false,
      message: "कुंडली उत्पन्न करने में विफल (Failed to generate kundali)",
      error: error.message
    });
  }
}
