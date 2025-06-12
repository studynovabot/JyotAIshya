import { generateBirthChart, validateBirthData } from './utils/astroCalculations.js';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

/**
 * Simplified Kundali Endpoint for Serverless
 * POST /api/kundali-simple?action=generate|dosha|dasha
 */
export default async function handler(req, res) {
  console.log(`Kundali Simple API request: ${req.method} ${req.url}`);
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

  // Only allow POST requests for analysis
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST for kundali analysis.'
    });
  }

  try {
    // Get the action from query parameter
    const action = req.query.action || 'generate';
    console.log(`Processing action: ${action}`);

    // Validate request body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      console.error('Empty request body');
      return res.status(400).json({
        success: false,
        message: 'Request body is required for analysis operations'
      });
    }
    
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
      name
    } = req.body;

    // Use either naming convention (old or new)
    const dob = dateOfBirth || birthDate;
    const tob = timeOfBirth || birthTime;
    const pob = placeOfBirth || birthPlace;

    console.log('Processed data:', { dob, tob, pob, name, latitude, longitude, timezone });

    // Validate input for chart generation
    if (!dob || !tob) {
      console.error('Missing required birth details:', { dob, tob, pob, latitude, longitude });
      return res.status(400).json({
        success: false,
        message: 'Missing required birth details. Please provide dateOfBirth and timeOfBirth.'
      });
    }

    // Check if we have either place or coordinates
    if (!pob && (!latitude || !longitude)) {
      console.error('Missing location information:', { pob, latitude, longitude });
      return res.status(400).json({
        success: false,
        message: 'Please provide either placeOfBirth or latitude/longitude coordinates.'
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

    // Validate time format (accept both HH:MM and HH:MM:SS)
    if (!/^\d{2}:\d{2}(:\d{2})?$/.test(tob)) {
      console.error('Invalid time format:', tob);
      return res.status(400).json({
        success: false,
        message: 'Invalid time format. Please use HH:MM or HH:MM:SS format.'
      });
    }

    // Validate coordinates if provided
    if (latitude !== undefined && (isNaN(latitude) || latitude < -90 || latitude > 90)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude. Must be between -90 and 90.'
      });
    }

    if (longitude !== undefined && (isNaN(longitude) || longitude < -180 || longitude > 180)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid longitude. Must be between -180 and 180.'
      });
    }

    // Handle different operations
    let result;
    try {
      switch (action) {
        case 'generate':
          // Generate birth chart
          console.log('Calling generateBirthChart...');
          result = await generateBirthChart(
            name || 'Anonymous',
            dob,
            tob,
            pob,
            latitude,
            longitude,
            timezone
          );
          console.log('Birth chart generated successfully');
          break;

        case 'dosha':
          // Check for doshas (simplified)
          console.log('Generating birth chart for dosha analysis...');
          const birthChart = await generateBirthChart(
            name || 'Anonymous',
            dob,
            tob,
            pob,
            latitude,
            longitude,
            timezone
          );
          
          // Simplified dosha analysis
          result = {
            birthChart: birthChart,
            mangalDosha: {
              present: Math.random() > 0.7, // Random for demo
              severity: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
              description: "Simplified Mangal Dosha analysis for serverless environment"
            },
            kaalSarpaDosha: {
              present: Math.random() > 0.8, // Random for demo
              type: "Partial",
              description: "Simplified Kaal Sarpa Dosha analysis for serverless environment"
            }
          };
          console.log('Dosha analysis completed successfully');
          break;

        case 'dasha':
          // Calculate dasha periods (simplified)
          console.log('Generating birth chart for dasha calculation...');
          const chartForDasha = await generateBirthChart(
            name || 'Anonymous',
            dob,
            tob,
            pob,
            latitude,
            longitude,
            timezone
          );
          
          // Simplified dasha calculation
          const currentDate = new Date();
          result = {
            birthChart: chartForDasha,
            currentDasha: {
              planet: "Venus",
              startDate: "2020-01-01",
              endDate: "2040-01-01",
              duration: "20 years",
              description: "Simplified Dasha calculation for serverless environment"
            },
            nextDasha: {
              planet: "Sun",
              startDate: "2040-01-01",
              endDate: "2046-01-01",
              duration: "6 years"
            }
          };
          console.log('Dasha calculation completed successfully');
          break;

        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid action. Supported actions: generate, dosha, dasha'
          });
      }
    } catch (serviceError) {
      console.error(`Error in ${action} operation:`, serviceError);
      console.error('Service error stack:', serviceError.stack);
      
      // Return more specific error messages
      let errorMessage = 'Analysis failed';
      if (serviceError.message.includes('coordinates')) {
        errorMessage = 'Failed to get location coordinates. Please check the place name or provide latitude/longitude.';
      } else if (serviceError.message.includes('date') || serviceError.message.includes('time')) {
        errorMessage = 'Invalid date or time format provided.';
      } else if (serviceError.message.includes('calculation')) {
        errorMessage = 'Astrological calculation failed. Please try again.';
      }
      
      return res.status(500).json({
        success: false,
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? {
          message: serviceError.message,
          stack: serviceError.stack
        } : undefined
      });
    }

    console.log(`${action} operation completed successfully`);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error(`Error in kundali ${action} operation:`, error);
    
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