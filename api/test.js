// Simple test endpoint to verify serverless functions are working

export default async function handler(req, res) {
  console.log(`Test API request: ${req.method} ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = {
      success: true,
      message: 'API is working!',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      query: req.query,
      headers: {
        'user-agent': req.headers['user-agent'],
        'host': req.headers.host
      },
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        env: process.env.NODE_ENV || 'development'
      }
    };

    if (req.method === 'POST') {
      response.body = req.body;
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error in test endpoint:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Test endpoint error',
      error: error.message
    });
  }
}