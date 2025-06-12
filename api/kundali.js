import { connectDB } from '../server/config/database.js';import { verifyToken } from '../server/utils/auth.js';import { KundaliService } from '../server/services/kundaliService.js';import { AstroService } from '../server/services/astroService.js';

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
export default async function handler(req, res) {
  console.log(`Kundali API request: ${req.method} ${req.url}`);
  console.log('Query params:', req.query);
  console.log('Request body:', req.body);
  
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
    try {
      await connectDB();
      console.log('Connected to MongoDB successfully');
    } catch (dbError) {
      console.error('MongoDB connection failed:', dbError);
      // Continue without database for analysis operations
      if (req.query.action === 'generate' || req.query.action === 'dosha' || req.query.action === 'dasha') {
        console.log('Continuing without database for analysis operation');
      } else {
        throw dbError;
      }
    }

    // Get the action from query parameter
    const action = req.query.action || '';
    console.log(`Processing action: ${action}`);

    // Handle different actions
    switch (action) {
      case 'crud':
        console.log('Handling CRUD operation');
        return await handleCrud(req, res);
      
      case 'generate':
      case 'dosha':
      case 'dasha':
        console.log(`Handling ${action} operation`);
        if (req.method !== 'POST') {
          console.log(`Method ${req.method} not allowed for ${action}`);
          return res.status(405).json({
            success: false,
            message: `Method not allowed for ${action}`
          });
        }
        return await handleAnalysis(req, res, action);
      
      case 'charts':
        console.log('Handling charts operation');
        return await handleUserCharts(req, res);
      
      default:
        console.log(`Invalid action: ${action}`);
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
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : undefined
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
    console.log(`Starting ${operation} operation with request body:`, req.body);
    
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

    console.log('Processed data:', { dob, tob, pob, name, latitude, longitude, timezone });

    // Validate input for chart generation
    if (!dob || !tob || (!pob && (!latitude || !longitude))) {
      console.error('Missing required birth details:', { dob, tob, pob, latitude, longitude });
      return res.status(400).json({
        success: false,
        message: 'Missing required birth details. Please provide dateOfBirth, timeOfBirth, and either placeOfBirth or latitude/longitude coordinates.'
      });
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      console.error('Invalid date format:', dob);
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Please use YYYY-MM-DD format.'
      });
    }

    // Validate time format
    if (!/^\d{2}:\d{2}$/.test(tob)) {
      console.error('Invalid time format:', tob);
      return res.status(400).json({
        success: false,
        message: 'Invalid time format. Please use HH:MM format.'
      });
    }

    // Prepare params object
    const params = {
      dateOfBirth: dob,
      timeOfBirth: tob,
      placeOfBirth: pob,
      name: name || 'Anonymous',
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      timezone: timezone ? parseFloat(timezone) : undefined,
      kundaliId
    };

    console.log(`Calling AstroService.${operation} with params:`, params);

    // Handle different operations
    let result;
    try {
      switch (operation) {
        case 'generate':
          // Generate birth chart
          console.log('Calling AstroService.generateBirthChart...');
          result = await AstroService.generateBirthChart(params);
          console.log('Birth chart generated successfully');
          break;

        case 'dosha':
          // Check for doshas
          console.log('Calling AstroService.checkDoshas...');
          result = await AstroService.checkDoshas(params);
          console.log('Dosha analysis completed successfully');
          break;

        case 'dasha':
          // Calculate dasha periods
          console.log('Calling AstroService.calculateDashaPeriods...');
          result = await AstroService.calculateDashaPeriods(params);
          console.log('Dasha calculation completed successfully');
          break;

        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid operation'
          });
      }
    } catch (serviceError) {
      console.error(`Error in AstroService.${operation}:`, serviceError);
      console.error('Service error stack:', serviceError.stack);
      throw new Error(`AstroService ${operation} failed: ${serviceError.message}`);
    }

    console.log(`${operation} operation completed successfully`);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error(`Error in kundali ${operation} operation:`, error);
    
    // Return a more detailed error response
    return res.status(500).json({
      success: false,
      message: 'Server error during analysis',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : undefined
    });
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