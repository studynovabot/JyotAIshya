import { createServer } from 'http';
import { parse } from 'url';
import fetch from 'node-fetch';

// Import API handlers
const testHandler = (await import('./api/test.js')).default;
const horoscopeHandler = (await import('./api/horoscope.js')).default;
const kundaliSimpleHandler = (await import('./api/kundali-simple.js')).default;
const dailyHoroscopeHandler = (await import('./api/horoscope/daily/[rashi].js')).default;

console.log('🚀 Starting local server for testing...');

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
    } else if (pathname === '/api/kundali-simple') {
      kundaliSimpleHandler(req, res);
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

server.listen(3000, async () => {
  console.log('✅ Server running on http://localhost:3000');
  console.log('\n🧪 Running endpoint tests...');
  
  // Wait a moment for server to be ready
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const tests = [
    {
      name: 'Test Endpoint',
      url: 'http://localhost:3000/api/test',
      method: 'GET'
    },
    {
      name: 'Horoscope with Rashi',
      url: 'http://localhost:3000/api/horoscope?rashi=mesh&type=daily',
      method: 'GET'
    },
    {
      name: 'Daily Horoscope Direct',
      url: 'http://localhost:3000/api/horoscope/daily/mesh',
      method: 'GET'
    },
    {
      name: 'Kundali Generation (Simplified)',
      url: 'http://localhost:3000/api/kundali-simple?action=generate',
      method: 'POST',
      body: {
        name: 'Test User',
        dateOfBirth: '1990-01-01',
        timeOfBirth: '12:00',
        placeOfBirth: 'Delhi'
      }
    },
    {
      name: 'Kundali with Coordinates (Simplified)',
      url: 'http://localhost:3000/api/kundali-simple?action=generate',
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
      name: 'Dosha Analysis (Simplified)',
      url: 'http://localhost:3000/api/kundali-simple?action=dosha',
      method: 'POST',
      body: {
        name: 'Test User 3',
        dateOfBirth: '1990-01-01',
        timeOfBirth: '12:00',
        placeOfBirth: 'Mumbai'
      }
    }
  ];

  for (const test of tests) {
    await runTest(test);
    // Add a small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n🏁 All local endpoint tests completed');
  console.log('\n✨ If all tests passed, the endpoints should work in production too!');
  
  // Keep server running for manual testing
  console.log('\n🔄 Server is still running for manual testing...');
  console.log('Press Ctrl+C to stop the server');
});

async function runTest(test) {
  console.log(`\n🔍 Testing: ${test.name}`);
  console.log(`   URL: ${test.url}`);
  console.log(`   Method: ${test.method}`);
  
  try {
    const options = {
      method: test.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'JyotAIshya-Local-Test/1.0'
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