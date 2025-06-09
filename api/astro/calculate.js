// Main Astrological Calculations Serverless Function
import { calculateKundali, checkDoshas, calculateDasha, calculateCompatibility } from '../utils/astroCalculationsNew.js';

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
      message: 'Method not allowed. Use POST.'
    });
  }

  try {
    console.log("🔮 Received astro calculation request:", req.body);

    const { action, data } = req.body;

    if (!action) {
      return res.status(400).json({
        success: false,
        message: "Please specify an action: 'kundali', 'dosha', 'dasha', or 'compatibility'"
      });
    }

    let result;

    switch (action) {
      case 'kundali':
        result = await handleKundaliCalculation(data);
        break;
      
      case 'dosha':
        result = await handleDoshaCheck(data);
        break;
      
      case 'dasha':
        result = await handleDashaCalculation(data);
        break;
      
      case 'compatibility':
        result = await handleCompatibilityCalculation(data);
        break;
      
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid action. Use: 'kundali', 'dosha', 'dasha', or 'compatibility'"
        });
    }

    return res.status(200).json({
      success: true,
      action,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Error in astro calculation:", error);
    return res.status(500).json({
      success: false,
      message: "Astrological calculation failed",
      error: error.message
    });
  }
}

// Handle Kundali calculation
async function handleKundaliCalculation(data) {
  const { name, birthDate, birthTime, birthPlace } = data;

  if (!name || !birthDate || !birthTime || !birthPlace) {
    throw new Error("Missing required fields: name, birthDate, birthTime, birthPlace");
  }

  console.log("🔮 Calculating kundali for:", { name, birthDate, birthTime, birthPlace });

  const kundaliData = await calculateKundali(name, birthDate, birthTime, birthPlace);
  
  return {
    type: 'kundali',
    kundali: kundaliData,
    message: "Kundali calculated successfully"
  };
}

// Handle Dosha check
async function handleDoshaCheck(data) {
  const { kundaliData } = data;

  if (!kundaliData) {
    throw new Error("Kundali data is required for dosha check");
  }

  console.log("🔮 Checking doshas...");

  const doshas = checkDoshas(kundaliData);
  
  return {
    type: 'dosha',
    doshas,
    message: "Dosha analysis completed"
  };
}

// Handle Dasha calculation
async function handleDashaCalculation(data) {
  const { kundaliData } = data;

  if (!kundaliData) {
    throw new Error("Kundali data is required for dasha calculation");
  }

  console.log("🔮 Calculating dasha periods...");

  const dashaPeriods = calculateDasha(kundaliData);
  
  return {
    type: 'dasha',
    dashaPeriods,
    message: "Dasha periods calculated successfully"
  };
}

// Handle Compatibility calculation
async function handleCompatibilityCalculation(data) {
  const { kundali1, kundali2 } = data;

  if (!kundali1 || !kundali2) {
    throw new Error("Both kundali data sets are required for compatibility calculation");
  }

  console.log("🔮 Calculating compatibility...");

  const compatibility = calculateCompatibility(kundali1, kundali2);
  
  return {
    type: 'compatibility',
    compatibility,
    message: "Compatibility analysis completed"
  };
}
