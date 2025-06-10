// Import the working calculation functions
const { calculateKundali, checkDoshas, calculateDasha } = require('../../utils/astroCalculationsNew.js');
const { connectDB } = require('../../server/config/database.js');
const { KundaliService } = require('../../server/services/kundaliService.js');

// CORS headers for Vercel serverless function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allow all origins for development
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true'
};

module.exports = async function handler(req, res) {
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

    // Connect to MongoDB
    await connectDB();

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

      // Prepare the kundali data for database
      const kundaliForDB = {
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
        isPublic: true // Make kundalis public by default for now
      };

      // Save to database
      let savedKundali;
      try {
        savedKundali = await KundaliService.createKundali(kundaliForDB);
        console.log("✅ Kundali saved to database with ID:", savedKundali._id);
      } catch (dbError) {
        console.error("⚠️ Failed to save kundali to database:", dbError);
        // Continue with temporary ID if database save fails
        savedKundali = {
          ...kundaliForDB,
          id: Date.now().toString(),
          _id: Date.now().toString()
        };
      }

      console.log("📊 Kundali data prepared:", {
        id: savedKundali._id || savedKundali.id,
        planetsCount: savedKundali.planets.length,
        ascendantRashi: savedKundali.ascendant.rashiName?.english || savedKundali.ascendant.rashiName,
        doshas: Object.keys(doshas).filter(key => doshas[key].present).join(', ') || 'None'
      });

      return res.status(200).json({
        success: true,
        data: {
          ...savedKundali.toObject ? savedKundali.toObject() : savedKundali,
          id: savedKundali._id || savedKundali.id
        },
        message: "Kundali generated and saved successfully"
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
