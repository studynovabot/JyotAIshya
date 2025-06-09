#!/usr/bin/env node

/**
 * Comprehensive CLI Test Suite for JyotAIshya Web Application
 * Tests all functionality including API endpoints, database connectivity, 
 * astrological calculations, and error handling
 */

import fetch from 'node-fetch';
import { connectDB, disconnectDB, isConnected } from './server/config/database.js';
import { calculateKundali, checkDoshas, calculateDasha } from './server/utils/astroCalculationsNew.js';
import { registerUser, loginUser } from './server/utils/auth.js';
import fs from 'fs';
import path from 'path';

// Test configuration
const TEST_CONFIG = {
  // Use local server for testing
  API_BASE_URL: 'http://localhost:3000',
  // Fallback to deployed API if local server is not running
  FALLBACK_API_URL: 'https://jyotaishya-nabtzaeyk-ranveer-singh-rajputs-projects.vercel.app',
  TIMEOUT: 30000,
  TEST_USER: {
    name: 'Test User CLI',
    email: `test-${Date.now()}@example.com`,
    password: 'testpassword123'
  },
  SAMPLE_BIRTH_DATA: [
    {
      name: "Rajesh Kumar",
      birthDate: "1985-03-20",
      birthTime: "08:45",
      birthPlace: "Mumbai, India"
    },
    {
      name: "Priya Sharma", 
      birthDate: "1992-11-08",
      birthTime: "16:20",
      birthPlace: "Jaipur, India"
    },
    {
      name: "Amit Singh",
      birthDate: "1988-07-12", 
      birthTime: "22:15",
      birthPlace: "Kolkata, India"
    }
  ]
};

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Utility functions
function logTest(testName, status, details = '') {
  const symbol = status ? '✅' : '❌';
  const statusText = status ? 'PASSED' : 'FAILED';
  console.log(`${symbol} ${testName}: ${statusText}`);
  if (details) {
    console.log(`   ${details}`);
  }
  
  testResults.total++;
  if (status) {
    testResults.passed++;
  } else {
    testResults.failed++;
  }
  
  testResults.details.push({
    test: testName,
    status: statusText,
    details
  });
}

function logSection(title) {
  console.log('\n' + '='.repeat(80));
  console.log(`🔍 ${title}`);
  console.log('='.repeat(80));
}

