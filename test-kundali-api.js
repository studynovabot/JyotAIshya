const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testKundaliAPI() {
  try {
    console.log('🔮 Testing Kundali API...');
    
    const testData = {
      name: "Test User",
      birthDate: "1990-01-15",
      birthTime: "10:30",
      birthPlace: "Delhi"
    };
    
    console.log('📤 Sending request with data:', testData);
    
    const response = await fetch('https://jyotaishya.vercel.app/api/kundali/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📄 Raw response:', responseText);
    
    try {
      const responseData = JSON.parse(responseText);
      console.log('✅ Parsed response:', JSON.stringify(responseData, null, 2));
      
      if (responseData.success) {
        console.log('🎉 API call successful!');
        console.log('📊 Planets count:', responseData.data?.planets?.length || 0);
        console.log('🏠 Houses count:', responseData.data?.houses?.length || 0);
        console.log('🌅 Ascendant:', responseData.data?.ascendant?.rashiName?.english || 'Unknown');
      } else {
        console.log('❌ API call failed:', responseData.message);
        console.log('🔍 Error details:', responseData.error);
      }
    } catch (parseError) {
      console.log('❌ Failed to parse JSON response:', parseError.message);
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

// Test the health endpoint first
async function testHealthAPI() {
  try {
    console.log('🏥 Testing Health API...');
    const response = await fetch('https://jyotaishya.vercel.app/api/health');
    const data = await response.json();
    console.log('✅ Health check:', data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
}

async function runTests() {
  await testHealthAPI();
  console.log('\n' + '='.repeat(50) + '\n');
  await testKundaliAPI();
}

runTests();
