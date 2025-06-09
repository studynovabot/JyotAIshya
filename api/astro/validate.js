// Astrological Data Validation Serverless Function

// CORS headers for Vercel serverless function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true'
};

export default async function handler(req, res) {
  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST.'
    });
  }

  try {
    console.log("🔍 Received validation request:", req.body);

    const { type, data } = req.body;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Please specify validation type: 'birthData' or 'planetaryPositions'"
      });
    }

    let result;

    switch (type) {
      case 'birthData':
        result = validateBirthData(data);
        break;
      
      case 'planetaryPositions':
        result = validatePlanetaryPositions(data);
        break;
      
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid validation type. Use: 'birthData' or 'planetaryPositions'"
        });
    }

    return res.status(200).json({
      success: true,
      type,
      validation: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Error in validation:", error);
    return res.status(500).json({
      success: false,
      message: "Validation failed",
      error: error.message
    });
  }
}

// Validate birth data inputs
function validateBirthData(data) {
  const { birthDate, birthTime, birthPlace } = data;
  const errors = [];

  // Validate birth date
  if (!birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    errors.push("Invalid birth date format. Use YYYY-MM-DD");
  } else {
    const [year, month, day] = birthDate.split('-').map(Number);
    const currentYear = new Date().getFullYear();

    if (year < 1900 || year > currentYear) {
      errors.push(`Birth year must be between 1900 and ${currentYear}`);
    }
    if (month < 1 || month > 12) {
      errors.push("Birth month must be between 1 and 12");
    }
    if (day < 1 || day > 31) {
      errors.push("Birth day must be between 1 and 31");
    }

    // Check if date is valid
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      errors.push("Invalid birth date");
    }
  }

  // Validate birth time
  if (!birthTime || !/^\d{2}:\d{2}$/.test(birthTime)) {
    errors.push("Invalid birth time format. Use HH:MM");
  } else {
    const [hour, minute] = birthTime.split(':').map(Number);
    if (hour < 0 || hour > 23) {
      errors.push("Birth hour must be between 00 and 23");
    }
    if (minute < 0 || minute > 59) {
      errors.push("Birth minute must be between 00 and 59");
    }
  }

  // Validate birth place
  if (!birthPlace || birthPlace.trim().length < 2) {
    errors.push("Birth place must be at least 2 characters long");
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

// Validate calculated planetary positions for sanity
function validatePlanetaryPositions(data) {
  const { planets, birthDate } = data;
  const warnings = [];
  
  if (!planets || !Array.isArray(planets)) {
    return {
      hasWarnings: true,
      warnings: ["Invalid planets data provided"]
    };
  }

  const [year, month] = birthDate.split('-').map(Number);

  // Find Sun position
  const sun = planets.find(p => p.id === 0); // SUN = 0
  if (sun) {
    // Check if Sun is in reasonable zodiac sign for the month
    const expectedSigns = {
      1: [9, 10], // January: Capricorn, Aquarius
      2: [10, 11], // February: Aquarius, Pisces
      3: [11, 0], // March: Pisces, Aries
      4: [0, 1], // April: Aries, Taurus
      5: [1, 2], // May: Taurus, Gemini
      6: [2, 3], // June: Gemini, Cancer
      7: [3, 4], // July: Cancer, Leo
      8: [4, 5], // August: Leo, Virgo
      9: [5, 6], // September: Virgo, Libra
      10: [6, 7], // October: Libra, Scorpio
      11: [7, 8], // November: Scorpio, Sagittarius
      12: [8, 9] // December: Sagittarius, Capricorn
    };

    const expected = expectedSigns[month];
    if (expected && !expected.includes(sun.rashi)) {
      warnings.push(`Sun position (${sun.rashiName?.english || 'Unknown'}) seems unusual for ${month}/${year}`);
    }
  }

  // Check for planets in valid ranges
  planets.forEach(planet => {
    if (planet.longitude < 0 || planet.longitude >= 360) {
      warnings.push(`${planet.name?.en || 'Unknown planet'} longitude (${planet.longitude}°) is out of valid range`);
    }
    if (planet.rashi < 0 || planet.rashi > 11) {
      warnings.push(`${planet.name?.en || 'Unknown planet'} rashi (${planet.rashi}) is out of valid range`);
    }
  });

  return {
    hasWarnings: warnings.length > 0,
    warnings: warnings
  };
}
