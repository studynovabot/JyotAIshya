const { connectDB } = require('../../server/config/database.js');
const { KundaliSimpleService } = require('../../server/services/kundaliSimpleService.js');
const { requireAuth } = require('../../server/middleware/auth.js');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

/**
 * Get User's Kundali Charts
 * GET /api/kundali/my-charts
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
      message: 'Method not allowed'
    });
  }

  try {
    // Connect to MongoDB
    await connectDB();

    // Require authentication
    const user = await requireAuth(req, res);
    if (!user) return; // requireAuth already sent error response

    console.log('Fetching charts for user:', user.email);

    // Get query parameters for pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    // Fetch user's kundalis
    const kundalis = await KundaliSimpleService.getKundalisByUserId(user._id, {
      page,
      limit,
      sortBy,
      sortOrder
    });

    // Get total count for pagination
    const totalKundalis = await KundaliSimpleService.searchKundalis({
      userId: user._id
    });

    const totalPages = Math.ceil(totalKundalis.length / limit);

    console.log(`✅ Found ${kundalis.length} charts for user ${user.email}`);

    return res.status(200).json({
      success: true,
      data: {
        kundalis: kundalis.map(k => ({
          ...k.toObject(),
          id: k._id
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalKundalis: totalKundalis.length,
          hasNext: page < totalPages,
          hasPrev: page > 1,
          limit
        }
      },
      message: `Found ${kundalis.length} birth charts`
    });

  } catch (error) {
    console.error('Error fetching user charts:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching your birth charts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
