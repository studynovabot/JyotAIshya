import { connectDB } from '../../server/config/database.js';
import { KundaliService } from '../../server/services/kundaliService.js';
import { calculateKundali } from '../../utils/astroCalculationsNew.js';

/**
 * Serverless function to update kundali by ID
 * PUT /api/kundali/update?id={id}
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow PUT requests
  if (req.method !== 'PUT') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    // Connect to MongoDB
    await connectDB();

    const { id } = req.query;
    const { name, birthDate, birthTime, birthPlace } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Kundali ID is required'
      });
    }

    // Validate input
    if (!name || !birthDate || !birthTime || !birthPlace) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, birthDate, birthTime, birthPlace'
      });
    }

    console.log('Updating kundali with ID:', id);

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
        latitude: kundaliData.latitude || kundaliData.birthDetails?.coordinates?.latitude,
        longitude: kundaliData.longitude || kundaliData.birthDetails?.coordinates?.longitude
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
