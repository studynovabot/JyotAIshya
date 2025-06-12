import fetch from 'node-fetch';

const BASE_URL = 'https://jyotaishya.vercel.app'; // Your deployed URL

console.log('🧪 Testing deployed API endpoints...');

const tests = [
  {
    name: 'Test Endpoint',
    url: `${BASE_URL}/api/test`,
    method: 'GET'
  },
  {
    name: 'Horoscope with Rashi',
    url: `${BASE_URL}/api/horoscope?rashi=mesh&type=daily`,
    method: 'GET'
  },
  {
    name: 'Daily Horoscope Direct',
    url: `${BASE_URL}/api/horoscope/daily/mesh`,
    method: 'GET'
  },
  {
    name: 'Kundali Generation',
    url: `${BASE_URL}/api/kundali?action=generate`,
    method: 'POST',
    body: {
      name: 'Test User',
      dateOfBirth: '1990-01-01',
      timeOfBirth: '12:00',
      placeOfBirth: 'Delhi'
    }
  },
  {
    name: 'Kundali with Coordinates',
    url: `${BASE_URL}/api/kundali?action=generate`,
    method: 'POST',
    body: {
      name: 'Test User 2',
      dateOfBirth: '1990-01-01',
      timeOfBirth: '12:00',
      latitude: 28.7041,
      longitude: 77.1025,
      timezone: 5.5
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
    
    const data = await response.json();
    
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

console.log('\n🏁 All deployment tests completed');
console.log('\n📋 Summary:');
console.log('If you see 404 errors, the serverless functions may not be deployed correctly.');
console.log('If you see 500 errors, check the function logs in Vercel dashboard.');
console.log('If you see CORS errors, the headers configuration may need adjustment.');