const { connectDB } = require('../../server/config/database.js');
const { AuthService } = require('../../server/services/authService.js');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

/**
 * User Registration Endpoint
 * POST /api/auth/register
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

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    console.log('🔐 User registration request received');
    
    // Connect to MongoDB
    await connectDB();

    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Register user
    const result = await AuthService.register({ name, email, password });

    console.log('✅ User registered successfully:', result.user.email);

    return res.status(201).json({
      success: true,
      data: {
        user: result.user,
        token: result.token
      },
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    
    // Handle specific error types
    if (error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email address'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
