const { getDailyHoroscope } = require('../../utils/astroCalculationsNew.js');

// CORS headers for Vercel serverless function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
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

  // Allow both GET and POST requests
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    console.log("🌟 Received daily horoscope request");

    // Get rashi from query params (GET) or body (POST)
    const rashi = req.method === 'GET' ? req.query.rashi : req.body.rashi;

    if (!rashi) {
      return res.status(400).json({
        success: false,
        message: "कृपया राशि प्रदान करें (Please provide rashi/zodiac sign)"
      });
    }

    console.log("🌟 Getting daily horoscope for rashi:", rashi);

    // Get daily horoscope
    const horoscope = await getDailyHoroscope(rashi);

    console.log("✅ Daily horoscope retrieved");

    return res.status(200).json({
      success: true,
      data: horoscope
    });

  } catch (error) {
    console.error("❌ Error getting daily horoscope:", error);
    return res.status(500).json({
      success: false,
      message: "दैनिक राशिफल प्राप्त करने में त्रुटि (Error getting daily horoscope)",
      error: error.message
    });
  }
}
