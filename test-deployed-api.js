#!/usr/bin/env node

/**
 * Test the deployed API to verify it's working
 */

import fetch from 'node-fetch';

const API_BASE = 'https://jyotaishya-nabtzaeyk-ranveer-singh-rajputs-projects.vercel.app';

async function testDeployedAPI() {
  console.log('🚀 Testing Deployed JyotAIshya API');
  console.log('=' .repeat(50));
  
  // Test 1: Health Check
  try {
    console.log('🔄 Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE}/api/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check:', healthData.success ? 'PASSED' : 'FAILED');
      console.log('   Message:', healthData.message);
    } else {
      console.log('❌ Health check: FAILED');
      console.log('   Status:', healthResponse.status);
    }
  } catch (error) {
    console.log('❌ Health check: ERROR');
    console.log('   Error:', error.message);
  }
  
  // Test 2: Kundali Generation
  try {
    console.log('\n🔄 Testing kundali generation...');
    const kundaliResponse = await fetch(`${API_BASE}/api/kundali/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "API Test User",
        birthDate: "1990-05-15",
        birthTime: "14:30",
        birthPlace: "New Delhi, India"
      })
    });
    
    if (kundaliResponse.ok) {
      const kundaliData = await kundaliResponse.json();
      console.log('✅ Kundali generation:', kundaliData.success ? 'PASSED' : 'FAILED');
      if (kundaliData.success) {
        console.log('   Name:', kundaliData.data.name);
        console.log('   Planets:', kundaliData.data.planets.length);
        console.log('   Ascendant:', kundaliData.data.ascendant.rashiName?.english || kundaliData.data.ascendant.rashiName);
      }
    } else {
      console.log('❌ Kundali generation: FAILED');
      console.log('   Status:', kundaliResponse.status);
    }
  } catch (error) {
    console.log('❌ Kundali generation: ERROR');
    console.log('   Error:', error.message);
  }
  
  console.log('\n🎉 API testing completed!');
}

testDeployedAPI();
