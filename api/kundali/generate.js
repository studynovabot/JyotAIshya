// Import the working calculation functions
const { calculateKundali, checkDoshas, calculateDasha } = require('../../utils/astroCalculationsNew.js');
const { storeKundali, getKundali } = require('./shared-storage.js');

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

  // Handle GET requests (retrieve kundali)
  if (req.method === 'GET') {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Kundali ID is required for GET requests'
        });
      }

      console.log(`🔍 Retrieving kundali with ID: ${id}`);
      const kundali = getKundali(id);

      if (!kundali) {
        console.log(`❌ Kundali ${id} not found in storage`);
        return res.status(404).json({
          success: false,
          message: 'Kundali not found. Please regenerate your kundali.',
          requestedId: id
        });
      }

      console.log(`✅ Found kundali: ${kundali.name} from ${kundali.placeOfBirth}`);
      return res.status(200).json({
        success: true,
        data: kundali,
        message: 'Kundali retrieved successfully'
      });
    } catch (error) {
      console.error('Error retrieving kundali:', error);
      return res.status(500).json({
        success: false,
        message: 'Error retrieving kundali',
        error: error.message
      });
    }
  }

  // Only allow POST requests for generation
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST to generate or GET to retrieve.'
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

      // Prepare kundali data for storage
      const kundaliId = Date.now().toString();
      const responseData = {
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
        id: kundaliId,
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Store in shared storage
      storeKundali(kundaliId, responseData);

      console.log("📊 Kundali data prepared:", {
        id: responseData.id,
        planetsCount: responseData.planets.length,
        ascendantRashi: responseData.ascendant.rashiName?.english || responseData.ascendant.rashiName,
        doshas: Object.keys(doshas).filter(key => doshas[key].present).join(', ') || 'None'
      });

      return res.status(200).json({
        success: true,
        data: responseData,
        message: "Kundali generated successfully (temporary storage)"
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
