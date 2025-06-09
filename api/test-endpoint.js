// Test the kundali/generate endpoint
const handler = require('./kundali/generate.js');

// Mock request and response objects
const req = {
  method: 'POST',
  body: {
    name: 'Test User',
    birthDate: '1990-01-01',
    birthTime: '12:00',
    birthPlace: 'Delhi, India'
  }
};

const res = {
  status: (code) => ({
    json: (data) => {
      console.log('Response Status:', code);
      console.log('Response Data:', data);
    }
  }),
  setHeader: (key, value) => {
    console.log('Setting Header:', key, value);
  }
};

// Test the handler
async function test() {
  try {
    await handler(req, res);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

test();
