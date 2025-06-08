#!/usr/bin/env node

import { calculateKundali, checkDoshas, calculateDasha } from './utils/astroCalculationsNew.js';

/**
 * CLI Test Script for Kundali Generation
 * Tests the birth chart calculation and displays results
 */

// Test data - you can modify these values
const testData = {
  name: "Test User",
  birthDate: "1990-05-15",  // YYYY-MM-DD format
  birthTime: "14:30",       // HH:MM format (24-hour)
  birthPlace: "New Delhi, India"
};

// Alternative test cases
const testCases = [
  {
    name: "Rajesh Kumar",
    birthDate: "1985-03-20",
    birthTime: "08:45",
    birthPlace: "Mumbai, India"
  },
  {
    name: "Priya Sharma",
    birthDate: "1992-11-08",
    birthTime: "16:20",
    birthPlace: "Jaipur, India"
  },
  {
    name: "Amit Singh",
    birthDate: "1988-07-12",
    birthTime: "22:15",
    birthPlace: "Kolkata, India"
  }
];

/**
 * Display birth chart in a visual format (North Indian style)
 */
function displayBirthChart(kundaliData) {
  console.log('\n🔮 BIRTH CHART (North Indian Style) 🔮');
  console.log('=' .repeat(60));
  
  const { planets, houses, ascendant } = kundaliData;
  
  // Create a house-to-planets mapping
  const housePlanets = {};
  
  // Initialize all houses
  for (let i = 1; i <= 12; i++) {
    housePlanets[i] = [];
  }
  
  // Place planets in houses
  planets.forEach(planet => {
    const houseNumber = ((planet.rashi - ascendant.rashi + 12) % 12) + 1;
    const planetName = typeof planet.name === 'object' ? (planet.name.en || planet.name.english) : planet.name;
    housePlanets[houseNumber].push({
      name: planetName,
      symbol: getSymbol(planetName),
      degree: Math.round(planet.degree * 100) / 100
    });
  });
  
  // Display chart in North Indian format
  console.log('┌─────────────┬─────────────┬─────────────┬─────────────┐');
  console.log(`│    H12      │    H1       │    H2       │    H3       │`);
  console.log(`│ ${formatHouse(housePlanets[12])} │ ${formatHouse(housePlanets[1])} │ ${formatHouse(housePlanets[2])} │ ${formatHouse(housePlanets[3])} │`);
  console.log('├─────────────┼─────────────┼─────────────┼─────────────┤');
  console.log(`│    H11      │             │             │    H4       │`);
  console.log(`│ ${formatHouse(housePlanets[11])} │   RASHI     │   CHART     │ ${formatHouse(housePlanets[4])} │`);
  console.log('├─────────────┼─────────────┼─────────────┼─────────────┤');
  console.log(`│    H10      │             │             │    H5       │`);
  const ascendantName = typeof ascendant.rashiName === 'object' ? (ascendant.rashiName.en || ascendant.rashiName.english) : ascendant.rashiName;
  console.log(`│ ${formatHouse(housePlanets[10])} │  ${ascendantName} ASC │             │ ${formatHouse(housePlanets[5])} │`);
  console.log('├─────────────┼─────────────┼─────────────┼─────────────┤');
  console.log(`│    H9       │    H8       │    H7       │    H6       │`);
  console.log(`│ ${formatHouse(housePlanets[9])} │ ${formatHouse(housePlanets[8])} │ ${formatHouse(housePlanets[7])} │ ${formatHouse(housePlanets[6])} │`);
  console.log('└─────────────┴─────────────┴─────────────┴─────────────┘');
}

/**
 * Get symbol for planet
 */
function getSymbol(planetName) {
  const symbols = {
    'Sun': '☉',
    'Moon': '☽',
    'Mars': '♂',
    'Mercury': '☿',
    'Jupiter': '♃',
    'Venus': '♀',
    'Saturn': '♄',
    'Rahu': '☊',
    'Ketu': '☋'
  };
  return symbols[planetName] || planetName.charAt(0);
}

/**
 * Format house content for display
 */
function formatHouse(planets) {
  if (planets.length === 0) return '           ';
  
  const planetStr = planets.map(p => `${p.symbol}`).join(' ');
  return planetStr.padEnd(11).substring(0, 11);
}

/**
 * Display planetary positions
 */
function displayPlanetaryPositions(planets) {
  console.log('\n📍 PLANETARY POSITIONS 📍');
  console.log('=' .repeat(60));
  console.log('Planet      | Rashi        | Degree    | Nakshatra');
  console.log('-' .repeat(60));
  
  planets.forEach(planet => {
    const planetName = typeof planet.name === 'object' ? (planet.name.en || planet.name.english) : planet.name;
    const rashiName = typeof planet.rashiName === 'object' ? (planet.rashiName.en || planet.rashiName.english) : planet.rashiName;

    const name = (planetName || 'Unknown').padEnd(11);
    const rashi = (rashiName || 'Unknown').padEnd(12);
    const degree = `${Math.round(planet.degree * 100) / 100}°`.padEnd(9);
    const nakshatra = planet.nakshatraName || 'N/A';

    console.log(`${name} | ${rashi} | ${degree} | ${nakshatra}`);
  });
}

