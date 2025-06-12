import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000'; // Change this to your deployed URL for testing

console.log('🧪 Testing all API endpoints...');

// Test 1: Test endpoint
console.log('\n1️⃣ Testing /api/test...');
try {
  const response = await fetch(`${BASE_URL}/api/test`);
  const data = await response.json();
  if (response.ok) {
    console.log('✅ Test endpoint working');
  } else {
    console.log('❌ Test endpoint failed:', data);
  }
} catch (error) {
  console.error('❌ Test endpoint error:', error.message);
}

// Test 2: Horoscope endpoint with rashi
console.log('\n2️⃣ Testing /api/horoscope?rashi=mesh...');
try {
  const response = await fetch(`${BASE_URL}/api/horoscope?rashi=mesh&type=daily`);
  const data = await response.json();
  if (response.ok) {
    console.log('✅ Horoscope endpoint working');
    console.log('Horoscope data:', data.data?.rashi?.name);
  } else {
    console.log('❌ Horoscope endpoint failed:', data);
  }
} catch (error) {
  console.error('❌ Horoscope endpoint error:', error.message);
}

// Test 3: Daily horoscope specific endpoint
console.log('\n3️⃣ Testing /api/horoscope/daily/mesh...');
try {
  const response = await fetch(`${BASE_URL}/api/horoscope/daily/mesh`);
  const data = await response.json();
  if (response.ok) {
    console.log('✅ Daily horoscope specific endpoint working');
    console.log('Horoscope data:', data.data?.rashi?.name);
  } else {
    console.log('❌ Daily horoscope specific endpoint failed:', data);
  }
} catch (error) {
  console.error('❌ Daily horoscope specific endpoint error:', error.message);
}

// Test 4: Kundali generation
console.log('\n4️⃣ Testing /api/kundali?action=generate...');
try {
  const response = await fetch(`${BASE_URL}/api/kundali?action=generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Test User',
      dateOfBirth: '1990-01-01',
      timeOfBirth: '12:00',
      placeOfBirth: 'Delhi'
    })
  });
  const data = await response.json();
  if (response.ok) {
    console.log('✅ Kundali generation working');
    console.log('Kundali data keys:', Object.keys(data.data || {}));
  } else {
    console.log('❌ Kundali generation failed:', data);
  }
} catch (error) {
  console.error('❌ Kundali generation error:', error.message);
}

// Test 5: Kundali with coordinates
console.log('\n5️⃣ Testing /api/kundali?action=generate with coordinates...');
try {
  const response = await fetch(`${BASE_URL}/api/kundali?action=generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Test User 2',
      dateOfBirth: '1990-01-01',
      timeOfBirth: '12:00',
      latitude: 28.7041,
      longitude: 77.1025,
      timezone: 5.5
    })
  });
  const data = await response.json();
  if (response.ok) {
    console.log('✅ Kundali generation with coordinates working');
    console.log('Kundali data keys:', Object.keys(data.data || {}));
  } else {
    console.log('❌ Kundali generation with coordinates failed:', data);
  }
} catch (error) {
  console.error('❌ Kundali generation with coordinates error:', error.message);
}

console.log('\n🏁 All tests completed');

// If running locally, start a simple server for testing
if (process.argv.includes('--local')) {
  console.log('\n🚀 Starting local server for testing...');
  
  // Import and start the server
  const { createServer } = await import('http');
  const { parse } = await import('url');
  
  // Import API handlers
  const testHandler = (await import('./api/test.js')).default;
  const horoscopeHandler = (await import('./api/horoscope.js')).default;
  const kundaliHandler = (await import('./api/kundali.js')).default;
  const dailyHoroscopeHandler = (await import('./api/horoscope/daily/[rashi].js')).default;
  
  const server = createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;
    
    // Parse request body for POST requests
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          req.body = JSON.parse(body);
        } catch (e) {
          req.body = {};
        }
        handleRequest();
      });
    } else {
      req.body = {};
      handleRequest();
    }
    
    function handleRequest() {
      req.query = query;
      
      if (pathname === '/api/test') {
        testHandler(req, res);
      } else if (pathname === '/api/horoscope') {
        horoscopeHandler(req, res);
      } else if (pathname === '/api/kundali') {
        kundaliHandler(req, res);
      } else if (pathname.startsWith('/api/horoscope/daily/')) {
        const rashi = pathname.split('/').pop();
        req.query.rashi = rashi;
        dailyHoroscopeHandler(req, res);
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
      }
    }
  });
  
  server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
    console.log('Run the tests again to verify endpoints');
  });
}