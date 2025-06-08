import { calculateKundali, checkDoshas } from '../utils/astroCalculationsNew.js';

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
    console.log("🔍 Received dosha check request:", req.body);

    const { name, birthDate, birthTime, birthPlace, doshaTypes } = req.body;

    // Validate input
    if (!name || !birthDate || !birthTime || !birthPlace) {
      return res.status(400).json({ 
        success: false, 
        message: "कृपया सभी आवश्यक जानकारी प्रदान करें (Please provide all required fields)" 
      });
    }

    console.log("🔍 Checking doshas for:", { name, birthDate, birthTime, birthPlace });

    // Calculate kundali
    const kundaliData = await calculateKundali(name, birthDate, birthTime, birthPlace);
    
    // Check for specific doshas
    let doshaResults = {};
    
    if (!doshaTypes || doshaTypes.length === 0) {
      // Check all doshas if none specified
      doshaResults = checkDoshas(kundaliData);
    } else {
      // Check only specified doshas
      const allDoshas = checkDoshas(kundaliData);
      doshaTypes.forEach(doshaType => {
        switch(doshaType.toLowerCase()) {
          case "manglik":
          case "mangal":
            doshaResults.manglik = allDoshas.manglik;
            break;
          case "kaalsarp":
          case "kalasarpa":
            doshaResults.kaalSarp = allDoshas.kaalSarp;
            break;
          case "sadesati":
          case "sadhe-sati":
            doshaResults.sadeSati = allDoshas.sadeSati;
            break;
          default:
            // Ignore invalid dosha types
            break;
        }
      });
    }

    console.log("✅ Dosha analysis completed");

    return res.status(200).json({
      success: true,
      data: {
        name,
        doshas: doshaResults
      }
    });

  } catch (error) {
    console.error("❌ Error checking doshas:", error);
    return res.status(500).json({ 
      success: false, 
      message: "दोष जांच में त्रुटि (Error in dosha check)", 
      error: error.message 
    });
  }
}
