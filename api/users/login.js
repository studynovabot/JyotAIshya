const { connectDB, isConnected } = require('../../server/config/database.js');
const { AuthService } = require('../../server/services/authService.js');
const mongoose = require('mongoose');
const mongodb = require('../utils/mongodb.js');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

// MongoDB connection timeout
const DB_CONNECTION_TIMEOUT = 10000; // 10 seconds

/**
 * User Login Endpoint
 * POST /api/users/login
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
    console.log('🔐 User login request received');
    
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

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
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

    // Login user
    const result = await AuthService.login({ email, password });

    console.log('✅ User logged in successfully:', result.user.email);

    return res.status(200).json({
      success: true,
      data: {
        user: result.user,
        token: result.token
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    
    // Handle specific error types
    if (error.message.includes('Invalid email or password')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Handle database connection errors
    if (error instanceof mongoose.Error || error.name === 'MongoError') {
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable. Please try again later.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};