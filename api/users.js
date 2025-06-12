import { connectDB } from '../server/config/database.js';
import { verifyToken, generateToken } from '../server/utils/auth.js';
import { UserService } from '../server/services/userService.js';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

/**
 * Unified Users API Handler
 * Handles: register, login, profile (me), and other user operations
 */
export default async function handler(req, res) {
  console.log(`Users API request: ${req.method} ${req.url}`);
  console.log('Query params:', req.query);
  
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

    // Get the action from query parameter or URL path
    const action = req.query.action || getActionFromPath(req.url);
    console.log(`Processing user action: ${action}`);

    switch (action) {
      case 'register':
        return await handleRegister(req, res);
      
      case 'login':
        return await handleLogin(req, res);
      
      case 'me':
      case 'profile':
        return await handleProfile(req, res);
      
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action. Supported actions: register, login, me'
        });
    }

  } catch (error) {
    console.error('Users API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * Extract action from URL path
 */
function getActionFromPath(url) {
  if (url.includes('/users/register')) return 'register';
  if (url.includes('/users/login')) return 'login';
  if (url.includes('/users/me')) return 'me';
  return '';
}

/**
 * Handle user registration
 */
async function handleRegister(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    const result = await UserService.registerUser({ name, email, password });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: result.user,
        token: result.token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
}

/**
 * Handle user login
 */
async function handleLogin(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const result = await UserService.loginUser({ email, password });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        token: result.token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    
    if (error.message.includes('Invalid') || error.message.includes('not found')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
}

/**
 * Handle user profile operations
 */
async function handleProfile(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    // Verify token
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = verifyToken(token);
    const user = await UserService.getUserById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Profile error:', error);
    
    if (error.message.includes('token') || error.message.includes('jwt')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
}