const { connectDB, isConnected } = require('../../server/config/database.js');
const { verifyToken } = require('../../server/utils/auth.js');
const { UserService } = require('../../server/services/userService.js');
const mongoose = require('mongoose');
const mongodb = require('../utils/mongodb.js');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

// MongoDB connection timeout
const DB_CONNECTION_TIMEOUT = 10000; // 10 seconds

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

    // Connect to MongoDB with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database connection timeout')), DB_CONNECTION_TIMEOUT);
    });
    
    try {
      await Promise.race([mongodb.connectToDatabase(), timeoutPromise]);
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return res.status(503).json({
        success: false,
        message: 'Database connection failed. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }

    // Verify connection is established
    if (!mongodb.isDatabaseConnected()) {
      console.error('Database connection not established');
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable. Please try again later.'
      });
    }

    // Get user from database
    const user = await UserService.getUserById(decoded.id);
    
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
    
    // Handle database connection errors
    if (error instanceof mongoose.Error || error.name === 'MongoError') {
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable. Please try again later.'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};