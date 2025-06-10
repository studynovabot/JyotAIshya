import { connectDB } from '../../server/config/database.js';
import { KundaliService } from '../../server/services/kundaliService.js';
import { calculateKundali } from '../../utils/astroCalculationsNew.js';

/**
 * Serverless function to handle individual kundali operations
 * GET /api/kundali/{id} - Get kundali by ID
 * PUT /api/kundali/{id} - Update kundali by ID
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Connect to MongoDB
    await connectDB();

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Kundali ID is required'
      });
    }

    switch (req.method) {
      case 'GET':
        return await handleGet(req, res, id);
      case 'PUT':
        return await handlePut(req, res, id);
      default:
        return res.status(405).json({
          success: false,
          message: 'Method not allowed'
        });
    }
  } catch (error) {
    console.error('Kundali API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * Handle GET request - Fetch kundali by ID
 */
async function handleGet(req, res, id) {
  try {
    const kundali = await KundaliService.getKundaliById(id);

    if (!kundali) {
      return res.status(404).json({
        success: false,
        message: 'Kundali not found'
      });
    }

    // For now, we'll make all kundalis accessible (no auth check)
    // In production, you might want to add authentication checks here

    return res.status(200).json({
      success: true,
      data: kundali
    });
  } catch (error) {
    console.error('Error fetching kundali:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching kundali',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * Handle PUT request - Update kundali by ID
 */
async function handlePut(req, res, id) {
  try {
    const { name, birthDate, birthTime, birthPlace } = req.body;

    // Validate input
    if (!name || !birthDate || !birthTime || !birthPlace) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, birthDate, birthTime, birthPlace'
      });
    }

    // Check if kundali exists
    const existingKundali = await KundaliService.getKundaliById(id);
    if (!existingKundali) {
      return res.status(404).json({
        success: false,
        message: 'Kundali not found'
      });
    }

    // Recalculate kundali with new data
    const kundaliData = await calculateKundali(name, birthDate, birthTime, birthPlace);

    // Prepare update data
    const updateData = {
      name,
      dateOfBirth: new Date(birthDate),
      timeOfBirth: birthTime,
      placeOfBirth: birthPlace,
      coordinates: {
        latitude: kundaliData.latitude,
        longitude: kundaliData.longitude
      },
      ascendant: kundaliData.ascendant,
      planets: kundaliData.planets,
      houses: kundaliData.houses,
      updatedAt: new Date()
    };

    // Update kundali
    const updatedKundali = await KundaliService.updateKundali(id, updateData);

    return res.status(200).json({
      success: true,
      data: updatedKundali,
      message: 'Kundali updated successfully'
    });
  } catch (error) {
    console.error('Error updating kundali:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating kundali',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
