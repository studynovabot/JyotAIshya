// Dynamic route for individual kundali operations
// This handles GET /api/kundali/{id} requests

const { getKundali, updateKundali, deleteKundali, getStorageStats } = require('./shared-storage.js');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

/**
 * Handler for individual kundali operations
 * GET /api/kundali/{id} - Retrieve kundali by ID
 * PUT /api/kundali/{id} - Update kundali by ID  
 * DELETE /api/kundali/{id} - Delete kundali by ID
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
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Kundali ID is required'
      });
    }

    console.log(`📡 ${req.method} request for kundali ID: ${id}`);

    switch (req.method) {
      case 'GET':
        return await handleGet(req, res, id);
      case 'PUT':
        return await handlePut(req, res, id);
      case 'DELETE':
        return await handleDelete(req, res, id);
      default:
        return res.status(405).json({
          success: false,
          message: `Method ${req.method} not allowed`
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
};

/**
 * Handle GET request - Retrieve kundali by ID
 */
async function handleGet(req, res, id) {
  try {
    console.log(`🔍 Attempting to retrieve kundali with ID: ${id}`);

    // Get storage stats for debugging
    const stats = getStorageStats();
    console.log(`📦 Storage stats:`, stats);

    // Try to get from shared storage
    const kundali = getKundali(id);

    if (!kundali) {
      console.log(`❌ Kundali ${id} not found in shared storage`);

      return res.status(404).json({
        success: false,
        message: 'Kundali not found. Please regenerate your kundali.',
        requestedId: id,
        availableIds: stats.ids,
        storageStats: stats
      });
    }

    console.log(`✅ Found kundali: ${kundali.name} from ${kundali.placeOfBirth}`);

    return res.status(200).json({
      success: true,
      data: kundali,
      message: 'Kundali retrieved successfully'
    });
  } catch (error) {
    console.error('Error in handleGet:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving kundali',
      error: error.message
    });
  }
}

/**
 * Handle PUT request - Update kundali by ID
 */
async function handlePut(req, res, id) {
  try {
    const updatedKundali = updateKundali(id, req.body);

    if (!updatedKundali) {
      return res.status(404).json({
        success: false,
        message: 'Kundali not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedKundali,
      message: 'Kundali updated successfully'
    });
  } catch (error) {
    console.error('Error in handlePut:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating kundali',
      error: error.message
    });
  }
}

/**
 * Handle DELETE request - Delete kundali by ID
 */
async function handleDelete(req, res, id) {
  try {
    const deleted = deleteKundali(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Kundali not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Kundali deleted successfully'
    });
  } catch (error) {
    console.error('Error in handleDelete:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting kundali',
      error: error.message
    });
  }
}
