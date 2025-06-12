import fetch from 'node-fetch';

const BASE_URL = 'https://jyotaishya.vercel.app'; // Your deployed URL

console.log('🧪 Testing NEW API endpoints...');

const tests = [
  {
    name: 'Test Endpoint (New)',
    url: `${BASE_URL}/api/test`,
    method: 'GET'
  },
  {
    name: 'Horoscope with Rashi (Updated)',
    url: `${BASE_URL}/api/horoscope?rashi=mesh&type=daily`,
    method: 'GET'
  },
  {
    name: 'Daily Horoscope Direct (New)',
    url: `${BASE_URL}/api/horoscope/daily/mesh`,
    method: 'GET'
  },
  {
    name: 'Kundali Simple Generation (New)',
    url: `${BASE_URL}/api/kundali-simple?action=generate`,
    method: 'POST',
    body: {
      name: 'Test User',
      dateOfBirth: '1990-01-01',
      timeOfBirth: '12:00',
      placeOfBirth: 'Delhi'
    }
  },
  {
    name: 'Kundali Simple with Coordinates (New)',
    url: `${BASE_URL}/api/kundali-simple?action=generate`,
    method: 'POST',
    body: {
      name: 'Test User 2',
      dateOfBirth: '1990-01-01',
      timeOfBirth: '12:00',
      latitude: 28.7041,
      longitude: 77.1025,
      timezone: 5.5
    }
  },
  {
    name: 'Dosha Analysis (New)',
    url: `${BASE_URL}/api/kundali-simple?action=dosha`,
    method: 'POST',
    body: {
      name: 'Test User 3',
      dateOfBirth: '1990-01-01',
      timeOfBirth: '12:00',
      placeOfBirth: 'Mumbai'
    }
  }
];

async function runTest(test) {
  console.log(`\n🔍 Testing: ${test.name}`);
  console.log(`   URL: ${test.url}`);
  console.log(`   Method: ${test.method}`);
  
  try {
    const options = {
      method: test.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'JyotAIshya-Test/1.0'
      }
    };
    
    if (test.body) {
      options.body = JSON.stringify(test.body);
      console.log(`   Body: ${JSON.stringify(test.body, null, 2)}`);
    }
    
    const startTime = Date.now();
    const response = await fetch(test.url, options);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Response Time: ${responseTime}ms`);
    
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.log(`   Response (first 100 chars): ${text.substring(0, 100)}...`);
      
      if (response.status === 404) {
        console.log(`   ❌ ENDPOINT NOT FOUND - May not be deployed yet`);
      } else if (response.status >= 500) {
        console.log(`   ❌ SERVER ERROR - Check deployment logs`);
      } else {
        console.log(`   ❌ UNEXPECTED RESPONSE FORMAT`);
      }
      return;
    }
    
    if (response.ok) {
      console.log(`   ✅ SUCCESS`);
      if (data.data) {
        if (data.data.rashi) {
          console.log(`   📊 Rashi: ${data.data.rashi.name}`);
        }
        if (data.data.name) {
          console.log(`   👤 Name: ${data.data.name}`);
        }
        if (data.data.ascendant) {
          console.log(`   🌟 Ascendant: ${data.data.ascendant.sign} ${data.data.ascendant.degree}°`);
        }
        if (data.data.mangalDosha) {
          console.log(`   🔥 Mangal Dosha: ${data.data.mangalDosha.present ? 'Present' : 'Not Present'}`);
        }
      }
    } else {
      console.log(`   ❌ FAILED`);
      console.log(`   Error: ${data.message || 'Unknown error'}`);
      if (data.error && typeof data.error === 'object') {
        console.log(`   Details: ${data.error.message}`);
      }
    }
  } catch (error) {
    console.log(`   ❌ NETWORK ERROR`);
    console.log(`   Error: ${error.message}`);
  }
}

// Run all tests
for (const test of tests) {
  await runTest(test);
  // Add a small delay between tests
  await new Promise(resolve => setTimeout(resolve, 1000));
}

console.log('\n🏁 All NEW endpoint tests completed');
console.log('\n📋 Analysis:');
console.log('✅ If you see SUCCESS responses, the endpoints are working correctly');
console.log('❌ If you see 404 errors, the new files need to be deployed to Vercel');
console.log('❌ If you see 500 errors, there may be import or runtime issues in serverless environment');
console.log('❌ If you see HTML responses, Vercel is returning error pages instead of JSON');

console.log('\n🚀 Deployment Status:');
console.log('📁 Files created locally:');
console.log('   ✅ /api/test.js');
console.log('   ✅ /api/horoscope.js (updated)');
console.log('   ✅ /api/horoscope/daily/[rashi].js');
console.log('   ✅ /api/kundali-simple.js');
console.log('   ✅ /api/utils/astroCalculations.js');
console.log('   ✅ vercel.json (updated)');

console.log('\n📝 Next Steps:');
console.log('1. Commit and push all changes to Git');
console.log('2. Redeploy to Vercel (automatic if connected to Git)');
console.log('3. Wait for deployment to complete');
console.log('4. Run this test again to verify deployment');