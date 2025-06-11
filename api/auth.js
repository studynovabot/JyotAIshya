const { connectDB } = require('../server/config/database.js');
const { AuthService } = require('../server/services/authService.js');
const { verifyToken } = require('../server/utils/auth.js');
const { UserService } = require('../server/services/userService.js');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

/**
 * Consolidated Auth Endpoint
 * Handles login, register, and user profile operations
 * POST /api/auth?action=login|register
 * GET/PUT/DELETE /api/auth?action=profile
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

    // Get the action from query parameter
    const action = req.query.action || '';

    // Handle different actions
    switch (action) {
      case 'login':
        if (req.method !== 'POST') {
          return res.status(405).json({
            success: false,
            message: 'Method not allowed for login'
          });
        }

        return await handleLogin(req, res);

      case 'register':
        if (req.method !== 'POST') {
          return res.status(405).json({
            success: false,
            message: 'Method not allowed for registration'
          });
        }

        return await handleRegister(req, res);

      case 'profile':
        return await handleProfile(req, res);

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action. Supported actions: login, register, profile'
        });
    }
  } catch (error) {
    console.error('Error in auth endpoint:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Handle user login
 */
async function handleLogin(req, res) {
  try {
    console.log('🔐 User login request received');
    
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

    return res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * Handle user registration
 */
async function handleRegister(req, res) {
  try {
    console.log('🔐 User registration request received');
    
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
}

/**
 * Handle user profile operations
 */
async function handleProfile(req, res) {
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
    console.error('Error in profile operation:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}