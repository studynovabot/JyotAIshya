#!/usr/bin/env node

/**
 * Test script for serverless API functions
 * This simulates how Vercel will call the functions
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Mock request and response objects
class MockRequest {
  constructor(method = 'POST', body = {}, query = {}) {
    this.method = method;
    this.body = body;
    this.query = query;
    this.headers = {
      'content-type': 'application/json',
      'origin': 'http://localhost:3000'
    };
  }
}

class MockResponse {
  constructor() {
    this.statusCode = 200;
    this.headers = {};
    this.body = null;
  }

  status(code) {
    this.statusCode = code;
    return this;
  }

  setHeader(key, value) {
    this.headers[key] = value;
    return this;
  }

  json(data) {
    this.body = data;
    console.log(`Response ${this.statusCode}:`, JSON.stringify(data, null, 2));
    return this;
  }

  end() {
    console.log(`Response ${this.statusCode}: END`);
    return this;
  }
}

async function testKundaliGenerate() {
  console.log('\n🔮 Testing Kundali Generation API...');
  console.log('=' .repeat(50));

  try {
    // Import the serverless function
    const { default: handler } = await import('./api/kundali/generate.js');

    // Create mock request
    const req = new MockRequest('POST', {
      name: "Test User",
      birthDate: "1990-05-15",
      birthTime: "14:30",
      birthPlace: "New Delhi, India"
    });

    const res = new MockResponse();

    // Call the function
    await handler(req, res);

    console.log('✅ Kundali generation test completed');
    return res.body?.success || false;

  } catch (error) {
    console.error('❌ Kundali generation test failed:', error.message);
    return false;
  }
}

async function testDoshaCheck() {
  console.log('\n🔍 Testing Dosha Check API...');
  console.log('=' .repeat(50));

  try {
    // Import the serverless function
    const { default: handler } = await import('./api/kundali/dosha-check.js');

    // Create mock request
    const req = new MockRequest('POST', {
      name: "Test User",
      birthDate: "1990-05-15",
      birthTime: "14:30",
      birthPlace: "New Delhi, India",
      doshaTypes: ["manglik", "kaalsarp"]
    });

    const res = new MockResponse();

    // Call the function
    await handler(req, res);

    console.log('✅ Dosha check test completed');
    return res.body?.success || false;

  } catch (error) {
    console.error('❌ Dosha check test failed:', error.message);
    return false;
  }
}

async function testDashaCalculation() {
  console.log('\n⏰ Testing Dasha Calculation API...');
  console.log('=' .repeat(50));

  try {
    // Import the serverless function
    const { default: handler } = await import('./api/kundali/dasha.js');

    // Create mock request
    const req = new MockRequest('POST', {
      name: "Test User",
      birthDate: "1990-05-15",
      birthTime: "14:30",
      birthPlace: "New Delhi, India"
    });

    const res = new MockResponse();

    // Call the function
    await handler(req, res);

    console.log('✅ Dasha calculation test completed');
    return res.body?.success || false;

  } catch (error) {
    console.error('❌ Dasha calculation test failed:', error.message);
    return false;
  }
}

async function testHealthCheck() {
  console.log('\n🏥 Testing Health Check API...');
  console.log('=' .repeat(50));

  try {
    // Import the serverless function
    const { default: handler } = await import('./api/health.js');

    // Create mock request
    const req = new MockRequest('GET');
    const res = new MockResponse();

    // Call the function
    await handler(req, res);

    console.log('✅ Health check test completed');
    return res.body?.success || false;

  } catch (error) {
    console.error('❌ Health check test failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Serverless API Tests');
  console.log('=' .repeat(80));

  const results = {
    health: await testHealthCheck(),
    kundali: await testKundaliGenerate(),
    dosha: await testDoshaCheck(),
    dasha: await testDashaCalculation()
  };

  console.log('\n📊 Test Results Summary:');
  console.log('=' .repeat(50));
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASSED' : '❌ FAILED';
    console.log(`${test.padEnd(15)}: ${status}`);
  });

  const allPassed = Object.values(results).every(result => result);
  
  console.log('\n' + '=' .repeat(50));
  console.log(`Overall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  console.log('=' .repeat(50));

  return allPassed;
}

// Run tests
runAllTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});