/**
 * Display dosha analysis
 */
function displayDoshaAnalysis(doshas) {
  console.log('\n⚠️  DOSHA ANALYSIS ⚠️');
  console.log('=' .repeat(60));
  
  Object.entries(doshas).forEach(([doshaName, doshaInfo]) => {
    const status = doshaInfo.present ? '❌ PRESENT' : '✅ NOT PRESENT';
    console.log(`\n${doshaName.toUpperCase()} DOSHA: ${status}`);
    
    if (doshaInfo.description) {
      console.log(`Description: ${doshaInfo.description}`);
    }
    
    if (doshaInfo.present && doshaInfo.remedies) {
      console.log('Remedies:');
      doshaInfo.remedies.forEach((remedy, index) => {
        console.log(`  ${index + 1}. ${remedy}`);
      });
    }
  });
}

/**
 * Display dasha periods
 */
function displayDashaPeriods(dashaPeriods) {
  console.log('\n⏰ DASHA PERIODS ⏰');
  console.log('=' .repeat(60));
  
  if (dashaPeriods.currentDasha) {
    console.log('CURRENT DASHA:');
    console.log(`Planet: ${dashaPeriods.currentDasha.planet.en || dashaPeriods.currentDasha.planet}`);
    console.log(`Period: ${dashaPeriods.currentDasha.startDate} to ${dashaPeriods.currentDasha.endDate}`);
    console.log(`Remaining: ${Math.round(dashaPeriods.currentDasha.remainingYears * 100) / 100} years`);
  }
  
  if (dashaPeriods.dashaPeriods && dashaPeriods.dashaPeriods.length > 0) {
    console.log('\nUPCOMING DASHA PERIODS:');
    dashaPeriods.dashaPeriods.slice(0, 5).forEach((period, index) => {
      const planet = period.planet.en || period.planet;
      console.log(`${index + 1}. ${planet}: ${period.startDate} to ${period.endDate} (${period.years} years)`);
    });
  }
}

/**
 * Main test function
 */
async function testKundaliGeneration(testCase = testData) {
  try {
    console.log('\n🚀 STARTING KUNDALI GENERATION TEST 🚀');
    console.log('=' .repeat(60));
    console.log(`Name: ${testCase.name}`);
    console.log(`Birth Date: ${testCase.birthDate}`);
    console.log(`Birth Time: ${testCase.birthTime}`);
    console.log(`Birth Place: ${testCase.birthPlace}`);
    
    console.log('\n⏳ Calculating kundali...');
    
    // Calculate kundali
    const kundaliData = await calculateKundali(
      testCase.name,
      testCase.birthDate,
      testCase.birthTime,
      testCase.birthPlace
    );
    
    console.log('✅ Kundali calculation completed!');
    
    // Display birth chart
    displayBirthChart(kundaliData);
    
    // Display planetary positions
    displayPlanetaryPositions(kundaliData.planets);
    
    // Check doshas
    console.log('\n⏳ Checking doshas...');
    const doshas = checkDoshas(kundaliData);
    displayDoshaAnalysis(doshas);
    
    // Calculate dasha periods
    console.log('\n⏳ Calculating dasha periods...');
    const dashaPeriods = calculateDasha(kundaliData);
    displayDashaPeriods(dashaPeriods);
    
    console.log('\n✨ KUNDALI GENERATION TEST COMPLETED SUCCESSFULLY! ✨');
    
    return {
      success: true,
      data: {
        kundali: kundaliData,
        doshas: doshas,
        dashaPeriods: dashaPeriods
      }
    };
    
  } catch (error) {
    console.error('\n❌ ERROR DURING KUNDALI GENERATION:');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Check command line arguments
const args = process.argv.slice(2);

if (args.length >= 4) {
  // Use command line arguments
  const [name, birthDate, birthTime, birthPlace] = args;
  testKundaliGeneration({ name, birthDate, birthTime, birthPlace });
} else if (args[0] === 'all') {
  // Test all cases
  console.log('🧪 RUNNING ALL TEST CASES 🧪');
  for (let i = 0; i < testCases.length; i++) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`TEST CASE ${i + 1}/${testCases.length}`);
    console.log(`${'='.repeat(80)}`);
    await testKundaliGeneration(testCases[i]);
  }
} else {
  // Use default test data
  testKundaliGeneration();
}
