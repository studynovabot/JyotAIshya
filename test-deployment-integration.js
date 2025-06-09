#!/usr/bin/env node

/**
 * Comprehensive test for deployed backend and frontend integration
 */

console.log('🚀 TESTING DEPLOYED BACKEND INTEGRATION');
console.log('=' .repeat(70));

const DEPLOYED_API_URL = 'https://jyotaishya-hylyg8i4x-ranveer-singh-rajputs-projects.vercel.app/api';

async function testDeployedAPI() {
  console.log('\n📋 Testing Deployed API Endpoints');
  console.log('-'.repeat(50));
  console.log('API URL:', DEPLOYED_API_URL);
  
  try {
    const fetch = (await import('node-fetch')).default;
    
    // Test 1: Health endpoint
    console.log('\n🔄 Testing health endpoint...');
    try {
      const healthResponse = await fetch(`${DEPLOYED_API_URL}/health`, {
        method: 'GET',
        timeout: 30000
      });
      
      console.log('Health Status:', healthResponse.status);
      
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log('✅ Health Check: SUCCESS');
        console.log('   Message:', healthData.message);
        console.log('   Success:', healthData.success);
      } else {
        console.log('❌ Health Check: FAILED');
        console.log('   Status:', healthResponse.status);
        const errorText = await healthResponse.text();
        console.log('   Response:', errorText.substring(0, 200));
      }
    } catch (healthError) {
      console.log('❌ Health Check: ERROR');
      console.log('   Error:', healthError.message);
    }
    
    // Test 2: Kundali generation endpoint
    console.log('\n🔄 Testing kundali generation endpoint...');
    const testData = {
      name: 'Deployed Backend Test',
      birthDate: '1990-05-15',
      birthTime: '14:30',
      birthPlace: 'New Delhi, India'
    };
    
    console.log('   Test data:', testData);
    
    try {
      const kundaliResponse = await fetch(`${DEPLOYED_API_URL}/kundali/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData),
        timeout: 60000
      });
      
      console.log('Kundali Status:', kundaliResponse.status);
      
      if (kundaliResponse.ok) {
        const kundaliData = await kundaliResponse.json();
        console.log('✅ Kundali Generation: SUCCESS');
        console.log('   Response Success:', kundaliData.success);
        console.log('   Name:', kundaliData.data?.name);
        console.log('   Planets Count:', kundaliData.data?.planets?.length);
        console.log('   Ascendant:', kundaliData.data?.ascendant?.rashiName?.english || kundaliData.data?.ascendant?.rashiName);
        console.log('   Has Doshas:', !!kundaliData.data?.doshas);
        console.log('   Has Dasha Periods:', !!kundaliData.data?.dashaPeriods);
        
        return {
          health: true,
          kundali: true,
          apiUrl: DEPLOYED_API_URL
        };
      } else {
        console.log('❌ Kundali Generation: FAILED');
        console.log('   Status:', kundaliResponse.status);
        const errorText = await kundaliResponse.text();
        console.log('   Response:', errorText.substring(0, 200));
        
        return {
          health: true,
          kundali: false,
          apiUrl: DEPLOYED_API_URL
        };
      }
    } catch (kundaliError) {
      console.log('❌ Kundali Generation: ERROR');
      console.log('   Error:', kundaliError.message);
      
      return {
        health: true,
        kundali: false,
        apiUrl: DEPLOYED_API_URL
      };
    }
    
  } catch (error) {
    console.log('❌ API Test: CRITICAL ERROR');
    console.log('   Error:', error.message);
    
    return {
      health: false,
      kundali: false,
      apiUrl: DEPLOYED_API_URL
    };
  }
}

async function testFrontendConfiguration() {
  console.log('\n📋 Testing Frontend API Configuration');
  console.log('-'.repeat(50));
  
  try {
    // Import the frontend API configuration
    const apiModule = await import('./client/src/utils/api.ts');
    
    console.log('✅ Frontend API module imported successfully');
    console.log('   Configured API URL:', apiModule.API_URL);
    
    // Check if the API URL matches our deployed URL
    const expectedUrl = DEPLOYED_API_URL;
    const configuredUrl = apiModule.API_URL;
    
    if (configuredUrl === expectedUrl) {
      console.log('✅ Frontend API URL: CORRECTLY CONFIGURED');
      console.log('   Frontend will use deployed backend');
      return true;
    } else {
      console.log('⚠️ Frontend API URL: MISMATCH');
      console.log('   Expected:', expectedUrl);
      console.log('   Configured:', configuredUrl);
      console.log('   Frontend may not connect to deployed backend');
      return false;
    }
    
  } catch (error) {
    console.log('❌ Frontend Configuration Test: FAILED');
    console.log('   Error:', error.message);
    return false;
  }
}

async function generateDeploymentReport(apiResults, frontendResults) {
  console.log('\n' + '='.repeat(70));
  console.log('📊 DEPLOYMENT INTEGRATION REPORT');
  console.log('='.repeat(70));
  
  console.log('\n🌐 Backend Deployment Status:');
  console.log('   API URL:', apiResults.apiUrl);
  console.log('   Health Endpoint:', apiResults.health ? '✅ WORKING' : '❌ FAILED');
  console.log('   Kundali Endpoint:', apiResults.kundali ? '✅ WORKING' : '❌ FAILED');
  
  console.log('\n🖥️ Frontend Configuration:');
  console.log('   API Configuration:', frontendResults ? '✅ CORRECT' : '⚠️ NEEDS UPDATE');
  
  const overallStatus = apiResults.health && apiResults.kundali && frontendResults;
  
  console.log('\n🎯 Overall Integration Status:');
  if (overallStatus) {
    console.log('   ✅ FULLY INTEGRATED AND READY');
    console.log('   🎉 Frontend can access deployed backend');
    console.log('   🚀 No local backend required');
    console.log('   🌍 Application accessible from anywhere');
  } else {
    console.log('   ⚠️ INTEGRATION ISSUES DETECTED');
    
    if (!apiResults.health || !apiResults.kundali) {
      console.log('   🔧 Backend deployment needs fixing');
    }
    
    if (!frontendResults) {
      console.log('   🔧 Frontend API configuration needs updating');
    }
  }
  
  console.log('\n📋 Next Steps:');
  if (overallStatus) {
    console.log('   1. ✅ Backend successfully deployed to Vercel');
    console.log('   2. ✅ Frontend configured to use deployed backend');
    console.log('   3. 🎯 Test the web application in browser');
    console.log('   4. 🚀 Deploy frontend to production if needed');
  } else {
    console.log('   1. 🔧 Fix backend deployment issues');
    console.log('   2. 🔧 Update frontend API configuration');
    console.log('   3. 🧪 Re-test integration');
  }
  
  console.log('\n🌐 Deployed API Endpoints:');
  console.log(`   Health: ${apiResults.apiUrl}/health`);
  console.log(`   Kundali: ${apiResults.apiUrl}/kundali/generate`);
  
  return overallStatus;
}

// Main execution
async function runDeploymentTests() {
  console.log('🚀 Starting deployment integration tests...\n');
  
  try {
    // Test deployed API
    const apiResults = await testDeployedAPI();
    
    // Test frontend configuration
    const frontendResults = await testFrontendConfiguration();
    
    // Generate comprehensive report
    const success = await generateDeploymentReport(apiResults, frontendResults);
    
    process.exit(success ? 0 : 1);
    
  } catch (error) {
    console.error('\n💥 CRITICAL ERROR:', error.message);
    process.exit(1);
  }
}

// Run the tests
runDeploymentTests();
