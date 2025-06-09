#!/usr/bin/env node

/**
 * Deploy and Test Script for JyotAIshya
 * This script helps deploy both frontend and backend together and test the integration
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 JyotAIshya Deployment and Test Script');
console.log('=' .repeat(50));

// Function to run a command and return a promise
function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`\n📋 Running: ${command} ${args.join(' ')}`);
    
    const process = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    process.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ Command completed successfully`);
        resolve(code);
      } else {
        console.log(`❌ Command failed with code ${code}`);
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    process.on('error', (error) => {
      console.error(`❌ Error running command: ${error.message}`);
      reject(error);
    });
  });
}

// Function to test API endpoint
async function testEndpoint(url, description) {
  try {
    console.log(`\n🧪 Testing: ${description}`);
    console.log(`   URL: ${url}`);
    
    const response = await fetch(url);
    const status = response.status;
    
    if (status === 200) {
      console.log(`   ✅ Status: ${status} - SUCCESS`);
      try {
        const data = await response.json();
        console.log(`   📊 Response: ${JSON.stringify(data, null, 2).substring(0, 200)}...`);
      } catch (e) {
        console.log(`   📊 Response: Non-JSON response`);
      }
      return true;
    } else {
      console.log(`   ❌ Status: ${status} - FAILED`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

// Main deployment and test function
async function deployAndTest() {
  try {
    console.log('\n🔧 Step 1: Building Frontend');
    await runCommand('npm', ['run', 'build']);

    console.log('\n🚀 Step 2: Deploying to Vercel');
    console.log('Note: This will deploy both frontend and backend together');
    console.log('Make sure you have Vercel CLI installed and are logged in');
    
    // Check if vercel is installed
    try {
      await runCommand('vercel', ['--version']);
    } catch (error) {
      console.log('\n❌ Vercel CLI not found. Please install it:');
      console.log('   npm install -g vercel');
      console.log('   vercel login');
      return;
    }

    // Deploy to Vercel
    console.log('\n🚀 Deploying to production...');
    await runCommand('vercel', ['--prod']);

    console.log('\n✅ Deployment completed!');
    console.log('\n📋 Next Steps:');
    console.log('1. Check the deployment URL provided by Vercel');
    console.log('2. Test the API endpoints manually');
    console.log('3. Test the frontend birth chart generation');

    // Prompt for deployment URL
    console.log('\n🔍 To test the deployment, please provide the deployment URL:');
    console.log('Example: https://jyotaishya-abc123.vercel.app');
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure Vercel CLI is installed: npm install -g vercel');
    console.log('2. Make sure you are logged in: vercel login');
    console.log('3. Check that all files are committed to git');
    console.log('4. Verify vercel.json configuration is correct');
  }
}

// Function to test a deployed application
async function testDeployment(baseUrl) {
  console.log(`\n🧪 Testing deployment at: ${baseUrl}`);
  console.log('=' .repeat(50));

  const tests = [
    { url: `${baseUrl}/api/health`, description: 'Health Check API' },
    { url: `${baseUrl}/api/`, description: 'API Info Endpoint' },
    { url: `${baseUrl}/api/astro/coordinates?place=Delhi`, description: 'Coordinates API' },
    { url: `${baseUrl}/`, description: 'Frontend Application' },
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    const success = await testEndpoint(test.url, test.description);
    if (success) passedTests++;
  }

  console.log('\n📊 Test Results:');
  console.log(`   ✅ Passed: ${passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Deployment is successful.');
    console.log('\n📋 You can now:');
    console.log('1. Visit the frontend and test birth chart generation');
    console.log('2. Use the /api-test page for comprehensive testing');
    console.log('3. Test all features end-to-end');
  } else {
    console.log('\n⚠️  Some tests failed. Check the deployment configuration.');
  }
}

// Check command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  // Run deployment
  deployAndTest();
} else if (args[0] === 'test' && args[1]) {
  // Test existing deployment
  testDeployment(args[1]);
} else {
  console.log('\n📋 Usage:');
  console.log('  node deploy-and-test.js                    # Deploy and build');
  console.log('  node deploy-and-test.js test <URL>         # Test existing deployment');
  console.log('\nExamples:');
  console.log('  node deploy-and-test.js');
  console.log('  node deploy-and-test.js test https://jyotaishya.vercel.app');
}
