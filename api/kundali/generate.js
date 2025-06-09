// Import the working calculation functions
import { calculateKundali, checkDoshas, calculateDasha } from '../utils/astroCalculationsNew.js';

// CORS headers for Vercel serverless function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allow all origins for development
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

    try {
      // Calculate kundali using the working server functions
      console.log("🔮 Calculating kundali using server functions...");
      const kundaliData = await calculateKundali(name, birthDate, birthTime, birthPlace);

      // Check for doshas
      const doshas = checkDoshas(kundaliData);

      // Calculate dasha periods
      const dashaPeriods = calculateDasha(kundaliData);

      console.log("✅ Kundali calculation completed successfully");

      // Prepare the response data (matching server format)
      const calculatedData = {
        name,
        dateOfBirth: new Date(birthDate),
        timeOfBirth: birthTime,
        placeOfBirth: birthPlace,
        coordinates: {
          latitude: kundaliData.latitude || kundaliData.birthDetails?.coordinates?.latitude,
          longitude: kundaliData.longitude || kundaliData.birthDetails?.coordinates?.longitude
        },
        ascendant: kundaliData.ascendant,
        planets: kundaliData.planets,
        houses: kundaliData.houses,
        doshas,
        dashaPeriods,
        ayanamsa: kundaliData.ayanamsa,
        calculationInfo: kundaliData.calculationInfo,
        id: Date.now().toString() // Temporary ID for frontend
      };

      console.log("📊 Kundali data prepared:", {
        planetsCount: calculatedData.planets.length,
        ascendantRashi: calculatedData.ascendant.rashiName?.english || calculatedData.ascendant.rashiName,
        doshas: Object.keys(doshas).filter(key => doshas[key].present).join(', ') || 'None'
      });

      return res.status(200).json({
        success: true,
        data: calculatedData,
        message: "Kundali generated successfully with real astrological calculations"
      });

    } catch (calculationError) {
      console.error("❌ Error in kundali calculation:", calculationError);

      return res.status(500).json({
        success: false,
        message: "कुंडली उत्पन्न करने में विफल (Failed to generate kundali)",
        error: calculationError.message
      });
    }

  } catch (error) {
    console.error("❌ Error generating kundali:", error);
    return res.status(500).json({
      success: false,
      message: "कुंडली उत्पन्न करने में विफल (Failed to generate kundali)",
      error: error.message
    });
  }
}
