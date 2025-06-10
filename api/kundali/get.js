const { connectDB } = require('../../server/config/database.js');
const { KundaliSimpleService } = require('../../server/services/kundaliSimpleService.js');
const { extractUser } = require('../../server/middleware/auth.js');

/**
 * Serverless function to get kundali by ID
 * GET /api/kundali/get?id={id}
 */
module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    // Connect to MongoDB
    await connectDB();

    // Extract user if authenticated (optional)
    const user = await extractUser(req);

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Kundali ID is required'
      });
    }

    console.log('Fetching kundali with ID:', id);

    const kundali = await KundaliSimpleService.getKundaliById(id);

    if (!kundali) {
      return res.status(404).json({
        success: false,
        message: 'Kundali not found'
      });
    }

    // Check access permissions
    const canAccess = kundali.isPublic ||
                     (user && kundali.userId && kundali.userId.toString() === user._id.toString());

    if (!canAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This kundali is private.'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...kundali.toObject(),
        id: kundali._id
      }
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
