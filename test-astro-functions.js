import { generateBirthChart } from './server/utils/astroCalculationsNew.js';

const testAstroFunctions = async () => {
  try {
    console.log('Testing astro functions...');
    
    const result = await generateBirthChart(
      "Test User",
      "1990-01-15",
      "10:30",
      "Delhi",
      28.7041,
      77.1025,
      5.5
    );
    
    console.log('Success! Birth chart generated:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Test failed:', error);
    console.error('Stack trace:', error.stack);
  }
};

testAstroFunctions();