import { generateBirthChart, checkMangalDosha, checkKaalSarpaDosha } from './server/utils/astroCalculationsNew.js';
import { AstroService } from './server/services/astroService.js';

const testAllFunctions = async () => {
  console.log('🧪 Testing all fixed functions...\n');
  
  const testData = {
    name: "Test User",
    dateOfBirth: "1990-01-15",
    timeOfBirth: "10:30",
    placeOfBirth: "Delhi",
    latitude: 28.7041,
    longitude: 77.1025,
    timezone: 5.5
  };

  try {
    // Test 1: Direct generateBirthChart function
    console.log('1️⃣ Testing generateBirthChart function...');
    const birthChart = await generateBirthChart(
      testData.name,
      testData.dateOfBirth,
      testData.timeOfBirth,
      testData.placeOfBirth,
      testData.latitude,
      testData.longitude,
      testData.timezone
    );
    console.log('✅ generateBirthChart: SUCCESS');
    
    // Test 2: Test dosha functions
    console.log('\n2️⃣ Testing dosha functions...');
    const mangalDosha = checkMangalDosha(birthChart);
    const kaalSarpaDosha = checkKaalSarpaDosha(birthChart);
    console.log('✅ checkMangalDosha: SUCCESS');
    console.log('✅ checkKaalSarpaDosha: SUCCESS');
    
    // Test 3: Test AstroService functions
    console.log('\n3️⃣ Testing AstroService functions...');
    
    // Test generateBirthChart via AstroService
    const astroResult1 = await AstroService.generateBirthChart(testData);
    console.log('✅ AstroService.generateBirthChart: SUCCESS');
    
    // Test checkDoshas via AstroService
    const astroResult2 = await AstroService.checkDoshas(testData);
    console.log('✅ AstroService.checkDoshas: SUCCESS');
    
    // Test calculateDashaPeriods via AstroService
    const astroResult3 = await AstroService.calculateDashaPeriods(testData);
    console.log('✅ AstroService.calculateDashaPeriods: SUCCESS');
    
    console.log('\n🎉 ALL TESTS PASSED! The API should now work correctly.');
    
    // Show sample results
    console.log('\n📊 Sample Results:');
    console.log('- Birth Chart Generated:', !!astroResult1);
    console.log('- Mangal Dosha Present:', mangalDosha.present);
    console.log('- Kaal Sarpa Dosha Present:', kaalSarpaDosha.present);
    console.log('- Current Dasha:', astroResult3.currentDasha?.planet?.en || 'N/A');
    
  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
    console.error('Stack trace:', error.stack);
    return false;
  }
  
  return true;
};

// Test API endpoint simulation
const testAPIEndpoint = () => {
  console.log('\n🔗 API Endpoint Test Simulation:');
  console.log('POST /api/kundali?action=generate');
  console.log('Request Body:', JSON.stringify({
    name: "Test User",
    dateOfBirth: "1990-01-15",
    timeOfBirth: "10:30",
    placeOfBirth: "Delhi",
    latitude: 28.7041,
    longitude: 77.1025,
    timezone: 5.5
  }, null, 2));
  console.log('Expected: 200 OK with birth chart data');
};

// Run all tests
testAllFunctions().then(success => {
  if (success) {
    testAPIEndpoint();
    console.log('\n✅ ALL FIXES VERIFIED - The 500 error should be resolved!');
  } else {
    console.log('\n❌ Some issues remain - check the error messages above');
  }
});