#!/usr/bin/env node

/**
 * Test script to verify JyotAIshya deployment
 * Tests both frontend and backend endpoints
 */

const BASE_URL = 'https://jyotaishya-e6a77rzon-ranveer-singh-rajputs-projects.vercel.app';

// Test endpoints
const endpoints = [
  { name: 'Frontend Root', url: `${BASE_URL}/`, method: 'GET', expectHtml: true },
  { name: 'API Root', url: `${BASE_URL}/api/`, method: 'GET' },
  { name: 'Health Check', url: `${BASE_URL}/api/health`, method: 'GET' },
  { name: 'Astro Coordinates', url: `${BASE_URL}/api/astro/coordinates?place=Delhi`, method: 'GET' },
  { name: 'Daily Horoscope', url: `${BASE_URL}/api/horoscope/daily?rashi=mesh`, method: 'GET' }
];

// POST endpoints with sample data
const postEndpoints = [
  {
    name: 'Kundali Generate',
    url: `${BASE_URL}/api/kundali/generate`,
    method: 'POST',
    data: {
      name: "Test User",
      dateOfBirth: "1990-01-15",
      timeOfBirth: "10:30",
      placeOfBirth: "Delhi",
      latitude: 28.6139,
      longitude: 77.2090
    }
  },
  {
    name: 'Astro Calculate',
    url: `${BASE_URL}/api/astro/calculate`,
    method: 'POST',
    data: {
      dateOfBirth: "1990-01-15",
      timeOfBirth: "10:30",
      latitude: 28.6139,
      longitude: 77.2090
    }
  }
];

async function testEndpoint(endpoint) {
  try {
    console.log(`\n🧪 Testing: ${endpoint.name}`);
    console.log(`   URL: ${endpoint.url}`);
    
    const options = {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'JyotAIshya-Test/1.0'
      }
    };

    if (endpoint.data) {
      options.body = JSON.stringify(endpoint.data);
    }

    const response = await fetch(endpoint.url, options);
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      if (endpoint.expectHtml) {
        const text = await response.text();
        const isHtml = text.includes('<html') || text.includes('<!DOCTYPE');
        console.log(`   ✅ SUCCESS - HTML content: ${isHtml ? 'Yes' : 'No'}`);
        if (isHtml) {
          console.log(`   📄 Title: ${text.match(/<title>(.*?)<\/title>/)?.[1] || 'Not found'}`);
        }
      } else {
        const data = await response.json();
        console.log(`   ✅ SUCCESS - Response:`, JSON.stringify(data, null, 2).substring(0, 200) + '...');
      }
      return true;
    } else {
      const errorText = await response.text();
      console.log(`   ❌ FAILED - Error: ${errorText.substring(0, 100)}...`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ ERROR - ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🚀 JyotAIshya Deployment Test Suite');
  console.log('=====================================');
  console.log(`Base URL: ${BASE_URL}`);
  
  let passed = 0;
  let total = 0;

  // Test GET endpoints
  for (const endpoint of endpoints) {
    total++;
    if (await testEndpoint(endpoint)) {
      passed++;
    }
  }

  // Test POST endpoints
  for (const endpoint of postEndpoints) {
    total++;
    if (await testEndpoint(endpoint)) {
      passed++;
    }
  }

  console.log('\n📊 Test Results');
  console.log('================');
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  console.log(`📈 Success Rate: ${Math.round((passed / total) * 100)}%`);

  if (passed === total) {
    console.log('\n🎉 All tests passed! Deployment is working correctly.');
    console.log('\n🔗 Frontend URL: ' + BASE_URL);
    console.log('🔗 API Health: ' + BASE_URL + '/api/health');
    console.log('🔗 Birth Chart: ' + BASE_URL + '/api/kundali/generate');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the deployment.');
  }
}

// Run the tests
runTests().catch(console.error);
