// Simplified kundali API for Vercel serverless functions
import { generateBirthChart } from './utils/astroCalculations.js';

// Simple in-memory storage for generated birth charts
// Note: This will reset on each deployment, but works for demo purposes
const birthChartStorage = new Map();

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

      // Try to get the birth chart from storage
      const storedChart = birthChartStorage.get(kundaliId);
      if (storedChart) {
        console.log(`✅ Found stored birth chart for ID: ${kundaliId}`);
        return res.status(200).json({
          success: true,
          data: storedChart
        });
      }

      // If not found in storage, return an error
      console.log(`❌ Birth chart not found for ID: ${kundaliId}`);
      return res.status(404).json({
        success: false,
        message: 'Birth chart not found. Please generate a new one.'
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
    
    // Store the generated birth chart in memory
    birthChartStorage.set(result.id, result);
    console.log(`✅ Stored birth chart with ID: ${result.id}`);
    
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