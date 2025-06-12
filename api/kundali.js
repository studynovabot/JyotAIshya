// Simplified kundali API for Vercel serverless functions
import { generateBirthChart } from './utils/astroCalculations.js';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

/**
 * Simplified Kundali API for Vercel
 * POST /api/kundali?action=generate
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
    // Get the action from query parameter
    const action = req.query.action || 'generate';
    console.log(`Processing action: ${action}`);

    // For now, only support generate action
    if (action !== 'generate' && action !== 'crud') {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Supported actions: generate, crud'
      });
    }

    // Handle GET requests for existing kundali data
    if (req.method === 'GET' && action === 'crud') {
      const kundaliId = req.query.id;
      if (!kundaliId) {
        return res.status(400).json({
          success: false,
          message: 'Kundali ID is required for GET requests'
        });
      }

      // For now, return a mock response since we don't have database access
      return res.status(200).json({
        success: true,
        data: {
          id: kundaliId,
          name: "Sample User",
          dateOfBirth: "2000-01-01",
          timeOfBirth: "12:00",
          placeOfBirth: "New Delhi",
          coordinates: {
            latitude: 28.7041,
            longitude: 77.1025
          },
          planets: [
            {
              id: 0,
              name: { en: "Sun", sa: "Surya (सूर्य)" },
              longitude: 280.0,
              rashi: 9,
              rashiName: { id: "makar", name: "Makar (मकर)", english: "Capricorn", element: "Prithvi (Earth)", lord: "Shani (Saturn)" },
              nakshatra: 22,
              nakshatraName: { id: 22, name: "Shravana", deity: "Vishnu", symbol: "Ear", ruler: "Moon" },
              degree: 10.0,
              isRetrograde: false
            },
            {
              id: 1,
              name: { en: "Moon", sa: "Chandra (चंद्र)" },
              longitude: 45.0,
              rashi: 1,
              rashiName: { id: "vrishabh", name: "Vrishabh (वृषभ)", english: "Taurus", element: "Prithvi (Earth)", lord: "Shukra (Venus)" },
              nakshatra: 5,
              nakshatraName: { id: 5, name: "Mrigashira", deity: "Mars", symbol: "Deer's Head", ruler: "Mars" },
              degree: 15.0,
              isRetrograde: false
            }
          ],
          ascendant: {
            longitude: 270.0,
            rashi: 9,
            rashiName: { id: "makar", name: "Makar (मकर)", english: "Capricorn", element: "Prithvi (Earth)", lord: "Shani (Saturn)" },
            degree: 0.0
          }
        }
      });
    }

    // Only allow POST requests for chart generation
    if (req.method !== 'POST' && action === 'generate') {
      return res.status(405).json({
        success: false,
        message: 'Method not allowed. Use POST for kundali generation.'
      });
    }

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

    // Generate birth chart
    console.log('Calling generateBirthChart...');
    const result = await generateBirthChart(
      name || 'Anonymous',
      dob,
      tob,
      pob,
      latitude,
      longitude,
      timezone
    );
    console.log('Birth chart generated successfully');
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error(`Error in kundali operation:`, error);
    
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