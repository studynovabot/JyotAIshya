import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jyotaishya';

// Track connection status
let isInitialized = false;
let connectionPromise = null;

// Mongoose connection options optimized for serverless environments
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Reduce server selection timeout
  socketTimeoutMS: 45000, // Socket timeout
  family: 4, // Use IPv4, skip trying IPv6
  maxPoolSize: 10, // Limit pool size for serverless
  minPoolSize: 1, // Maintain at least one connection
  maxIdleTimeMS: 10000, // Close idle connections after 10 seconds
  connectTimeoutMS: 10000, // Connection timeout after 10 seconds
};

/**
 * Connect to MongoDB database with connection pooling for serverless environments
 */
const connectDB = async () => {
  // If we already have a connection promise in progress, return it
  if (connectionPromise) {
    return connectionPromise;
  }

  // If mongoose is already connected, return the connection
  if (mongoose.connection.readyState === 1) {
    console.log('📊 Using existing MongoDB connection');
    isInitialized = true;
    return mongoose.connection;
  }

  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Create a new connection promise
    connectionPromise = mongoose.connect(MONGODB_URI, connectionOptions);
    
    // Wait for connection
    const conn = await connectionPromise;
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      isInitialized = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      isInitialized = false;
      connectionPromise = null;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
      isInitialized = true;
    });

    // Set initialized flag
    isInitialized = true;
    
    return conn;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    
    // Reset connection promise on error
    connectionPromise = null;
    isInitialized = false;
    
    // In serverless, don't exit the process on connection failure
    if (process.env.NODE_ENV === 'production') {
      throw error;
    } else {
      // In development, we might want to exit
      process.exit(1);
    }
  }
};

/**
 * Disconnect from MongoDB
 */
const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed');
    }
    connectionPromise = null;
    isInitialized = false;
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
  }
};

/**
 * Check if MongoDB is connected
 */
const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Check if MongoDB connection has been initialized
 */
const isConnectionInitialized = () => {
  return isInitialized;
};

/**
 * Get connection status
 */
const getConnectionStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  return {
    state: states[mongoose.connection.readyState],
    host: mongoose.connection.host,
    name: mongoose.connection.name,
    port: mongoose.connection.port,
    initialized: isInitialized
  };
};

// Only set up process termination handlers in non-serverless environments
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  process.on('SIGINT', async () => {
    await disconnectDB();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await disconnectDB();
    process.exit(0);
  });
}

export {
  connectDB,
  disconnectDB,
  isConnected,
  isConnectionInitialized,
  getConnectionStatus
};