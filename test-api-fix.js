import { generateBirthChart, getDailyHoroscope } from './server/utils/astroCalculationsNew.js';

console.log('🧪 Testing API functions...');

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

// Test 2: Birth Chart Generation
console.log('\n2️⃣ Testing generateBirthChart...');
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
  console.log('✅ Birth chart test passed');
  console.log('Birth chart keys:', Object.keys(birthChart));
} catch (error) {
  console.error('❌ Birth chart test failed:', error.message);
  console.error('Stack:', error.stack);
}

// Test 3: Birth Chart without coordinates
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
} catch (error) {
  console.error('❌ Birth chart without coordinates test failed:', error.message);
  console.error('Stack:', error.stack);
}

console.log('\n🏁 Test completed');