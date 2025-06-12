// Simplified compatibility API for Vercel serverless functions

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

/**
 * Simplified Compatibility Endpoint for Vercel
 * POST /api/compatibility
 */
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
    const { 
      person1, 
      person2,
      matchType = 'ashtakoot'
    } = req.body;

    // Validate input
    if (!person1 || !person2) {
      return res.status(400).json({
        success: false,
        message: 'Both person details are required'
      });
    }

    // Validate person1 details
    if (!person1.dateOfBirth || !person1.timeOfBirth || !person1.placeOfBirth) {
      return res.status(400).json({
        success: false,
        message: 'Person 1: Missing required birth details'
      });
    }

    // Validate person2 details
    if (!person2.dateOfBirth || !person2.timeOfBirth || !person2.placeOfBirth) {
      return res.status(400).json({
        success: false,
        message: 'Person 2: Missing required birth details'
      });
    }

    // Mock compatibility calculation for serverless environment
    const mockCompatibilityResult = {
      overallScore: Math.floor(Math.random() * 36) + 1,
      maximumScore: 36,
      percentage: Math.floor(Math.random() * 100),
      matchType: matchType,
      recommendation: "This is a mock compatibility result for Vercel serverless deployment.",
      details: {
        varna: {
          score: Math.floor(Math.random() * 4) + 1,
          maxScore: 4,
          description: "Varna represents social compatibility"
        },
        vashya: {
          score: Math.floor(Math.random() * 3) + 1,
          maxScore: 3,
          description: "Vashya represents dominance patterns"
        },
        tara: {
          score: Math.floor(Math.random() * 3) + 1,
          maxScore: 3,
          description: "Tara represents destiny compatibility"
        },
        yoni: {
          score: Math.floor(Math.random() * 4) + 1,
          maxScore: 4,
          description: "Yoni represents physical and sexual compatibility"
        },
        graha_maitri: {
          score: Math.floor(Math.random() * 5) + 1,
          maxScore: 5,
          description: "Graha Maitri represents planetary compatibility"
        },
        gana: {
          score: Math.floor(Math.random() * 6) + 1,
          maxScore: 6,
          description: "Gana represents temperament compatibility"
        },
        bhakoot: {
          score: Math.floor(Math.random() * 7) + 1,
          maxScore: 7,
          description: "Bhakoot represents family compatibility"
        },
        nadi: {
          score: Math.floor(Math.random() * 8) + 1,
          maxScore: 8,
          description: "Nadi represents health compatibility"
        }
      },
      persons: {
        person1: {
          name: person1.name || "Person 1",
          moon: {
            sign: "Taurus",
            nakshatra: "Rohini"
          }
        },
        person2: {
          name: person2.name || "Person 2",
          moon: {
            sign: "Libra",
            nakshatra: "Vishakha"
          }
        }
      }
    };
    
    return res.status(200).json({
      success: true,
      data: mockCompatibilityResult
    });
  } catch (error) {
    console.error('Error in compatibility calculation:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Compatibility calculation error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}