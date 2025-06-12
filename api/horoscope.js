import { getDailyHoroscope } from './utils/astroCalculations.js';

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
 * GET /api/horoscope?rashi=<vedic_sign>&type=daily
 */
export default async function handler(req, res) {
  console.log(`Horoscope API request: ${req.method} ${req.url}`);
  console.log('Query params:', req.query);
  
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
      rashi,
      type = 'daily',
      date
    } = req.query;

    // Support both Western zodiac signs and Vedic rashis
    const zodiacSign = sign || rashi;

    // Validate input
    if (!zodiacSign) {
      return res.status(400).json({
        success: false,
        message: 'Zodiac sign or rashi is required'
      });
    }

    // Validate sign - support both Western and Vedic
    const validWesternSigns = [
      'aries', 'taurus', 'gemini', 'cancer', 
      'leo', 'virgo', 'libra', 'scorpio', 
      'sagittarius', 'capricorn', 'aquarius', 'pisces'
    ];
    
    const validVedicRashis = [
      'mesh', 'vrishabh', 'mithun', 'kark', 
      'simha', 'kanya', 'tula', 'vrishchik', 
      'dhanu', 'makar', 'kumbh', 'meen'
    ];
    
    const normalizedSign = zodiacSign.toLowerCase();
    const isValidSign = validWesternSigns.includes(normalizedSign) || validVedicRashis.includes(normalizedSign);
    
    if (!isValidSign) {
      return res.status(400).json({
        success: false,
        message: 'Invalid zodiac sign or rashi',
        validWesternSigns,
        validVedicRashis
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

    let horoscope;
    
    // If it's a Vedic rashi and daily type, use the direct function
    if (validVedicRashis.includes(normalizedSign) && type.toLowerCase() === 'daily') {
      console.log(`Getting daily horoscope for Vedic rashi: ${normalizedSign}`);
      horoscope = await getDailyHoroscope(normalizedSign);
    } else if (validWesternSigns.includes(normalizedSign) && type.toLowerCase() === 'daily') {
      // Map Western signs to Vedic rashis for daily horoscope
      const westernToVedic = {
        'aries': 'mesh', 'taurus': 'vrishabh', 'gemini': 'mithun', 'cancer': 'kark',
        'leo': 'simha', 'virgo': 'kanya', 'libra': 'tula', 'scorpio': 'vrishchik',
        'sagittarius': 'dhanu', 'capricorn': 'makar', 'aquarius': 'kumbh', 'pisces': 'meen'
      };
      const vedicRashi = westernToVedic[normalizedSign];
      console.log(`Getting daily horoscope for Western sign ${normalizedSign} (mapped to ${vedicRashi})`);
      horoscope = await getDailyHoroscope(vedicRashi);
    } else {
      // Mock data for weekly and monthly horoscopes
      console.log(`Getting ${type} horoscope for sign: ${normalizedSign}`);
      horoscope = {
        sign: normalizedSign,
        type: type,
        date: date || new Date().toISOString().split('T')[0],
        prediction: {
          hindi: `यह एक मॉक ${type} राशिफल है ${normalizedSign} के लिए। वास्तविक डेटा जल्द ही लागू किया जाएगा।`,
          english: `This is a mock ${type} horoscope for ${normalizedSign}. Real data will be implemented soon.`
        },
        luckyColor: ['red', 'blue', 'green', 'yellow', 'purple'][Math.floor(Math.random() * 5)],
        luckyNumber: Math.floor(Math.random() * 100),
        advice: "सकारात्मक रहें और अपने लक्ष्यों पर ध्यान दें। (Stay positive and focus on your goals.)"
      };
    }
    
    console.log('Horoscope retrieved successfully');
    
    return res.status(200).json({
      success: true,
      data: horoscope
    });
  } catch (error) {
    console.error('Error in horoscope retrieval:', error);
    console.error('Error stack:', error.stack);
    
    return res.status(500).json({
      success: false,
      message: 'Horoscope retrieval error',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
};