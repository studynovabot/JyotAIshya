// Test if dependencies are available in serverless environment
module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const results = {};

  try {
    // Test mongoose
    try {
      const mongoose = require('mongoose');
      results.mongoose = {
        available: true,
        version: mongoose.version
      };
    } catch (error) {
      results.mongoose = {
        available: false,
        error: error.message
      };
    }

    // Test bcryptjs
    try {
      const bcrypt = require('bcryptjs');
      results.bcryptjs = {
        available: true,
        hasHash: typeof bcrypt.hash === 'function'
      };
    } catch (error) {
      results.bcryptjs = {
        available: false,
        error: error.message
      };
    }

    // Test jsonwebtoken
    try {
      const jwt = require('jsonwebtoken');
      results.jsonwebtoken = {
        available: true,
        hasSign: typeof jwt.sign === 'function'
      };
    } catch (error) {
      results.jsonwebtoken = {
        available: false,
        error: error.message
      };
    }

    // Test dotenv
    try {
      const dotenv = require('dotenv');
      results.dotenv = {
        available: true,
        hasConfig: typeof dotenv.config === 'function'
      };
    } catch (error) {
      results.dotenv = {
        available: false,
        error: error.message
      };
    }

    // Test environment variables
    results.environment = {
      MONGODB_URI: !!process.env.MONGODB_URI,
      JWT_SECRET: !!process.env.JWT_SECRET,
      NODE_ENV: process.env.NODE_ENV
    };

    // Test our custom modules
    try {
      const { connectDB } = require('../server/config/database.js');
      results.customDatabase = {
        available: true,
        hasConnectDB: typeof connectDB === 'function'
      };
    } catch (error) {
      results.customDatabase = {
        available: false,
        error: error.message
      };
    }

    try {
      const { KundaliSimpleService } = require('../server/services/kundaliSimpleService.js');
      results.customKundaliService = {
        available: true,
        hasCreateKundali: typeof KundaliSimpleService.createKundali === 'function'
      };
    } catch (error) {
      results.customKundaliService = {
        available: false,
        error: error.message
      };
    }

    return res.status(200).json({
      success: true,
      message: 'Dependency test completed',
      results
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Dependency test failed',
      error: error.message,
      results
    });
  }
};
