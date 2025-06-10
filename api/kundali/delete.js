const { connectDB } = require('../../server/config/database.js');
const { KundaliSimpleService } = require('../../server/services/kundaliSimpleService.js');
const { requireAuth } = require('../../server/middleware/auth.js');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

/**
 * Delete Kundali Chart
 * DELETE /api/kundali/delete?id={id}
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

  // Only allow DELETE requests
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    // Connect to MongoDB
    await connectDB();

    // Require authentication
    const user = await requireAuth(req, res);
    if (!user) return; // requireAuth already sent error response

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Kundali ID is required'
      });
    }

    console.log('Deleting kundali with ID:', id);

    // Check if kundali exists and user owns it
    const existingKundali = await KundaliSimpleService.getKundaliById(id);
    if (!existingKundali) {
      return res.status(404).json({
        success: false,
        message: 'Kundali not found'
      });
    }

    // Check ownership
    if (!existingKundali.isOwnedBy(user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own kundalis.'
      });
    }

    // Delete kundali
    const deleted = await KundaliSimpleService.deleteKundali(id);

    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete kundali'
      });
    }

    console.log('✅ Kundali deleted successfully:', id);

    return res.status(200).json({
      success: true,
      message: 'Kundali deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting kundali:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting kundali',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
