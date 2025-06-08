#!/usr/bin/env node

/**
 * Simple test for Kundali API endpoint
 */

const API_BASE = 'https://jyotaishya-nabtzaeyk-ranveer-singh-rajputs-projects.vercel.app';

async function testKundaliGeneration() {
  console.log('🔮 Testing Kundali Generation API...');
  
  const testData = {
    name: "Test User",
    birthDate: "1990-05-15",
    birthTime: "14:30",
    birthPlace: "New Delhi, India"
  };

  try {
    console.log('📤 Sending request to:', `${API_BASE}/api/kundali/generate`);
    console.log('📋 Request data:', testData);

    const response = await fetch(`${API_BASE}/api/kundali/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Kundali generation successful!');
    console.log('📊 Response summary:', {
      success: data.success,
      name: data.data?.name,
      ascendant: data.data?.ascendant?.rashiName?.english,
      planetsCount: data.data?.planets?.length || 0,
      message: data.message
    });

    return true;
  } catch (error) {
    console.error('❌ Kundali generation failed:', error.message);
    return false;
  }
}

// Run the test
testKundaliGeneration()
  .then(success => {
    if (success) {
      console.log('\n🎉 API test passed! Kundali generation is working correctly.');
    } else {
      console.log('\n⚠️ API test failed. Check the logs above.');
    }
  })
  .catch(console.error);
