const { AstroService } = require('../server/services/astroService.js');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

/**
 * Consolidated Astro Endpoint
 * Handles all astrology-related operations
 * POST /api/astro?action=calculate|validate
 * GET /api/astro?action=coordinates
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

  try {
    // Get the action from query parameter
    const action = req.query.action || '';

    // Handle different actions
    switch (action) {
      case 'calculate':
        if (req.method !== 'POST') {
          return res.status(405).json({
            success: false,
            message: 'Method not allowed for calculate'
          });
        }
        return await handleCalculate(req, res);
      
      case 'validate':
        if (req.method !== 'POST') {
          return res.status(405).json({
            success: false,
            message: 'Method not allowed for validate'
          });
        }
        return await handleValidate(req, res);
      
      case 'coordinates':
        if (req.method !== 'GET') {
          return res.status(405).json({
            success: false,
            message: 'Method not allowed for coordinates'
          });
        }
        return await handleCoordinates(req, res);
      
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action. Supported actions: calculate, validate, coordinates'
        });
    }
  } catch (error) {
    console.error('Error in astro endpoint:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Handle astrological calculations
 */
async function handleCalculate(req, res) {
  try {
    const { 
      dateOfBirth, 
      timeOfBirth, 
      placeOfBirth,
      latitude,
      longitude,
      timezone,
      calculationType
    } = req.body;

    // Validate input
    if (!dateOfBirth || !timeOfBirth || (!placeOfBirth && (!latitude || !longitude))) {
      return res.status(400).json({
        success: false,
        message: 'Missing required birth details'
      });
    }

    if (!calculationType) {
      return res.status(400).json({
        success: false,
        message: 'Calculation type is required'
      });
    }

    // Perform calculation
    const result = await AstroService.performCalculation({
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      latitude,
      longitude,
      timezone,
      calculationType
    });
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in astro calculation:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Calculation error',
      error: error.message
    });
  }
}

/**
 * Handle validation of astrological data
 */
async function handleValidate(req, res) {
  try {
    const { 
      dateOfBirth, 
      timeOfBirth, 
      placeOfBirth
    } = req.body;

    // Validate input
    const validationResult = await AstroService.validateInput({
      dateOfBirth,
      timeOfBirth,
      placeOfBirth
    });
    
    return res.status(200).json({
      success: true,
      data: validationResult
    });
  } catch (error) {
    console.error('Error in astro validation:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Validation error',
      error: error.message
    });
  }
}

/**
 * Handle geographic coordinates lookup
 */
async function handleCoordinates(req, res) {
  try {
    const { place } = req.query;

    if (!place) {
      return res.status(400).json({
        success: false,
        message: 'Place name is required'
      });
    }

    // Look up coordinates
    const coordinates = await AstroService.getCoordinates(place);
    
    return res.status(200).json({
      success: true,
      data: coordinates
    });
  } catch (error) {
    console.error('Error in coordinates lookup:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Coordinates lookup error',
      error: error.message
    });
  }
}