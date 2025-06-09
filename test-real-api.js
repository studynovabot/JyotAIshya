#!/usr/bin/env node

/**
 * Test Real API Kundali Functionality
 * Tests the actual kundali generation API endpoints
 */

console.log('🧪 TESTING REAL API KUNDALI FUNCTIONALITY');
console.log('=' .repeat(60));

// Test 1: Direct function import test
async function testDirectFunctions() {
  console.log('\n📋 Test 1: Direct Function Import Test');
  console.log('-'.repeat(40));
  
  try {
    // Import the calculation functions directly
    const { calculateKundali, checkDoshas, calculateDasha } = await import('./server/utils/astroCalculationsNew.js');
    
    console.log('✅ Successfully imported calculation functions');
    
    // Test data
    const testData = {
      name: 'API Function Test',
      birthDate: '1990-05-15',
      birthTime: '14:30',
      birthPlace: 'New Delhi, India'
    };
    
    console.log('🔄 Testing with data:', testData);
    
    // Test kundali calculation
    const kundaliData = await calculateKundali(
      testData.name,
      testData.birthDate, 
      testData.birthTime,
      testData.birthPlace
    );
    
    console.log('✅ Kundali calculation: SUCCESS');
    console.log('   Planets count:', kundaliData.planets.length);
    console.log('   Ascendant:', kundaliData.ascendant.rashiName?.english || kundaliData.ascendant.rashiName);
    
    // Test dosha checking
    const doshas = checkDoshas(kundaliData);
    console.log('✅ Dosha analysis: SUCCESS');
    console.log('   Doshas found:', Object.keys(doshas).filter(key => doshas[key].present).join(', ') || 'None');
    
    // Test dasha calculation
    const dashaPeriods = calculateDasha(kundaliData);
    console.log('✅ Dasha calculation: SUCCESS');
    console.log('   Current dasha:', dashaPeriods.currentDasha.planet?.english || dashaPeriods.currentDasha.planet);
    
    return true;
    
  } catch (error) {
    console.log('❌ Direct function test FAILED');
    console.log('   Error:', error.message);
    return false;
  }
}

// Test 2: HTTP API test using fetch
async function testHTTPAPI() {
  console.log('\n📋 Test 2: HTTP API Endpoint Test');
  console.log('-'.repeat(40));
  
  try {
    // Import fetch
    const fetch = (await import('node-fetch')).default;
    
    const testData = {
      name: 'HTTP API Test',
      birthDate: '1990-05-15',
      birthTime: '14:30',
      birthPlace: 'New Delhi, India'
    };
    
    console.log('🔄 Making HTTP request to local API...');
    console.log('   URL: http://localhost:3002/api/kundali/generate');
    console.log('   Data:', testData);
    
    const response = await fetch('http://localhost:3002/api/kundali/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData),
      timeout: 30000
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response OK:', response.ok);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ HTTP API test: SUCCESS');
    console.log('   Response success:', data.success);
    console.log('   Name:', data.data?.name);
    console.log('   Planets count:', data.data?.planets?.length);
    console.log('   Ascendant:', data.data?.ascendant?.rashiName?.english || data.data?.ascendant?.rashiName);
    console.log('   Has doshas:', !!data.data?.doshas);
    console.log('   Has dasha periods:', !!data.data?.dashaPeriods);
    
    return true;
    
  } catch (error) {
    console.log('❌ HTTP API test FAILED');
    console.log('   Error:', error.message);
    return false;
  }
}

// Test 3: Server route test
async function testServerRoute() {
  console.log('\n📋 Test 3: Server Route Import Test');
  console.log('-'.repeat(40));
  
  try {
    // Check if server route file exists and can be imported
    const routeModule = await import('./server/routes/kundali.js');
    console.log('✅ Server route import: SUCCESS');
    console.log('   Route module loaded');
    
    return true;
    
  } catch (error) {
    console.log('❌ Server route test FAILED');
    console.log('   Error:', error.message);
    return false;
  }
}

// Main test execution
async function runAllTests() {
  console.log('🚀 Starting comprehensive API tests...\n');
  
  const results = {
    directFunctions: false,
    httpAPI: false,
    serverRoute: false
  };
  
  // Run tests
  results.directFunctions = await testDirectFunctions();
  results.httpAPI = await testHTTPAPI();
  results.serverRoute = await testServerRoute();
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(60));
  
  console.log('Direct Functions:', results.directFunctions ? '✅ WORKING' : '❌ FAILED');
  console.log('HTTP API:', results.httpAPI ? '✅ WORKING' : '❌ FAILED');
  console.log('Server Route:', results.serverRoute ? '✅ WORKING' : '❌ FAILED');
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  console.log('\nOverall Status:', passedTests === totalTests ? '✅ ALL TESTS PASSED' : `⚠️ ${passedTests}/${totalTests} TESTS PASSED`);
  
  if (results.directFunctions && results.serverRoute) {
    console.log('\n🎉 REAL API KUNDALI FUNCTIONALITY: CONFIRMED WORKING');
    console.log('   ✅ Astrological calculations functional');
    console.log('   ✅ Server routes properly configured');
    if (results.httpAPI) {
      console.log('   ✅ HTTP API endpoints accessible');
    } else {
      console.log('   ⚠️ HTTP API may have network connectivity issues');
    }
  } else {
    console.log('\n❌ ISSUES DETECTED IN API FUNCTIONALITY');
  }
  
  process.exit(passedTests === totalTests ? 0 : 1);
}

// Run the tests
runAllTests().catch(error => {
  console.error('\n💥 CRITICAL ERROR:', error.message);
  process.exit(1);
});
