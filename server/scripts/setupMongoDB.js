import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/database.js';

dotenv.config();

/**
 * Test MongoDB connection and setup
 */
async function setupMongoDB() {
  console.log('🚀 MongoDB Atlas Setup Script');
  console.log('================================');
  
  try {
    // Test connection
    console.log('🔄 Testing MongoDB connection...');
    await connectDB();
    
    console.log('✅ MongoDB connection successful!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    
    // Create indexes for better performance
    console.log('🔧 Setting up database indexes...');
    
    // User indexes
    const userCollection = mongoose.connection.collection('users');
    await userCollection.createIndex({ email: 1 }, { unique: true });
    await userCollection.createIndex({ createdAt: -1 });
    console.log('✅ User indexes created');
    
    // Kundali indexes
    const kundaliCollection = mongoose.connection.collection('kundalis');
    await kundaliCollection.createIndex({ userId: 1, createdAt: -1 });
    await kundaliCollection.createIndex({ isPublic: 1 });
    await kundaliCollection.createIndex({ placeOfBirth: 1 });
    await kundaliCollection.createIndex({ dateOfBirth: 1 });
    console.log('✅ Kundali indexes created');
    
    // Horoscope indexes
    const horoscopeCollection = mongoose.connection.collection('horoscopes');
    await horoscopeCollection.createIndex({ sign: 1, date: -1, type: 1 });
    await horoscopeCollection.createIndex({ date: -1, isActive: 1 });
    console.log('✅ Horoscope indexes created');
    
    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📋 Available collections:');
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    // Database stats
    const stats = await mongoose.connection.db.stats();
    console.log('\n📊 Database Statistics:');
    console.log(`   Collections: ${stats.collections}`);
    console.log(`   Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
    
    console.log('\n🎉 MongoDB setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Run: npm run db:init (to add sample data)');
    console.log('2. Start your server: npm start');
    console.log('3. Test your API endpoints');
    
  } catch (error) {
    console.error('❌ MongoDB setup failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 Authentication Error Solutions:');
      console.log('1. Check your username and password in the connection string');
      console.log('2. Ensure the database user has proper permissions');
      console.log('3. Verify the database name in the connection string');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('timeout')) {
      console.log('\n💡 Connection Error Solutions:');
      console.log('1. Check your internet connection');
      console.log('2. Verify the cluster URL in your connection string');
      console.log('3. Ensure your IP is whitelisted in MongoDB Atlas');
      console.log('4. Try using 0.0.0.0/0 for IP whitelist (development only)');
    } else if (error.message.includes('MONGODB_URI')) {
      console.log('\n💡 Configuration Error Solutions:');
      console.log('1. Set MONGODB_URI in your .env file');
      console.log('2. Get connection string from MongoDB Atlas dashboard');
      console.log('3. Replace <username>, <password>, and <database> placeholders');
    }
    
    console.log('\n🔗 Helpful Links:');
    console.log('- MongoDB Atlas: https://cloud.mongodb.com/');
    console.log('- Connection Guide: https://docs.mongodb.com/atlas/connect-to-cluster/');
    console.log('- Troubleshooting: https://docs.mongodb.com/atlas/troubleshoot-connection/');
  } finally {
    await disconnectDB();
  }
}

/**
 * Validate connection string format
 */
function validateConnectionString() {
  const uri = process.env.MONGODB_URI;
  
  console.log('🔍 Validating connection string...');
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    return false;
  }
  
  if (uri.includes('REPLACE_WITH_YOUR_PASSWORD')) {
    console.error('❌ Please replace REPLACE_WITH_YOUR_PASSWORD with your actual password');
    return false;
  }
  
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    console.error('❌ Invalid MongoDB URI format');
    return false;
  }
  
  if (uri.includes('<username>') || uri.includes('<password>') || uri.includes('<database>')) {
    console.error('❌ Please replace placeholders in connection string');
    return false;
  }
  
  console.log('✅ Connection string format looks valid');
  return true;
}

// Check command line arguments
const command = process.argv[2];

if (command === 'validate') {
  validateConnectionString();
} else {
  if (validateConnectionString()) {
    setupMongoDB();
  }
}
