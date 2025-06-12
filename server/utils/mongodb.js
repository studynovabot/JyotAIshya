/**
 * MongoDB connection utility for serverless functions
 * This file provides optimized MongoDB connection handling for Vercel serverless functions
 */

import mongoose from 'mongoose';
import { connectDB, isConnected } from '../../server/config/database.js';

// Cache the database connection
let cachedConnection = null;

/**
 * Connect to MongoDB with caching for serverless functions
 * This prevents creating multiple connections in serverless environments
 */
export const connectToDatabase = async () => {
  // If we already have a cached connection and it's valid, use it
  if (cachedConnection && isConnected()) {
    console.log('🔄 Using cached MongoDB connection');
    return cachedConnection;
  }

  // Otherwise, create a new connection
  console.log('🔄 Creating new MongoDB connection for serverless function');
  
  try {
    // Connect using the main connectDB function
    const connection = await connectDB();
    
    // Cache the connection
    cachedConnection = connection;
    
    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection error in serverless function:', error);
    throw error;
  }
};

/**
 * Wrapper function to handle database operations with proper connection management
 * @param {Function} dbOperation - Async function that performs database operations
 * @returns {Promise} - Result of the database operation
 */
export const withDatabase = async (dbOperation) => {
  try {
    // Ensure we have a database connection
    await connectToDatabase();
    
    // Execute the database operation
    return await dbOperation();
  } catch (error) {
    console.error('❌ Database operation error:', error);
    throw error;
  }
};

/**
 * Check if MongoDB is connected
 */
export const isDatabaseConnected = () => {
  return isConnected();
};

export default {
  connectToDatabase,
  withDatabase,
  isDatabaseConnected
};