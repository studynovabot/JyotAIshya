/**
 * Utility to check required environment variables on startup
 */

const requiredEnvVars = [
  'PORT',
  'NODE_ENV',
  'JWT_SECRET',
  'GROQ_API_KEY',
  'TOGETHER_AI_API_KEY'
];

const recommendedEnvVars = [
  'CORS_ORIGIN'
];

export const checkEnvVariables = () => {
  console.log('Checking environment variables...');
  
  const missing = [];
  const recommended = [];
  
  // Check required variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }
  
  // Check recommended variables
  for (const envVar of recommendedEnvVars) {
    if (!process.env[envVar]) {
      recommended.push(envVar);
    }
  }
  
  // Report results
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(envVar => console.error(`   - ${envVar}`));
    console.error('Please set these variables in your .env file.');
    return false;
  }
  
  if (recommended.length > 0) {
    console.warn('⚠️ Missing recommended environment variables:');
    recommended.forEach(envVar => console.warn(`   - ${envVar}`));
  }
  
  console.log('✅ All required environment variables are set.');
  return true;
};

export default { checkEnvVariables };