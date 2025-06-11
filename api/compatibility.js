import { CompatibilityService } from '../server/services/compatibilityService.js';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

/**
 * Compatibility Endpoint
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

    // Calculate compatibility
    const compatibilityResult = await CompatibilityService.calculateCompatibility(
      person1,
      person2,
      matchType
    );
    
    return res.status(200).json({
      success: true,
      data: compatibilityResult
    });
  } catch (error) {
    console.error('Error in compatibility calculation:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Compatibility calculation error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};