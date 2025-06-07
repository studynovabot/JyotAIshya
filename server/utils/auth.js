import crypto from 'crypto';
import { getUserByEmail, createUser } from './database.js';

/**
 * Hash a password
 * @param {string} password - Plain text password
 * @returns {Object} Hash and salt
 */
export const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  
  return { hash, salt };
};

/**
 * Verify a password
 * @param {string} password - Plain text password
 * @param {string} hash - Stored hash
 * @param {string} salt - Stored salt
 * @returns {boolean} Whether the password is valid
 */
export const verifyPassword = (password, hash, salt) => {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
};

/**
 * Generate a JWT token (simplified version)
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
export const generateToken = (user) => {
  // In a real application, this would use a proper JWT library
  // This is a simplified version for demonstration purposes
  
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
  };
  
  const headerStr = Buffer.from(JSON.stringify(header)).toString('base64').replace(/=/g, '');
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64').replace(/=/g, '');
  
  // In a real application, this would use a proper secret key
  const secret = 'jyotaishya-secret-key';
  
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${headerStr}.${payloadStr}`)
    .digest('base64')
    .replace(/=/g, '');
  
  return `${headerStr}.${payloadStr}.${signature}`;
};

/**
 * Verify a JWT token (simplified version)
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload or null if invalid
 */
export const verifyToken = (token) => {
  // In a real application, this would use a proper JWT library
  // This is a simplified version for demonstration purposes
  
  try {
    const [headerStr, payloadStr, signature] = token.split('.');
    
    // In a real application, this would use a proper secret key
    const secret = 'jyotaishya-secret-key';
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${headerStr}.${payloadStr}`)
      .digest('base64')
      .replace(/=/g, '');
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64').toString());
    
    // Check if token is expired
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return payload;
  } catch (error) {
    return null;
  }
};

/**
 * Register a new user
 * @param {string} name - User's name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object} User object and token
 */
export const registerUser = (name, email, password) => {
  // Check if user already exists
  const existingUser = getUserByEmail(email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  // Hash password
  const { hash, salt } = hashPassword(password);
  
  // Create user
  const user = createUser({
    name,
    email,
    password: hash,
    salt
  });
  
  // Generate token
  const token = generateToken(user);
  
  return { user, token };
};

/**
 * Login a user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object} User object and token
 */
export const loginUser = (email, password) => {
  // Get user
  const user = getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Verify password
  if (!verifyPassword(password, user.password, user.salt)) {
    throw new Error('Invalid email or password');
  }
  
  // Generate token
  const token = generateToken(user);
  
  // Return user without password and salt
  const { password: _, salt: __, ...userWithoutSensitiveData } = user;
  
  return { user: userWithoutSensitiveData, token };
};

/**
 * Authentication middleware
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
export const authMiddleware = (req, res, next) => {
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
    if (!decoded) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
    
    // Add user to request
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication failed', 
      error: error.message 
    });
  }
};