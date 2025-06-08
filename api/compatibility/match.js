import { calculateKundali, calculateCompatibility } from '../../server/utils/astroCalculationsNew.js';

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
    console.log("💕 Received compatibility match request:", req.body);

    const { person1, person2 } = req.body;

    // Validate input
    if (!person1 || !person2) {
      return res.status(400).json({
        success: false,
        message: "कृपया दोनों व्यक्तियों की जानकारी प्रदान करें (Please provide information for both persons)"
      });
    }

    const { name: name1, birthDate: birthDate1, birthTime: birthTime1, birthPlace: birthPlace1 } = person1;
    const { name: name2, birthDate: birthDate2, birthTime: birthTime2, birthPlace: birthPlace2 } = person2;

    if (!name1 || !birthDate1 || !birthTime1 || !birthPlace1 ||
        !name2 || !birthDate2 || !birthTime2 || !birthPlace2) {
      return res.status(400).json({
        success: false,
        message: "कृपया सभी आवश्यक जानकारी प्रदान करें (Please provide all required fields for both persons)"
      });
    }

    console.log("💕 Calculating compatibility for:", { 
      person1: { name: name1, birthDate: birthDate1 }, 
      person2: { name: name2, birthDate: birthDate2 } 
    });

    // Calculate kundali for both persons
    const kundali1 = await calculateKundali(name1, birthDate1, birthTime1, birthPlace1);
    const kundali2 = await calculateKundali(name2, birthDate2, birthTime2, birthPlace2);

    // Calculate compatibility
    const compatibility = calculateCompatibility(kundali1, kundali2);

    console.log("✅ Compatibility calculation completed");

    return res.status(200).json({
      success: true,
      data: {
        person1: {
          name: name1,
          ascendant: kundali1.ascendant,
          moonSign: kundali1.planets.find(p => p.id === 1) // Moon
        },
        person2: {
          name: name2,
          ascendant: kundali2.ascendant,
          moonSign: kundali2.planets.find(p => p.id === 1) // Moon
        },
        compatibility
      }
    });

  } catch (error) {
    console.error("❌ Error calculating compatibility:", error);
    return res.status(500).json({
      success: false,
      message: "संगतता गणना में त्रुटि (Error in compatibility calculation)",
      error: error.message
    });
  }
}
