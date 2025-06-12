// Test environment variables
export default function handler(req, res) {
  try {
    // Check if we can access environment variables
    const envVars = {
      MONGODB_URI: process.env.MONGODB_URI ? 'Set (starts with: ' + process.env.MONGODB_URI.substring(0, 10) + '...)' : 'Not set',
      NODE_ENV: process.env.NODE_ENV || 'Not set',
      JWT_SECRET: process.env.JWT_SECRET ? 'Set (length: ' + process.env.JWT_SECRET.length + ')' : 'Not set'
    };

    // Check if we can access the file system
    const fs = require('fs');
    const path = require('path');
    
    // Check if server directory exists
    const serverDirExists = fs.existsSync(path.join(process.cwd(), 'server'));
    const apiDirExists = fs.existsSync(path.join(process.cwd(), 'api'));
    
    // Return the environment information
    res.status(200).json({
      success: true,
      environment: process.env.NODE_ENV,
      envVars,
      fileSystem: {
        cwd: process.cwd(),
        serverDirExists,
        apiDirExists,
        dirs: fs.readdirSync(process.cwd())
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking environment',
      error: error.message,
      stack: error.stack
    });
  }
}