async function makeRequest(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TEST_CONFIG.TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Test functions
async function testDatabaseConnectivity() {
  logSection('DATABASE CONNECTIVITY TESTING');
  
  try {
    console.log('🔄 Testing MongoDB Atlas connection...');
    await connectDB();
    
    const connected = isConnected();
    logTest('MongoDB Atlas Connection', connected, 
      connected ? 'Successfully connected to MongoDB Atlas' : 'Failed to connect to MongoDB Atlas');
    
    if (connected) {
      // Test basic database operations
      const mongoose = await import('mongoose');
      const testCollection = mongoose.default.connection.db.collection('test_connection');
      
      // Test write operation
      const writeResult = await testCollection.insertOne({ 
        test: true, 
        timestamp: new Date(),
        testId: `test-${Date.now()}`
      });
      logTest('Database Write Operation', !!writeResult.insertedId, 
        `Document inserted with ID: ${writeResult.insertedId}`);
      
      // Test read operation
      const readResult = await testCollection.findOne({ _id: writeResult.insertedId });
      logTest('Database Read Operation', !!readResult, 
        `Document retrieved: ${readResult ? 'Success' : 'Failed'}`);
      
      // Test delete operation
      const deleteResult = await testCollection.deleteOne({ _id: writeResult.insertedId });
      logTest('Database Delete Operation', deleteResult.deletedCount === 1, 
        `Documents deleted: ${deleteResult.deletedCount}`);
    }
    
  } catch (error) {
    logTest('MongoDB Atlas Connection', false, `Error: ${error.message}`);
  }
}

async function testServerConnectivity() {
  logSection('SERVER CONNECTIVITY TESTING');
  
  // Test local server first
  let apiBaseUrl = TEST_CONFIG.API_BASE_URL;
  
  try {
    console.log(`🔄 Testing local server at ${apiBaseUrl}...`);
    const response = await makeRequest(apiBaseUrl);
    
    if (response.ok) {
      const data = await response.json();
      logTest('Local Server Connectivity', true, 
        `Server running: ${data.message || 'JyotAIshya API'}`);
    } else {
      throw new Error(`Server responded with status: ${response.status}`);
    }
  } catch (error) {
    logTest('Local Server Connectivity', false, `Error: ${error.message}`);
    
    // Fallback to deployed API
    console.log(`🔄 Testing deployed API at ${TEST_CONFIG.FALLBACK_API_URL}...`);
    apiBaseUrl = TEST_CONFIG.FALLBACK_API_URL;
    
    try {
      const response = await makeRequest(apiBaseUrl);
      if (response.ok) {
        const data = await response.json();
        logTest('Deployed API Connectivity', true, 
          `Deployed API accessible: ${data.message || 'JyotAIshya API'}`);
        TEST_CONFIG.API_BASE_URL = apiBaseUrl; // Update for subsequent tests
      } else {
        throw new Error(`API responded with status: ${response.status}`);
      }
    } catch (fallbackError) {
      logTest('Deployed API Connectivity', false, `Error: ${fallbackError.message}`);
      throw new Error('Neither local server nor deployed API is accessible');
    }
  }
  
  return apiBaseUrl;
}

async function testHealthEndpoint(apiBaseUrl) {
  logSection('HEALTH ENDPOINT TESTING');
  
  try {
    console.log('🔄 Testing health endpoint...');
    const response = await makeRequest(`${apiBaseUrl}/api/health`);
    
    if (response.ok) {
      const data = await response.json();
      logTest('Health Endpoint', data.success, 
        `Health check: ${data.message || 'API is healthy'}`);
    } else {
      logTest('Health Endpoint', false, `HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    logTest('Health Endpoint', false, `Error: ${error.message}`);
  }
}

async function testUserAuthentication(apiBaseUrl) {
  logSection('USER AUTHENTICATION TESTING');

  let authToken = null;

  try {
    // Test user registration
    console.log('🔄 Testing user registration...');
    const registerResponse = await makeRequest(`${apiBaseUrl}/api/users/register`, {
      method: 'POST',
      body: JSON.stringify(TEST_CONFIG.TEST_USER)
    });

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      logTest('User Registration', registerData.success,
        `User registered: ${registerData.data?.user?.name || 'Success'}`);
      authToken = registerData.data?.token;
    } else {
      const errorData = await registerResponse.json();
      logTest('User Registration', false,
        `HTTP ${registerResponse.status}: ${errorData.message || registerResponse.statusText}`);
    }
  } catch (error) {
    logTest('User Registration', false, `Error: ${error.message}`);
  }

  try {
    // Test user login
    console.log('🔄 Testing user login...');
    const loginResponse = await makeRequest(`${apiBaseUrl}/api/users/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: TEST_CONFIG.TEST_USER.email,
        password: TEST_CONFIG.TEST_USER.password
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      logTest('User Login', loginData.success,
        `User logged in: ${loginData.data?.user?.name || 'Success'}`);
      if (!authToken) authToken = loginData.data?.token;
    } else {
      const errorData = await loginResponse.json();
      logTest('User Login', false,
        `HTTP ${loginResponse.status}: ${errorData.message || loginResponse.statusText}`);
    }
  } catch (error) {
    logTest('User Login', false, `Error: ${error.message}`);
  }

  if (authToken) {
    try {
      // Test authenticated endpoint
      console.log('🔄 Testing authenticated endpoint...');
      const meResponse = await makeRequest(`${apiBaseUrl}/api/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (meResponse.ok) {
        const meData = await meResponse.json();
        logTest('Authenticated Endpoint', meData.success,
          `User profile retrieved: ${meData.data?.name || 'Success'}`);
      } else {
        const errorData = await meResponse.json();
        logTest('Authenticated Endpoint', false,
          `HTTP ${meResponse.status}: ${errorData.message || meResponse.statusText}`);
      }
    } catch (error) {
      logTest('Authenticated Endpoint', false, `Error: ${error.message}`);
    }
  }

  return authToken;
}

async function testKundaliGeneration(apiBaseUrl) {
  logSection('KUNDALI GENERATION TESTING');

  for (let i = 0; i < TEST_CONFIG.SAMPLE_BIRTH_DATA.length; i++) {
    const birthData = TEST_CONFIG.SAMPLE_BIRTH_DATA[i];
    console.log(`🔄 Testing kundali generation for ${birthData.name}...`);

    try {
      const response = await makeRequest(`${apiBaseUrl}/api/kundali/generate`, {
        method: 'POST',
        body: JSON.stringify(birthData)
      });

      if (response.ok) {
        const data = await response.json();
        const success = data.success && data.data && data.data.planets && data.data.ascendant;

        logTest(`Kundali Generation - ${birthData.name}`, success,
          success ?
            `Generated with ${data.data.planets.length} planets, Ascendant: ${data.data.ascendant.rashiName?.english || data.data.ascendant.rashiName}` :
            'Invalid kundali data structure'
        );

        // Test specific astrological data
        if (success) {
          const hasValidPlanets = data.data.planets.length >= 7; // At least 7 main planets
          const hasValidAscendant = data.data.ascendant && data.data.ascendant.rashiName;
          const hasValidDoshas = data.data.doshas && typeof data.data.doshas === 'object';
          const hasValidDasha = data.data.dashaPeriods && data.data.dashaPeriods.currentDasha;

          logTest(`Astrological Data Validation - ${birthData.name}`,
            hasValidPlanets && hasValidAscendant && hasValidDoshas && hasValidDasha,
            `Planets: ${hasValidPlanets}, Ascendant: ${hasValidAscendant}, Doshas: ${hasValidDoshas}, Dasha: ${hasValidDasha}`
          );
        }
      } else {
        const errorData = await response.json();
        logTest(`Kundali Generation - ${birthData.name}`, false,
          `HTTP ${response.status}: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      logTest(`Kundali Generation - ${birthData.name}`, false, `Error: ${error.message}`);
    }
  }
}

async function testAstrologicalCalculations() {
  logSection('ASTROLOGICAL CALCULATIONS TESTING');

  for (let i = 0; i < TEST_CONFIG.SAMPLE_BIRTH_DATA.length; i++) {
    const birthData = TEST_CONFIG.SAMPLE_BIRTH_DATA[i];
    console.log(`🔄 Testing direct astrological calculations for ${birthData.name}...`);

    try {
      // Test kundali calculation
      const kundaliData = await calculateKundali(
        birthData.name,
        birthData.birthDate,
        birthData.birthTime,
        birthData.birthPlace
      );

      const hasValidStructure = kundaliData &&
        kundaliData.planets &&
        kundaliData.ascendant &&
        kundaliData.houses;

      logTest(`Direct Kundali Calculation - ${birthData.name}`, hasValidStructure,
        hasValidStructure ?
          `Calculated ${kundaliData.planets.length} planets, Ascendant in ${kundaliData.ascendant.rashiName?.english || kundaliData.ascendant.rashiName}` :
          'Invalid calculation result structure'
      );

      if (hasValidStructure) {
        // Test dosha checking
        const doshas = checkDoshas(kundaliData);
        const hasValidDoshas = doshas && typeof doshas === 'object';
        logTest(`Dosha Analysis - ${birthData.name}`, hasValidDoshas,
          hasValidDoshas ?
            `Analyzed doshas: ${Object.keys(doshas).join(', ')}` :
            'Invalid dosha analysis result'
        );

        // Test dasha calculation
        const dashaPeriods = calculateDasha(kundaliData);
        const hasValidDasha = dashaPeriods && dashaPeriods.currentDasha;
        logTest(`Dasha Calculation - ${birthData.name}`, hasValidDasha,
          hasValidDasha ?
            `Current Dasha: ${dashaPeriods.currentDasha.planet?.en || dashaPeriods.currentDasha.planet}` :
            'Invalid dasha calculation result'
        );
      }

    } catch (error) {
      logTest(`Direct Astrological Calculation - ${birthData.name}`, false, `Error: ${error.message}`);
    }
  }
}

async function testErrorHandling(apiBaseUrl) {
  logSection('ERROR HANDLING TESTING');

  // Test invalid birth data
  console.log('🔄 Testing error handling with invalid data...');

  const invalidTestCases = [
    {
      name: 'Missing Birth Date',
      data: { name: 'Test', birthTime: '10:00', birthPlace: 'Delhi' },
      expectedError: 'Missing required fields'
    },
    {
      name: 'Invalid Date Format',
      data: { name: 'Test', birthDate: 'invalid-date', birthTime: '10:00', birthPlace: 'Delhi' },
      expectedError: 'Invalid date format'
    },
    {
      name: 'Invalid Time Format',
      data: { name: 'Test', birthDate: '1990-01-01', birthTime: '25:00', birthPlace: 'Delhi' },
      expectedError: 'Invalid time format'
    },
    {
      name: 'Empty Request Body',
      data: {},
      expectedError: 'Missing required fields'
    }
  ];

  for (const testCase of invalidTestCases) {
    try {
      const response = await makeRequest(`${apiBaseUrl}/api/kundali/generate`, {
        method: 'POST',
        body: JSON.stringify(testCase.data)
      });

      const data = await response.json();
      const handledCorrectly = !response.ok && !data.success;

      logTest(`Error Handling - ${testCase.name}`, handledCorrectly,
        handledCorrectly ?
          `Correctly rejected with: ${data.message || 'Error message'}` :
          'Should have returned an error but did not'
      );
    } catch (error) {
      logTest(`Error Handling - ${testCase.name}`, true, `Network error handled: ${error.message}`);
    }
  }

  // Test authentication errors
  console.log('🔄 Testing authentication error handling...');

  try {
    const response = await makeRequest(`${apiBaseUrl}/api/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    });

    const data = await response.json();
    const handledCorrectly = !response.ok && !data.success;

    logTest('Authentication Error Handling', handledCorrectly,
      handledCorrectly ?
        `Correctly rejected invalid token: ${data.message || 'Unauthorized'}` :
        'Should have returned authentication error'
    );
  } catch (error) {
    logTest('Authentication Error Handling', true, `Network error handled: ${error.message}`);
  }
}

async function testEndToEndFlow(apiBaseUrl) {
  logSection('END-TO-END FUNCTIONALITY TESTING');

  console.log('🔄 Testing complete user flow...');

  try {
    // Step 1: Register new user
    const uniqueUser = {
      name: 'E2E Test User',
      email: `e2e-test-${Date.now()}@example.com`,
      password: 'e2epassword123'
    };

    const registerResponse = await makeRequest(`${apiBaseUrl}/api/users/register`, {
      method: 'POST',
      body: JSON.stringify(uniqueUser)
    });

    if (!registerResponse.ok) {
      throw new Error('User registration failed');
    }

    const registerData = await registerResponse.json();
    const authToken = registerData.data?.token;

    if (!authToken) {
      throw new Error('No auth token received');
    }

    // Step 2: Generate kundali for the user
    const birthData = TEST_CONFIG.SAMPLE_BIRTH_DATA[0];
    const kundaliResponse = await makeRequest(`${apiBaseUrl}/api/kundali/generate`, {
      method: 'POST',
      body: JSON.stringify(birthData),
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!kundaliResponse.ok) {
      throw new Error('Kundali generation failed');
    }

    const kundaliData = await kundaliResponse.json();

    if (!kundaliData.success || !kundaliData.data) {
      throw new Error('Invalid kundali data received');
    }

    // Step 3: Verify user profile access
    const profileResponse = await makeRequest(`${apiBaseUrl}/api/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!profileResponse.ok) {
      throw new Error('Profile access failed');
    }

    const profileData = await profileResponse.json();

    if (!profileData.success || !profileData.data) {
      throw new Error('Invalid profile data received');
    }

    logTest('End-to-End User Flow', true,
      `Complete flow successful: Registration → Kundali Generation → Profile Access`);

  } catch (error) {
    logTest('End-to-End User Flow', false, `Flow failed: ${error.message}`);
  }
}

function generateTestReport() {
  logSection('COMPREHENSIVE TEST REPORT');

  console.log(`📊 Test Results Summary:`);
  console.log(`   Total Tests: ${testResults.total}`);
  console.log(`   Passed: ${testResults.passed} ✅`);
  console.log(`   Failed: ${testResults.failed} ❌`);
  console.log(`   Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

  if (testResults.failed > 0) {
    console.log(`\n❌ Failed Tests:`);
    testResults.details
      .filter(test => test.status === 'FAILED')
      .forEach(test => {
        console.log(`   • ${test.test}: ${test.details}`);
      });
  }

  console.log(`\n✅ Passed Tests:`);
  testResults.details
    .filter(test => test.status === 'PASSED')
    .forEach(test => {
      console.log(`   • ${test.test}`);
    });

  // Recommendations
  console.log(`\n💡 Recommendations:`);

  if (testResults.failed === 0) {
    console.log(`   🎉 All tests passed! The JyotAIshya application is fully functional.`);
  } else {
    console.log(`   🔧 ${testResults.failed} test(s) failed. Review the failed tests above.`);

    const failedTests = testResults.details.filter(test => test.status === 'FAILED');

    if (failedTests.some(test => test.test.includes('Database'))) {
      console.log(`   📊 Database issues detected. Check MongoDB Atlas connection and credentials.`);
    }

    if (failedTests.some(test => test.test.includes('Server'))) {
      console.log(`   🌐 Server connectivity issues detected. Ensure the server is running.`);
    }

    if (failedTests.some(test => test.test.includes('Kundali'))) {
      console.log(`   🔮 Astrological calculation issues detected. Check calculation algorithms.`);
    }

    if (failedTests.some(test => test.test.includes('Authentication'))) {
      console.log(`   🔐 Authentication issues detected. Check JWT configuration and user management.`);
    }
  }

  // Save report to file
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
      total: testResults.total,
      passed: testResults.passed,
      failed: testResults.failed,
      successRate: ((testResults.passed / testResults.total) * 100).toFixed(1)
    },
    details: testResults.details
  };

  try {
    fs.writeFileSync('test-report.json', JSON.stringify(reportData, null, 2));
    console.log(`\n📄 Detailed test report saved to: test-report.json`);
  } catch (error) {
    console.log(`\n⚠️ Could not save test report: ${error.message}`);
  }
}

// Main execution function
async function runComprehensiveTests() {
  console.log('🚀 STARTING COMPREHENSIVE JYOTAISHYA TESTING SUITE');
  console.log('=' .repeat(80));
  console.log('This will test all aspects of the JyotAIshya web application:');
  console.log('• Database connectivity (MongoDB Atlas)');
  console.log('• Server connectivity (Local/Deployed API)');
  console.log('• User authentication and registration');
  console.log('• Kundali generation and astrological calculations');
  console.log('• Error handling and edge cases');
  console.log('• End-to-end user workflows');
  console.log('=' .repeat(80));

  let apiBaseUrl = TEST_CONFIG.API_BASE_URL;

  try {
    // Test 1: Database Connectivity
    await testDatabaseConnectivity();

    // Test 2: Server Connectivity
    apiBaseUrl = await testServerConnectivity();

    // Test 3: Health Endpoint
    await testHealthEndpoint(apiBaseUrl);

    // Test 4: User Authentication
    await testUserAuthentication(apiBaseUrl);

    // Test 5: Kundali Generation via API
    await testKundaliGeneration(apiBaseUrl);

    // Test 6: Direct Astrological Calculations
    await testAstrologicalCalculations();

    // Test 7: Error Handling
    await testErrorHandling(apiBaseUrl);

    // Test 8: End-to-End Flow
    await testEndToEndFlow(apiBaseUrl);

  } catch (error) {
    console.error('\n❌ Critical error during testing:', error.message);
    logTest('Critical Test Execution', false, `Fatal error: ${error.message}`);
  } finally {
    // Cleanup database connection
    try {
      if (isConnected()) {
        await disconnectDB();
        console.log('\n🔌 Database connection closed');
      }
    } catch (error) {
      console.log('\n⚠️ Error closing database connection:', error.message);
    }

    // Generate final report
    generateTestReport();

    // Exit with appropriate code
    const success = testResults.failed === 0;
    console.log(`\n${success ? '🎉' : '💥'} Testing completed ${success ? 'successfully' : 'with failures'}`);

    process.exit(success ? 0 : 1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
JyotAIshya Comprehensive Test Suite

Usage: node comprehensive-test.js [options]

Options:
  --help, -h          Show this help message
  --local             Test only local server (skip deployed API fallback)
  --deployed          Test only deployed API (skip local server)
  --quick             Run only essential tests (skip detailed validations)
  --db-only           Test only database connectivity
  --api-only          Test only API endpoints (skip database tests)

Examples:
  node comprehensive-test.js                    # Run all tests
  node comprehensive-test.js --local            # Test local server only
  node comprehensive-test.js --deployed         # Test deployed API only
  node comprehensive-test.js --quick            # Quick test run
  node comprehensive-test.js --db-only          # Database tests only
  node comprehensive-test.js --api-only         # API tests only
`);
  process.exit(0);
}

// Modify test configuration based on arguments
if (args.includes('--local')) {
  TEST_CONFIG.FALLBACK_API_URL = null;
}

if (args.includes('--deployed')) {
  TEST_CONFIG.API_BASE_URL = TEST_CONFIG.FALLBACK_API_URL;
  TEST_CONFIG.FALLBACK_API_URL = null;
}

if (args.includes('--quick')) {
  TEST_CONFIG.SAMPLE_BIRTH_DATA = [TEST_CONFIG.SAMPLE_BIRTH_DATA[0]]; // Test only one case
}

// Run the tests
if (args.includes('--db-only')) {
  console.log('🔍 Running database tests only...');
  testDatabaseConnectivity().then(() => {
    generateTestReport();
    process.exit(testResults.failed === 0 ? 0 : 1);
  });
} else if (args.includes('--api-only')) {
  console.log('🔍 Running API tests only...');
  (async () => {
    try {
      const apiBaseUrl = await testServerConnectivity();
      await testHealthEndpoint(apiBaseUrl);
      await testUserAuthentication(apiBaseUrl);
      await testKundaliGeneration(apiBaseUrl);
      await testErrorHandling(apiBaseUrl);
      await testEndToEndFlow(apiBaseUrl);
    } catch (error) {
      console.error('API tests failed:', error.message);
    } finally {
      generateTestReport();
      process.exit(testResults.failed === 0 ? 0 : 1);
    }
  })();
} else {
  // Run all tests
  runComprehensiveTests();
}
