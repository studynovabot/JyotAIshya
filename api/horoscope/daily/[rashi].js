import { getDailyHoroscope } from '../../utils/astroCalculations.js';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

/**
 * Daily Horoscope Endpoint for specific rashi
 * GET /api/horoscope/daily/[rashi]
 */
export default async function handler(req, res) {
  console.log(`Daily horoscope request: ${req.method} ${req.url}`);
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
    const { rashi } = req.query;
    
    console.log(`Fetching daily horoscope for rashi: ${rashi}`);
    
    // Validate rashi (Vedic zodiac sign)
    const validRashis = [
      "mesh", "vrishabh", "mithun", "kark", 
      "simha", "kanya", "tula", "vrishchik", 
      "dhanu", "makar", "kumbh", "meen"
    ];
    
    if (!rashi || !validRashis.includes(rashi.toLowerCase())) {
      console.log(`Invalid rashi: ${rashi}`);
      return res.status(400).json({ 
        success: false, 
        message: "Invalid rashi. Please provide a valid Vedic rashi name.",
        validRashis: validRashis
      });
    }

    // Get horoscope
    console.log(`Calling getDailyHoroscope for ${rashi}`);
    const horoscope = await getDailyHoroscope(rashi.toLowerCase());
    
    console.log('Daily horoscope fetched successfully');
    
    return res.status(200).json({
      success: true,
      data: horoscope
    });
  } catch (error) {
    console.error("Error fetching daily horoscope:", error);
    console.error("Error stack:", error.stack);
    
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch horoscope", 
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
}