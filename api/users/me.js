const { connectDB } = require('../../server/config/database.js');
const { verifyToken } = require('../../server/utils/auth.js');
const { UserService } = require('../../server/services/userService.js');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

/**
 * User Profile Endpoint
 * GET/PUT/DELETE /api/users/me
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
    // Connect to MongoDB
    await connectDB();

    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    
    try {
      decoded = await verifyToken(token);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Get user from database
    const user = await UserService.getUserById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        return res.status(200).json({
          success: true,
          data: user
        });

      case 'PUT':
        const { name, email, dateOfBirth, placeOfBirth, timeOfBirth, preferences } = req.body;
        
        // Update user
        const updatedUser = await UserService.updateUser(user._id, {
          name,
          email,
          dateOfBirth,
          placeOfBirth,
          timeOfBirth,
          preferences
        });

        return res.status(200).json({
          success: true,
          data: updatedUser
        });

      case 'DELETE':
        // Soft delete user
        const success = await UserService.deleteUser(user._id);
        
        return res.status(200).json({
          success: true,
          message: 'User deleted successfully'
        });

      default:
        return res.status(405).json({
          success: false,
          message: 'Method not allowed'
        });
    }

  } catch (error) {
    console.error('Error in /api/users/me endpoint:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};