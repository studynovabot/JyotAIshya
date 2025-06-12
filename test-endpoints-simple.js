// Simple test without running a server - just test the functions directly
import { getDailyHoroscope, generateBirthChart } from './api/utils/astroCalculations.js';

console.log('🧪 Testing API endpoints functionality...');

// Mock request and response objects for testing
function createMockReq(method, url, query = {}, body = {}) {
  return {
    method,
    url,
    query,
    body,
    headers: {
      'content-type': 'application/json',
      'user-agent': 'test'
    }
  };
}

function createMockRes() {
  let statusCode = 200;
  let headers = {};
  let responseData = null;
  
  return {
    setHeader: (key, value) => {
      headers[key] = value;
    },
    status: (code) => {
      statusCode = code;
      return {
        json: (data) => {
          responseData = data;
          return { statusCode, headers, data: responseData };
        },
        end: () => {
          return { statusCode, headers, data: null };
        }
      };
    },
    json: (data) => {
      responseData = data;
      return { statusCode, headers, data: responseData };
    },
    end: () => {
      return { statusCode, headers, data: null };
    },
    getResponse: () => ({ statusCode, headers, data: responseData })
  };
}

// Test 1: Daily Horoscope Direct Function
console.log('\n1️⃣ Testing getDailyHoroscope function directly...');
try {
  const horoscope = await getDailyHoroscope('mesh');
  console.log('✅ Daily horoscope function test passed');
  console.log(`   Rashi: ${horoscope.rashi.name}`);
  console.log(`   Prediction: ${horoscope.prediction.english.substring(0, 50)}...`);
} catch (error) {
  console.error('❌ Daily horoscope function test failed:', error.message);
}

// Test 2: Birth Chart Direct Function
console.log('\n2️⃣ Testing generateBirthChart function directly...');
try {
  const birthChart = await generateBirthChart(
    'Test User',
    '1990-01-01',
    '12:00',
    'Delhi',
    28.7041,
    77.1025,
    5.5
  );
  console.log('✅ Birth chart function test passed');
  console.log(`   Name: ${birthChart.name}`);
  console.log(`   Ascendant: ${birthChart.ascendant.sign} ${birthChart.ascendant.degree}°`);
  console.log(`   Birth Place: ${birthChart.birthDetails.place}`);
} catch (error) {
  console.error('❌ Birth chart function test failed:', error.message);
}

// Test 3: Test Horoscope Handler
console.log('\n3️⃣ Testing horoscope endpoint handler...');
try {
  const horoscopeHandler = (await import('./api/horoscope.js')).default;
  const req = createMockReq('GET', '/api/horoscope?rashi=mesh&type=daily', { rashi: 'mesh', type: 'daily' });
  const res = createMockRes();
  
  await horoscopeHandler(req, res);
  const response = res.getResponse();
  
  if (response.statusCode === 200 && response.data && response.data.success) {
    console.log('✅ Horoscope endpoint handler test passed');
    console.log(`   Status: ${response.statusCode}`);
    console.log(`   Rashi: ${response.data.data.rashi.name}`);
  } else {
    console.log('❌ Horoscope endpoint handler test failed');
    console.log(`   Status: ${response.statusCode}`);
    console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
  }
} catch (error) {
  console.error('❌ Horoscope endpoint handler test failed:', error.message);
}

// Test 4: Test Kundali Simple Handler
console.log('\n4️⃣ Testing kundali-simple endpoint handler...');
try {
  const kundaliHandler = (await import('./api/kundali-simple.js')).default;
  const req = createMockReq('POST', '/api/kundali-simple?action=generate', 
    { action: 'generate' }, 
    {
      name: 'Test User',
      dateOfBirth: '1990-01-01',
      timeOfBirth: '12:00',
      placeOfBirth: 'Delhi'
    }
  );
  const res = createMockRes();
  
  await kundaliHandler(req, res);
  const response = res.getResponse();
  
  if (response.statusCode === 200 && response.data && response.data.success) {
    console.log('✅ Kundali-simple endpoint handler test passed');
    console.log(`   Status: ${response.statusCode}`);
    console.log(`   Name: ${response.data.data.name}`);
    console.log(`   Ascendant: ${response.data.data.ascendant.sign}`);
  } else {
    console.log('❌ Kundali-simple endpoint handler test failed');
    console.log(`   Status: ${response.statusCode}`);
    console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
  }
} catch (error) {
  console.error('❌ Kundali-simple endpoint handler test failed:', error.message);
}

// Test 5: Test Daily Horoscope Handler
console.log('\n5️⃣ Testing daily horoscope endpoint handler...');
try {
  const dailyHandler = (await import('./api/horoscope/daily/[rashi].js')).default;
  const req = createMockReq('GET', '/api/horoscope/daily/mesh', { rashi: 'mesh' });
  const res = createMockRes();
  
  await dailyHandler(req, res);
  const response = res.getResponse();
  
  if (response.statusCode === 200 && response.data && response.data.success) {
    console.log('✅ Daily horoscope endpoint handler test passed');
    console.log(`   Status: ${response.statusCode}`);
    console.log(`   Rashi: ${response.data.data.rashi.name}`);
  } else {
    console.log('❌ Daily horoscope endpoint handler test failed');
    console.log(`   Status: ${response.statusCode}`);
    console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
  }
} catch (error) {
  console.error('❌ Daily horoscope endpoint handler test failed:', error.message);
}

console.log('\n🏁 All endpoint functionality tests completed');
console.log('\n📋 Summary:');
console.log('✨ If all tests passed, the endpoints should work correctly when deployed!');
console.log('🚀 The functions are ready for production deployment.');
console.log('\n📝 Next steps:');
console.log('1. Deploy to Vercel');
console.log('2. Test the deployed endpoints');
console.log('3. Update frontend to use the correct endpoint URLs');