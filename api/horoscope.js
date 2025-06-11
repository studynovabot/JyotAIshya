const { HoroscopeService } = require('../server/services/horoscopeService.js');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

/**
 * Horoscope Endpoint
 * GET /api/horoscope?sign=<zodiac_sign>&type=daily|weekly|monthly
 */
module.exports = async function handler(req, res) {
  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { 
      sign, 
      type = 'daily',
      date
    } = req.query;

    // Validate input
    if (!sign) {
      return res.status(400).json({
        success: false,
        message: 'Zodiac sign is required'
      });
    }

    // Validate sign
    const validSigns = [
      'aries', 'taurus', 'gemini', 'cancer', 
      'leo', 'virgo', 'libra', 'scorpio', 
      'sagittarius', 'capricorn', 'aquarius', 'pisces'
    ];
    
    if (!validSigns.includes(sign.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid zodiac sign'
      });
    }

    // Validate type
    const validTypes = ['daily', 'weekly', 'monthly'];
    if (!validTypes.includes(type.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid horoscope type. Supported types: daily, weekly, monthly'
      });
    }

    // Get horoscope
    const horoscope = await HoroscopeService.getHoroscope(
      sign.toLowerCase(),
      type.toLowerCase(),
      date
    );
    
    return res.status(200).json({
      success: true,
      data: horoscope
    });
  } catch (error) {
    console.error('Error in horoscope retrieval:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Horoscope retrieval error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};