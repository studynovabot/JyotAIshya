// Simple retrieve endpoint for kundali data
// GET /api/kundali/retrieve?id={id}

const { getKundali, getStorageStats } = require('./shared-storage.js');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

/**
 * Retrieve kundali by ID
 * GET /api/kundali/retrieve?id={id}
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

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use GET to retrieve kundali.'
    });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Kundali ID is required. Use ?id=your_kundali_id'
      });
    }

    console.log(`🔍 Retrieving kundali with ID: ${id}`);
    
    // Get storage stats for debugging
    const stats = getStorageStats();
    console.log(`📦 Storage stats:`, stats);

    // Try to get from shared storage
    const kundali = getKundali(id);

    if (!kundali) {
      console.log(`❌ Kundali ${id} not found`);
      
      return res.status(404).json({
        success: false,
        message: 'Kundali not found. Please regenerate your kundali.',
        requestedId: id,
        availableIds: stats.ids,
        storageInfo: {
          totalKundalis: stats.totalKundalis,
          note: 'Kundali data is stored temporarily and may be cleared between deployments'
        }
      });
    }

    console.log(`✅ Found kundali: ${kundali.name} from ${kundali.placeOfBirth}`);

    return res.status(200).json({
      success: true,
      data: kundali,
      message: 'Kundali retrieved successfully'
    });

  } catch (error) {
    console.error('Error retrieving kundali:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving kundali',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
