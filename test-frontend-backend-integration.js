#!/usr/bin/env node

/**
 * Frontend-Backend Integration Test Script
 * Tests the integration between React frontend and Express backend
 */

import fetch from 'node-fetch';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test configuration
const TEST_CONFIG = {
  BACKEND_URL: 'http://localhost:3002',
  FRONTEND_URL: 'http://localhost:5173',
  TIMEOUT: 30000,
  SAMPLE_DATA: {
    name: "Integration Test User",
    birthDate: "1990-05-15",
    birthTime: "14:30",
    birthPlace: "New Delhi, India"
  }
};

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

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

async function testBackendConnectivity() {
  logSection('BACKEND CONNECTIVITY TESTING');
  
  try {
    console.log('🔄 Testing backend server...');
    const response = await makeRequest(TEST_CONFIG.BACKEND_URL);
    
    if (response.ok) {
      const data = await response.json();
      logTest('Backend Server Connectivity', true, 
        `Server running: ${data.message || 'JyotAIshya API'}`);
      return true;
    } else {
      logTest('Backend Server Connectivity', false, 
        `HTTP ${response.status}: ${response.statusText}`);
      return false;
    }
  } catch (error) {
    logTest('Backend Server Connectivity', false, `Error: ${error.message}`);
    return false;
  }
}

async function testBackendAPI() {
  logSection('BACKEND API TESTING');
  
  // Test health endpoint
  try {
    console.log('🔄 Testing health endpoint...');
    const response = await makeRequest(`${TEST_CONFIG.BACKEND_URL}/api/health`);
    
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
  
  // Test kundali generation
  try {
    console.log('🔄 Testing kundali generation...');
    const response = await makeRequest(`${TEST_CONFIG.BACKEND_URL}/api/kundali/generate`, {
      method: 'POST',
      body: JSON.stringify(TEST_CONFIG.SAMPLE_DATA)
    });
    
    if (response.ok) {
      const data = await response.json();
      const success = data.success && data.data && data.data.planets && data.data.ascendant;
      
      logTest('Kundali Generation API', success, 
        success ? 
          `Generated with ${data.data.planets.length} planets, Ascendant: ${data.data.ascendant.rashiName?.english || data.data.ascendant.rashiName}` :
          'Invalid kundali data structure'
      );
    } else {
      const errorData = await response.json();
      logTest('Kundali Generation API', false, 
        `HTTP ${response.status}: ${errorData.message || response.statusText}`);
    }
  } catch (error) {
    logTest('Kundali Generation API', false, `Error: ${error.message}`);
  }
}

async function testCORSConfiguration() {
  logSection('CORS CONFIGURATION TESTING');
  
  try {
    console.log('🔄 Testing CORS headers...');
    const response = await makeRequest(`${TEST_CONFIG.BACKEND_URL}/api/health`, {
      method: 'OPTIONS',
      headers: {
        'Origin': TEST_CONFIG.FRONTEND_URL,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    const corsHeaders = {
      'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
      'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
      'access-control-allow-headers': response.headers.get('access-control-allow-headers')
    };
    
    const hasCORS = corsHeaders['access-control-allow-origin'] !== null;
    
    logTest('CORS Headers Present', hasCORS, 
      hasCORS ? 
        `Origin: ${corsHeaders['access-control-allow-origin']}, Methods: ${corsHeaders['access-control-allow-methods']}` :
        'No CORS headers found'
    );
    
  } catch (error) {
    logTest('CORS Configuration', false, `Error: ${error.message}`);
  }
}

async function testFrontendConnectivity() {
  logSection('FRONTEND CONNECTIVITY TESTING');
  
  try {
    console.log('🔄 Testing frontend server...');
    const response = await makeRequest(TEST_CONFIG.FRONTEND_URL);
    
    if (response.ok) {
      logTest('Frontend Server Connectivity', true, 
        `Frontend accessible at ${TEST_CONFIG.FRONTEND_URL}`);
      return true;
    } else {
      logTest('Frontend Server Connectivity', false, 
        `HTTP ${response.status}: ${response.statusText}`);
      return false;
    }
  } catch (error) {
    logTest('Frontend Server Connectivity', false, `Error: ${error.message}`);
    return false;
  }
}

function generateReport() {
  logSection('INTEGRATION TEST REPORT');
  
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
  
  console.log(`\n💡 Integration Status:`);
  
  if (testResults.failed === 0) {
    console.log(`   🎉 All integration tests passed! Frontend and backend are properly connected.`);
  } else {
    console.log(`   🔧 ${testResults.failed} test(s) failed. Check the issues above.`);
    
    const failedTests = testResults.details.filter(test => test.status === 'FAILED');
    
    if (failedTests.some(test => test.test.includes('Backend'))) {
      console.log(`   🌐 Backend issues detected. Ensure the server is running on port 3000.`);
    }
    
    if (failedTests.some(test => test.test.includes('Frontend'))) {
      console.log(`   🖥️ Frontend issues detected. Ensure the client is running on port 5173.`);
    }
    
    if (failedTests.some(test => test.test.includes('CORS'))) {
      console.log(`   🔗 CORS issues detected. Check server CORS configuration.`);
    }
  }
}

// Main execution
async function runIntegrationTests() {
  console.log('🚀 STARTING FRONTEND-BACKEND INTEGRATION TESTS');
  console.log('=' .repeat(80));
  console.log('This will test the integration between React frontend and Express backend');
  console.log('=' .repeat(80));
  
  try {
    // Test backend connectivity and API
    const backendRunning = await testBackendConnectivity();
    if (backendRunning) {
      await testBackendAPI();
      await testCORSConfiguration();
    }
    
    // Test frontend connectivity
    await testFrontendConnectivity();
    
  } catch (error) {
    console.error('\n❌ Critical error during testing:', error.message);
    logTest('Critical Test Execution', false, `Fatal error: ${error.message}`);
  } finally {
    // Generate final report
    generateReport();
    
    // Exit with appropriate code
    const success = testResults.failed === 0;
    console.log(`\n${success ? '🎉' : '💥'} Integration testing completed ${success ? 'successfully' : 'with failures'}`);
    
    process.exit(success ? 0 : 1);
  }
}

// Run the tests
runIntegrationTests();
