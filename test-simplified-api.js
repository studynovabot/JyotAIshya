import { getDailyHoroscope, generateBirthChart } from './api/utils/astroCalculations.js';

console.log('🧪 Testing simplified API functions...');

// Test 1: Daily Horoscope
console.log('\n1️⃣ Testing getDailyHoroscope...');
try {
  const horoscope = await getDailyHoroscope('mesh');
  console.log('✅ Daily horoscope test passed');
  console.log('Horoscope data:', JSON.stringify(horoscope, null, 2));
} catch (error) {
  console.error('❌ Daily horoscope test failed:', error.message);
  console.error('Stack:', error.stack);
}

// Test 2: Birth Chart Generation with coordinates
console.log('\n2️⃣ Testing generateBirthChart with coordinates...');
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
  console.log('✅ Birth chart with coordinates test passed');
  console.log('Birth chart keys:', Object.keys(birthChart));
  console.log('Ascendant:', birthChart.ascendant);
  console.log('Birth details:', birthChart.birthDetails);
} catch (error) {
  console.error('❌ Birth chart with coordinates test failed:', error.message);
  console.error('Stack:', error.stack);
}

// Test 3: Birth Chart Generation without coordinates
console.log('\n3️⃣ Testing generateBirthChart without coordinates...');
try {
  const birthChart = await generateBirthChart(
    'Test User 2',
    '1990-01-01',
    '12:00',
    'Mumbai'
  );
  console.log('✅ Birth chart without coordinates test passed');
  console.log('Birth chart keys:', Object.keys(birthChart));
  console.log('Ascendant:', birthChart.ascendant);
  console.log('Birth details:', birthChart.birthDetails);
} catch (error) {
  console.error('❌ Birth chart without coordinates test failed:', error.message);
  console.error('Stack:', error.stack);
}

// Test 4: Invalid inputs
console.log('\n4️⃣ Testing invalid inputs...');
try {
  const birthChart = await generateBirthChart(
    'Test User 3',
    'invalid-date',
    '25:00',
    ''
  );
  console.log('❌ Should have failed with invalid inputs');
} catch (error) {
  console.log('✅ Correctly rejected invalid inputs:', error.message);
}

console.log('\n🏁 Simplified API test completed');