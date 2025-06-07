// Minimal server for testing
const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Route handling
  if (req.url === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({
      message: "JyotAIshya API is running",
      port: PORT,
      timestamp: new Date().toISOString()
    }));
  } else if (req.url === '/api/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: "OK",
      message: "Server is healthy"
    }));
  } else if (req.url === '/api/ai/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: "OK",
      message: "AI service is healthy"
    }));
  } else if (req.url === '/api/horoscope/daily/mesh') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: {
        rashi: { id: 'mesh', name: 'Mesh (मेष)', english: 'Aries' },
        date: new Date().toISOString().split('T')[0],
        prediction: {
          hindi: 'आज आपका दिन शुभ रहेगा।',
          english: 'Today will be a good day for you.'
        },
        luckyColor: 'Red',
        luckyNumber: 7,
        advice: 'Stay positive and focused on your goals.'
      }
    }));
  } else if (req.url === '/api/kundali/generate' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          data: {
            id: 'test-123',
            name: data.name,
            birthDate: data.birthDate,
            birthTime: data.birthTime,
            birthPlace: data.birthPlace,
            kundali: {
              houses: Array.from({length: 12}, (_, i) => ({
                house: i + 1,
                sign: 'Test Sign',
                planets: []
              }))
            }
          }
        }));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Minimal server running on port ${PORT}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
