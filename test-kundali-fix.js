import fetch from 'node-fetch';

const testKundaliAPI = async () => {
  try {
    console.log('Testing Kundali API...');
    
    const testData = {
      name: "Test User",
      dateOfBirth: "1990-01-15",
      timeOfBirth: "10:30",
      placeOfBirth: "Delhi",
      latitude: 28.7041,
      longitude: 77.1025,
      timezone: 5.5
    };

    const response = await fetch('http://localhost:3000/api/kundali?action=generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());

    if (response.ok) {
      const data = await response.json();
      console.log('Success! Response data:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.error('Error response:', errorText);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testKundaliAPI();