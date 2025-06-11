const https = require('https');
const http = require('http');

// Test data for birth chart generation
const testData = {
  name: "Test User",
  dateOfBirth: "1990-01-01",
  timeOfBirth: "12:00",
  placeOfBirth: "Delhi"
};

// Function to make an HTTP request
function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    // Choose http or https based on the protocol
    const client = options.protocol === 'https:' ? https : http;
    
    console.log(`Making ${options.method} request to ${options.protocol}//${options.hostname}${options.path}`);
    
    const req = client.request(options, (res) => {
      let responseData = '';
      
      // Log response status
      console.log(`Status Code: ${res.statusCode}`);
      console.log(`Headers: ${JSON.stringify(res.headers)}`);
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log('Response received');
        try {
          // Try to parse as JSON
          const parsedData = JSON.parse(responseData);
          resolve(parsedData);
        } catch (e) {
          // If not JSON, return as string
          console.log('Response is not JSON');
          resolve(responseData);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`Request error: ${error.message}`);
      reject(error);
    });
    
    // Write data to request body if provided
    if (data) {
      const stringData = JSON.stringify(data);
      console.log(`Request body: ${stringData}`);
      req.write(stringData);
    }
    
    req.end();
  });
}

// Test the local API endpoint
async function testLocalApi() {
  try {
    console.log('Testing local API endpoint...');
    
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: '/api/kundali?action=generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      protocol: 'http:'
    };
    
    const response = await makeRequest(options, testData);
    console.log('Local API Response:');
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('Local API test failed:', error);
  }
}

// Test the deployed API endpoint
async function testDeployedApi() {
  try {
    console.log('Testing deployed API endpoint...');
    
    const options = {
      hostname: 'jyotaishya.vercel.app',
      path: '/api/kundali?action=generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      protocol: 'https:'
    };
    
    const response = await makeRequest(options, testData);
    console.log('Deployed API Response:');
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('Deployed API test failed:', error);
  }
}

// Run the tests
async function runTests() {
  // Uncomment to test local API
  // await testLocalApi();
  
  // Test deployed API
  await testDeployedApi();
}

runTests();