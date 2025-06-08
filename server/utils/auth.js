import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { UserService } from '../services/userService.js';

/**
 * Generate JWT token
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
export const generateToken = (user) => {
  const payload = {
    id: user._id || user.id,
    email: user.email,
    name: user.name
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

/**
 * Register a new user
 * @param {string} name - User's name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} User object and token
 */
export const registerUser = async (name, email, password) => {
  try {
    // Check if user already exists
    const existingUser = await UserService.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create user (password will be hashed automatically by the User model)
    const user = await UserService.createUser({
      name,
      email,
      password
    });

    // Generate token
    const token = generateToken(user);

    return { user, token };
  } catch (error) {
    throw error;
  }
};

/**
 * Login a user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} User object and token
 */
export const loginUser = async (email, password) => {
  try {
    // Get user with password field
    const user = await User.findByEmail(email).select('+password');
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password using the model method
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    await UserService.updateLastLogin(user._id);

    // Generate token
    const token = generateToken(user);

    // Return user without password
    const userObject = user.toObject();
    delete userObject.password;

    return { user: userObject, token };
  } catch (error) {
    throw error;
  }
};

/**
 * Authentication middleware
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyToken(token);

    // Get user from database to ensure they still exist and are active
    const user = await UserService.getUserById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Add user to request
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

/**
 * Optional authentication middleware (doesn't require authentication)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
export const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      try {
        const decoded = verifyToken(token);
        const user = await UserService.getUserById(decoded.id);
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Ignore token errors for optional auth
      }
    }

    next();
  } catch (error) {
    next();
  }
};