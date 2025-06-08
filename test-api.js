#!/usr/bin/env node

/**
 * Test script for JyotAIshya API endpoints
 */

const API_BASE = 'https://jyotaishya-nabtzaeyk-ranveer-singh-rajputs-projects.vercel.app';

async function testRootApiEndpoint() {
  console.log('🏠 Testing Root API Endpoint...');
  try {
    const response = await fetch(`${API_BASE}/api`);
    console.log('Response status:', response.status);

    const text = await response.text();
    console.log('Raw response:', text.substring(0, 200) + '...');

    if (response.status === 200) {
      const data = JSON.parse(text);
      console.log('✅ Root API endpoint working:', data.message);
      return true;
    } else {
      console.log('❌ Root API endpoint failed with status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Root API endpoint failed:', error.message);
    return false;
  }
}

async function testHealthEndpoint() {
  console.log('🏥 Testing Health Endpoint...');
  try {
    const response = await fetch(`${API_BASE}/api/health`);
    console.log('Response status:', response.status);

    const text = await response.text();
    console.log('Raw response:', text.substring(0, 200) + '...');

    if (response.status === 200) {
      const data = JSON.parse(text);
      console.log('✅ Health endpoint working:', data.message);
      return true;
    } else {
      console.log('❌ Health endpoint failed with status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Health endpoint failed:', error.message);
    return false;
  }
}

async function testKundaliGeneration() {
  console.log('🔮 Testing Kundali Generation...');
  try {
    const testData = {
      name: "Test User",
      birthDate: "1990-05-15",
      birthTime: "14:30",
      birthPlace: "New Delhi, India"
    };

    const response = await fetch(`${API_BASE}/api/kundali/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Kundali generation working:', data.success);
    console.log('📊 Generated data:', {
      name: data.data?.name,
      ascendant: data.data?.ascendant?.rashiName?.english,
      planetsCount: data.data?.planets?.length || 0
    });
    return true;
  } catch (error) {
    console.error('❌ Kundali generation failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests...\n');

  const rootOk = await testRootApiEndpoint();
  console.log('');

  const healthOk = await testHealthEndpoint();
  console.log('');

  const kundaliOk = await testKundaliGeneration();
  console.log('');

  console.log('📋 Test Results:');
  console.log(`Root API Endpoint: ${rootOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Health Endpoint: ${healthOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Kundali Generation: ${kundaliOk ? '✅ PASS' : '❌ FAIL'}`);

  if (rootOk && healthOk && kundaliOk) {
    console.log('\n🎉 All tests passed! API is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the logs above.');
  }
}

// Run the tests
runTests().catch(console.error);
