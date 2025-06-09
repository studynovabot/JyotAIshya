#!/usr/bin/env node

/**
 * Test the updated Vercel API functions locally
 */

console.log('🧪 TESTING UPDATED VERCEL API FUNCTIONS');
console.log('=' .repeat(60));

async function testAPIFunction() {
  console.log('\n📋 Testing API Function Import');
  console.log('-'.repeat(40));
  
  try {
    // Import the API function
    const apiFunction = await import('./api/kundali/generate.js');
    console.log('✅ API function imported successfully');
    
    // Create mock request and response objects
    const mockReq = {
      method: 'POST',
      body: {
        name: 'Vercel API Test',
        birthDate: '1990-05-15',
        birthTime: '14:30',
        birthPlace: 'New Delhi, India'
      }
    };
    
    const mockRes = {
      statusCode: 200,
      headers: {},
      setHeader: function(key, value) {
        this.headers[key] = value;
      },
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.responseData = data;
        return this;
      },
      end: function() {
        return this;
      }
    };
    
    console.log('🔄 Testing API function with mock data...');
    console.log('Request data:', mockReq.body);
    
    // Call the API function
    await apiFunction.default(mockReq, mockRes);
    
    console.log('📡 Response status:', mockRes.statusCode);
    console.log('📡 Response success:', mockRes.responseData?.success);
    
    if (mockRes.responseData?.success && mockRes.responseData?.data) {
      console.log('✅ Vercel API function: SUCCESS');
      console.log('   Name:', mockRes.responseData.data.name);
      console.log('   Planets count:', mockRes.responseData.data.planets?.length);
      console.log('   Ascendant:', mockRes.responseData.data.ascendant?.rashiName?.english || mockRes.responseData.data.ascendant?.rashiName);
      console.log('   Has doshas:', !!mockRes.responseData.data.doshas);
      console.log('   Has dasha periods:', !!mockRes.responseData.data.dashaPeriods);
      return true;
    } else {
      console.log('❌ Vercel API function: FAILED');
      console.log('   Error:', mockRes.responseData?.message || 'Unknown error');
      console.log('   Full response:', mockRes.responseData);
      return false;
    }
    
  } catch (error) {
    console.log('❌ API function test FAILED');
    console.log('   Error:', error.message);
    console.log('   Stack:', error.stack);
    return false;
  }
}

async function testHealthEndpoint() {
  console.log('\n📋 Testing Health Endpoint');
  console.log('-'.repeat(40));
  
  try {
    // Import the health function
    const healthFunction = await import('./api/health.js');
    console.log('✅ Health function imported successfully');
    
    // Create mock request and response objects
    const mockReq = {
      method: 'GET'
    };
    
    const mockRes = {
      statusCode: 200,
      headers: {},
      setHeader: function(key, value) {
        this.headers[key] = value;
      },
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.responseData = data;
        return this;
      },
      end: function() {
        return this;
      }
    };
    
    console.log('🔄 Testing health endpoint...');
    
    // Call the health function
    await healthFunction.default(mockReq, mockRes);
    
    console.log('📡 Response status:', mockRes.statusCode);
    console.log('📡 Response success:', mockRes.responseData?.success);
    console.log('📡 Response message:', mockRes.responseData?.message);
    
    if (mockRes.responseData?.success) {
      console.log('✅ Health endpoint: SUCCESS');
      return true;
    } else {
      console.log('❌ Health endpoint: FAILED');
      return false;
    }
    
  } catch (error) {
    console.log('❌ Health endpoint test FAILED');
    console.log('   Error:', error.message);
    return false;
  }
}

// Main test execution
async function runTests() {
  console.log('🚀 Starting Vercel API tests...\n');
  
  const results = {
    health: false,
    kundali: false
  };
  
  // Run tests
  results.health = await testHealthEndpoint();
  results.kundali = await testAPIFunction();
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 VERCEL API TEST RESULTS');
  console.log('='.repeat(60));
  
  console.log('Health Endpoint:', results.health ? '✅ WORKING' : '❌ FAILED');
  console.log('Kundali API:', results.kundali ? '✅ WORKING' : '❌ FAILED');
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  console.log('\nOverall Status:', passedTests === totalTests ? '✅ READY FOR DEPLOYMENT' : `⚠️ ${passedTests}/${totalTests} TESTS PASSED`);
  
  if (passedTests === totalTests) {
    console.log('\n🚀 VERCEL DEPLOYMENT READY!');
    console.log('   ✅ API functions working correctly');
    console.log('   ✅ Health endpoint functional');
    console.log('   ✅ Kundali generation working');
    console.log('\n📋 Next steps:');
    console.log('   1. Deploy to Vercel: vercel --prod');
    console.log('   2. Update frontend API URL to use deployed backend');
    console.log('   3. Test end-to-end integration');
  } else {
    console.log('\n❌ DEPLOYMENT NOT READY');
    console.log('   Fix the failing tests before deploying');
  }
  
  process.exit(passedTests === totalTests ? 0 : 1);
}

// Run the tests
runTests().catch(error => {
  console.error('\n💥 CRITICAL ERROR:', error.message);
  process.exit(1);
});
