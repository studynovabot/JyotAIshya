import { calculateKundali, calculateDasha } from '../utils/astroCalculationsNew.js';

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
    console.log("⏰ Received dasha calculation request:", req.body);

    const { name, birthDate, birthTime, birthPlace } = req.body;

    // Validate input
    if (!name || !birthDate || !birthTime || !birthPlace) {
      return res.status(400).json({ 
        success: false, 
        message: "कृपया सभी आवश्यक जानकारी प्रदान करें (Please provide all required fields)" 
      });
    }

    console.log("⏰ Calculating dasha for:", { name, birthDate, birthTime, birthPlace });

    // Calculate kundali
    const kundaliData = await calculateKundali(name, birthDate, birthTime, birthPlace);
    
    // Calculate dasha periods
    const dashaPeriods = calculateDasha(kundaliData);

    console.log("✅ Dasha calculation completed");

    return res.status(200).json({
      success: true,
      data: {
        name,
        dashaPeriods
      }
    });

  } catch (error) {
    console.error("❌ Error calculating dasha:", error);
    return res.status(500).json({ 
      success: false, 
      message: "दशा गणना में त्रुटि (Error in dasha calculation)", 
      error: error.message 
    });
  }
}
