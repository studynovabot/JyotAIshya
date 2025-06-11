const { connectDB } = require('../server/config/database.js');
const { verifyToken } = require('../server/utils/auth.js');
const { KundaliService } = require('../server/services/kundaliService.js');
const { AstroService } = require('../server/services/astroService.js');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

/**
 * Consolidated Kundali Endpoint
 * Handles all kundali operations: CRUD and analysis
 * GET/POST/PUT/DELETE /api/kundali?action=crud
 * POST /api/kundali?action=generate|dosha|dasha
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
    // Connect to MongoDB
    await connectDB();

    // Get the action from query parameter
    const action = req.query.action || '';

    // Handle different actions
    switch (action) {
      case 'crud':
        return await handleCrud(req, res);
      
      case 'generate':
      case 'dosha':
      case 'dasha':
        if (req.method !== 'POST') {
          return res.status(405).json({
            success: false,
            message: `Method not allowed for ${action}`
          });
        }
        return await handleAnalysis(req, res, action);
      
      case 'charts':
        return await handleUserCharts(req, res);
      
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action. Supported actions: crud, generate, dosha, dasha, charts'
        });
    }
  } catch (error) {
    console.error('Error in kundali endpoint:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Handle CRUD operations for kundali
 */
async function handleCrud(req, res) {
  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    
    try {
      decoded = await verifyToken(token);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    const userId = decoded.userId;
    const kundaliId = req.query.id;

    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        // Get a specific kundali if ID is provided, otherwise get all
        if (kundaliId) {
          const kundali = await KundaliService.getKundaliById(kundaliId, userId);
          
          if (!kundali) {
            return res.status(404).json({
              success: false,
              message: 'Kundali not found'
            });
          }
          
          return res.status(200).json({
            success: true,
            data: kundali
          });
        } else {
          // Get all kundalis for the user
          const { page = 1, limit = 10 } = req.query;
          const kundalis = await KundaliService.getKundalisByUserId(userId, {
            page: parseInt(page),
            limit: parseInt(limit)
          });
          
          return res.status(200).json({
            success: true,
            data: kundalis
          });
        }

      case 'POST':
        // Create a new kundali
        const kundaliData = req.body;
        
        // Validate input
        if (!kundaliData.name || !kundaliData.dateOfBirth || !kundaliData.timeOfBirth || !kundaliData.placeOfBirth) {
          return res.status(400).json({
            success: false,
            message: 'Missing required fields'
          });
        }
        
        // Add user ID to kundali data
        kundaliData.userId = userId;
        
        // Create kundali
        const newKundali = await KundaliService.createKundali(kundaliData);
        
        return res.status(201).json({
          success: true,
          data: newKundali
        });

      case 'PUT':
        // Update a kundali
        if (!kundaliId) {
          return res.status(400).json({
            success: false,
            message: 'Kundali ID is required'
          });
        }
        
        const updateData = req.body;
        const updatedKundali = await KundaliService.updateKundali(kundaliId, userId, updateData);
        
        if (!updatedKundali) {
          return res.status(404).json({
            success: false,
            message: 'Kundali not found or you do not have permission to update it'
          });
        }
        
        return res.status(200).json({
          success: true,
          data: updatedKundali
        });

      case 'DELETE':
        // Delete a kundali
        if (!kundaliId) {
          return res.status(400).json({
            success: false,
            message: 'Kundali ID is required'
          });
        }
        
        const deleted = await KundaliService.deleteKundali(kundaliId, userId);
        
        if (!deleted) {
          return res.status(404).json({
            success: false,
            message: 'Kundali not found or you do not have permission to delete it'
          });
        }
        
        return res.status(200).json({
          success: true,
          message: 'Kundali deleted successfully'
        });

      default:
        return res.status(405).json({
          success: false,
          message: 'Method not allowed'
        });
    }
  } catch (error) {
    console.error('Error in kundali CRUD operation:', error);
    throw error;
  }
}

/**
 * Handle analysis operations for kundali
 */
async function handleAnalysis(req, res, operation) {
  try {
    // Extract birth data from request body - handle both naming conventions
    const { 
      dateOfBirth, 
      timeOfBirth, 
      placeOfBirth,
      birthDate,
      birthTime,
      birthPlace,
      latitude,
      longitude,
      timezone,
      kundaliId,
      name
    } = req.body;

    // Use either naming convention (old or new)
    const dob = dateOfBirth || birthDate;
    const tob = timeOfBirth || birthTime;
    const pob = placeOfBirth || birthPlace;

    console.log('Received data:', { dob, tob, pob, name });

    // Validate input for chart generation
    if (!dob || !tob || (!pob && (!latitude || !longitude))) {
      return res.status(400).json({
        success: false,
        message: 'Missing required birth details'
      });
    }

    // Handle different operations
    switch (operation) {
      case 'generate':
        // Generate birth chart
        const birthChart = await AstroService.generateBirthChart({
          dateOfBirth: dob,
          timeOfBirth: tob,
          placeOfBirth: pob,
          name: name,
          latitude,
          longitude,
          timezone
        });
        
        return res.status(200).json({
          success: true,
          data: birthChart
        });

      case 'dosha':
        // Check for doshas
        const doshaResults = await AstroService.checkDoshas({
          dateOfBirth: dob,
          timeOfBirth: tob,
          placeOfBirth: pob,
          latitude,
          longitude,
          timezone
        });
        
        return res.status(200).json({
          success: true,
          data: doshaResults
        });

      case 'dasha':
        // Calculate dasha periods
        const dashaResults = await AstroService.calculateDashaPeriods({
          dateOfBirth: dob,
          timeOfBirth: tob,
          placeOfBirth: pob,
          latitude,
          longitude,
          timezone,
          kundaliId
        });
        
        return res.status(200).json({
          success: true,
          data: dashaResults
        });

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid operation'
        });
    }
  } catch (error) {
    console.error('Error in kundali analysis operation:', error);
    throw error;
  }
}

/**
 * Handle user charts operations
 */
async function handleUserCharts(req, res) {
  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    
    try {
      decoded = await verifyToken(token);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    const userId = decoded.userId;
    
    // Get all kundalis for the user
    const { page = 1, limit = 10 } = req.query;
    const kundalis = await KundaliService.getKundalisByUserId(userId, {
      page: parseInt(page),
      limit: parseInt(limit)
    });
    
    return res.status(200).json({
      success: true,
      data: kundalis
    });
  } catch (error) {
    console.error('Error in user charts operation:', error);
    throw error;
  }
}