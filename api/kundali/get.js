// Simple in-memory storage - inline implementation to avoid dependency issues
let kundaliStorage = new Map();

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
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Kundali ID is required'
      });
    }

    console.log('Fetching kundali with ID:', id);

    // For now, return a simple response to test if the endpoint works
    return res.status(200).json({
      success: true,
      message: 'GET endpoint is working!',
      requestedId: id,
      note: 'This is a test response. Full functionality coming soon.'
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
