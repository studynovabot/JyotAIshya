const { AuthService } = require('../services/authService.js');

/**
 * Authentication middleware for serverless functions
 * Extracts and verifies JWT token from Authorization header
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    const decoded = AuthService.verifyToken(token);
    
    // Get user from database
    const user = await AuthService.getUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. User not found.'
      });
    }

    // Add user to request object
    req.user = user;
    req.userId = user._id;
    
    if (next) {
      next();
    }
    
    return true;
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Access denied. Invalid token.'
    });
  }
};

/**
 * Optional authentication middleware
 * Sets user if token is valid, but doesn't require authentication
 */
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = AuthService.verifyToken(token);
        const user = await AuthService.getUserById(decoded.userId);
        
        if (user) {
          req.user = user;
          req.userId = user._id;
        }
      } catch (error) {
        // Ignore token errors in optional auth
        console.log('Optional auth failed:', error.message);
      }
    }
    
    if (next) {
      next();
    }
    
    return true;
  } catch (error) {
    // Don't fail on optional auth errors
    console.error('Optional auth middleware error:', error);
    if (next) {
      next();
    }
    return true;
  }
};

/**
 * Helper function to extract user from request in serverless functions
 */
const extractUser = async (req) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = AuthService.verifyToken(token);
    const user = await AuthService.getUserById(decoded.userId);
    
    return user;
  } catch (error) {
    console.error('Extract user error:', error);
    return null;
  }
};

/**
 * Helper function to require authentication in serverless functions
 */
const requireAuth = async (req, res) => {
  try {
    const user = await extractUser(req);
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Require auth error:', error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
    return null;
  }
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
  extractUser,
  requireAuth
};
