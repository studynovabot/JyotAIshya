// Simplified astro calculations for serverless functions
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants for Vedic astrology
const PLANETS = {
  SUN: 0,
  MOON: 1,
  MARS: 2,
  MERCURY: 3,
  JUPITER: 4,
  VENUS: 5,
  SATURN: 6,
  RAHU: 7,
  KETU: 8
};

const PLANET_NAMES = {
  [PLANETS.SUN]: { en: "Sun", sa: "Surya (सूर्य)" },
  [PLANETS.MOON]: { en: "Moon", sa: "Chandra (चंद्र)" },
  [PLANETS.MARS]: { en: "Mars", sa: "Mangal (मंगल)" },
  [PLANETS.MERCURY]: { en: "Mercury", sa: "Budh (बुध)" },
  [PLANETS.JUPITER]: { en: "Jupiter", sa: "Guru (गुरु)" },
  [PLANETS.VENUS]: { en: "Venus", sa: "Shukra (शुक्र)" },
  [PLANETS.SATURN]: { en: "Saturn", sa: "Shani (शनि)" },
  [PLANETS.RAHU]: { en: "Rahu", sa: "Rahu (राहु)" },
  [PLANETS.KETU]: { en: "Ketu", sa: "Ketu (केतु)" }
};

const RASHIS = [
  { id: "mesh", name: "Mesh (मेष)", english: "Aries", element: "Agni (Fire)", lord: "Mangal (Mars)" },
  { id: "vrishabh", name: "Vrishabh (वृषभ)", english: "Taurus", element: "Prithvi (Earth)", lord: "Shukra (Venus)" },
  { id: "mithun", name: "Mithun (मिथुन)", english: "Gemini", element: "Vayu (Air)", lord: "Budh (Mercury)" },
  { id: "kark", name: "Kark (कर्क)", english: "Cancer", element: "Jal (Water)", lord: "Chandra (Moon)" },
  { id: "simha", name: "Simha (सिंह)", english: "Leo", element: "Agni (Fire)", lord: "Surya (Sun)" },
  { id: "kanya", name: "Kanya (कन्या)", english: "Virgo", element: "Prithvi (Earth)", lord: "Budh (Mercury)" },
  { id: "tula", name: "Tula (तुला)", english: "Libra", element: "Vayu (Air)", lord: "Shukra (Venus)" },
  { id: "vrishchik", name: "Vrishchik (वृश्चिक)", english: "Scorpio", element: "Jal (Water)", lord: "Mangal (Mars)" },
  { id: "dhanu", name: "Dhanu (धनु)", english: "Sagittarius", element: "Agni (Fire)", lord: "Guru (Jupiter)" },
  { id: "makar", name: "Makar (मकर)", english: "Capricorn", element: "Prithvi (Earth)", lord: "Shani (Saturn)" },
  { id: "kumbh", name: "Kumbh (कुंभ)", english: "Aquarius", element: "Vayu (Air)", lord: "Shani (Saturn)" },
  { id: "meen", name: "Meen (मीन)", english: "Pisces", element: "Jal (Water)", lord: "Guru (Jupiter)" }
];

/**
 * Get coordinates for a place
 * @param {string} place - Name of the place
 * @returns {Promise<Object>} Latitude, longitude and timezone
 */
const getGeoCoordinates = async (place) => {
  // Mock locations database
  const mockLocations = {
    'delhi': { lat: 28.7041, lng: 77.1025, timezone: 5.5 },
    'mumbai': { lat: 19.0760, lng: 72.8777, timezone: 5.5 },
    'kolkata': { lat: 22.5726, lng: 88.3639, timezone: 5.5 },
    'chennai': { lat: 13.0827, lng: 80.2707, timezone: 5.5 },
    'bangalore': { lat: 12.9716, lng: 77.5946, timezone: 5.5 },
    'hyderabad': { lat: 17.3850, lng: 78.4867, timezone: 5.5 },
    'ahmedabad': { lat: 23.0225, lng: 72.5714, timezone: 5.5 },
    'pune': { lat: 18.5204, lng: 73.8567, timezone: 5.5 },
    'jaipur': { lat: 26.9124, lng: 75.7873, timezone: 5.5 },
    'lucknow': { lat: 26.8467, lng: 80.9462, timezone: 5.5 },
    'new york': { lat: 40.7128, lng: -74.0060, timezone: -5 },
    'london': { lat: 51.5074, lng: -0.1278, timezone: 0 },
    'tokyo': { lat: 35.6762, lng: 139.6503, timezone: 9 },
    'sydney': { lat: -33.8688, lng: 151.2093, timezone: 10 },
    'paris': { lat: 48.8566, lng: 2.3522, timezone: 1 },
    'berlin': { lat: 52.5200, lng: 13.4050, timezone: 1 },
    'moscow': { lat: 55.7558, lng: 37.6173, timezone: 3 },
    'dubai': { lat: 25.2048, lng: 55.2708, timezone: 4 },
    'singapore': { lat: 1.3521, lng: 103.8198, timezone: 8 },
    // Default for unknown locations
    'default': { lat: 20.5937, lng: 78.9629, timezone: 5.5 } // Center of India
  };
  
  const normalizedPlace = place.toLowerCase().trim();
  
  // If we have the location in our database, return it
  if (mockLocations[normalizedPlace]) {
    return mockLocations[normalizedPlace];
  }
  
  // Otherwise, return default location
  console.log(`Location "${place}" not found in database, using default coordinates.`);
  return mockLocations.default;
};

/**
 * Get daily horoscope for a rashi
 * @param {string} rashi - Vedic zodiac sign
 * @returns {Object} Daily horoscope
 */
const getDailyHoroscope = async (rashi) => {
  const rashiIndex = RASHIS.findIndex(r => r.id === rashi.toLowerCase());
  
  if (rashiIndex === -1) {
    throw new Error("Invalid rashi name");
  }
  
  const today = new Date();
  const dateString = today.toISOString().split('T')[0];
  
  // Mock horoscope data
  const horoscopes = [
    "आज आपके लिए शुभ दिन है। आपकी ऊर्जा उच्च रहेगी और आप नए कार्यों में सफलता प्राप्त करेंगे।",
    "आज आपको वित्तीय मामलों में सावधानी बरतने की आवश्यकता है। परिवार के साथ समय बिताएं।",
    "आज संचार और यात्रा के लिए अच्छा दिन है। नए संपर्क आपके लिए लाभदायक होंगे।",
    "आज भावनात्मक मामलों पर ध्यान दें। घर और परिवार से जुड़े निर्णय सफल होंगे।",
    "आज आप रचनात्मकता से भरे होंगे। प्रेम और रोमांस के लिए अच्छा दिन है।",
    "आज विश्लेषणात्मक सोच आपकी मदद करेगी। स्वास्थ्य पर विशेष ध्यान दें।",
    "आज सामाजिक गतिविधियों के लिए अच्छा दिन है। साझेदारी और संबंध मजबूत होंगे।",
    "आज गहन अध्ययन और शोध के लिए अच्छा दिन है। आध्यात्मिक विषयों में रुचि बढ़ेगी।",
    "आज यात्रा और शिक्षा के लिए अच्छा दिन है। दूरदर्शिता आपकी मदद करेगी।",
    "आज कैरियर और व्यावसायिक मामलों पर ध्यान दें। अधिकार और जिम्मेदारी मिल सकती है।",
    "आज नवाचार और तकनीकी विषयों के लिए अच्छा दिन है। मित्रता और सामाजिक संपर्क बढ़ेंगे।",
    "आज आध्यात्मिक और भावनात्मक विकास के लिए अच्छा दिन है। अंतर्ज्ञान पर भरोसा करें।"
  ];
  
  // English translations
  const englishHoroscopes = [
    "Today is an auspicious day for you. Your energy will be high and you will succeed in new endeavors.",
    "Today you need to be careful in financial matters. Spend time with family.",
    "Today is good for communication and travel. New contacts will be beneficial for you.",
    "Focus on emotional matters today. Decisions related to home and family will be successful.",
    "Today you will be full of creativity. Good day for love and romance.",
    "Analytical thinking will help you today. Pay special attention to health.",
    "Today is good for social activities. Partnerships and relationships will strengthen.",
    "Today is good for deep study and research. Interest in spiritual subjects will increase.",
    "Today is good for travel and education. Foresight will help you.",
    "Focus on career and professional matters today. You may receive authority and responsibility.",
    "Today is good for innovation and technical subjects. Friendships and social connections will increase.",
    "Today is good for spiritual and emotional development. Trust your intuition."
  ];
  
  return {
    rashi: RASHIS[rashiIndex],
    date: dateString,
    prediction: {
      hindi: horoscopes[rashiIndex],
      english: englishHoroscopes[rashiIndex]
    },
    luckyColor: ["Red", "Blue", "Green", "Yellow", "Orange", "Purple", "White", "Gold"][Math.floor(Math.random() * 8)],
    luckyNumber: Math.floor(Math.random() * 9) + 1,
    advice: "आज के दिन का आनंद लें और सकारात्मक रहें। (Enjoy the day and stay positive.)"
  };
};

/**
 * Validate birth data
 * @param {string} birthDate - Birth date in YYYY-MM-DD format
 * @param {string} birthTime - Birth time in HH:MM format
 * @param {string} birthPlace - Birth place
 * @returns {Object} Validation result
 */
const validateBirthData = (birthDate, birthTime, birthPlace) => {
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

  // Validate birth time (accept both HH:MM and HH:MM:SS)
  if (!birthTime || !/^\d{2}:\d{2}(:\d{2})?$/.test(birthTime)) {
    errors.push("Invalid birth time format. Use HH:MM or HH:MM:SS");
  } else {
    const timeParts = birthTime.split(':').map(Number);
    const [hour, minute, second = 0] = timeParts;
    if (hour < 0 || hour > 23) {
      errors.push("Birth hour must be between 00 and 23");
    }
    if (minute < 0 || minute > 59) {
      errors.push("Birth minute must be between 00 and 59");
    }
    if (second < 0 || second > 59) {
      errors.push("Birth second must be between 00 and 59");
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
};

/**
 * Calculate Julian Day Number from Gregorian date with timezone adjustment
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @param {number} day - Day
 * @param {number} hour - Hour (0-23)
 * @param {number} minute - Minute (0-59)
 * @param {number} timezone - Timezone offset in hours (default: 5.5 for IST)
 * @returns {number} Julian Day Number
 */
const calculateJulianDay = (year, month, day, hour, minute, timezone = 5.5) => {
  // Convert local time to UTC
  let utcHour = hour - timezone;
  let utcDay = day;
  let utcMonth = month;
  let utcYear = year;

  // Handle day overflow/underflow
  if (utcHour < 0) {
    utcHour += 24;
    utcDay -= 1;
  } else if (utcHour >= 24) {
    utcHour -= 24;
    utcDay += 1;
  }

  // Handle month boundaries (simplified)
  if (utcDay < 1) {
    utcMonth -= 1;
    if (utcMonth < 1) {
      utcMonth = 12;
      utcYear -= 1;
    }
    utcDay = 30; // Simplified
  } else if (utcDay > 31) {
    utcMonth += 1;
    if (utcMonth > 12) {
      utcMonth = 1;
      utcYear += 1;
    }
    utcDay = 1;
  }

  // Julian Day calculation
  const a = Math.floor((14 - utcMonth) / 12);
  const y = utcYear + 4800 - a;
  const m = utcMonth + 12 * a - 3;

  const jdn = utcDay + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  // Add time fraction
  const timeFraction = (utcHour + minute / 60) / 24;
  
  return jdn + timeFraction - 0.5;
};

/**
 * Simplified birth chart generation for serverless
 * @param {string} name - Name of the person
 * @param {string} birthDate - Birth date in YYYY-MM-DD format
 * @param {string} birthTime - Birth time in HH:MM format
 * @param {string} birthPlace - Birth place
 * @param {number} latitude - Latitude (optional)
 * @param {number} longitude - Longitude (optional)
 * @param {number} timezone - Timezone offset (optional)
 * @returns {Object} Simplified birth chart data
 */
const generateBirthChart = async (name, birthDate, birthTime, birthPlace, latitude, longitude, timezone) => {
  try {
    console.log('generateBirthChart called with:', { name, birthDate, birthTime, birthPlace, latitude, longitude, timezone });
    
    // Validate input data
    const validation = validateBirthData(birthDate, birthTime, birthPlace);
    if (!validation.isValid) {
      throw new Error(`Invalid birth data: ${validation.errors.join(', ')}`);
    }

    // If coordinates are provided, use them directly
    let geoData;
    if (latitude !== undefined && longitude !== undefined) {
      geoData = {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
        timezone: timezone !== undefined ? parseFloat(timezone) : 5.5
      };
    } else {
      // Get coordinates from place name
      geoData = await getGeoCoordinates(birthPlace);
    }
    
    console.log('Using geo data:', geoData);

    // Parse birth date and time
    const [year, month, day] = birthDate.split('-').map(Number);
    const timeParts = birthTime.split(':').map(Number);
    const [hour, minute] = timeParts;

    // Calculate Julian day with timezone adjustment
    const julianDay = calculateJulianDay(year, month, day, hour, minute, geoData.timezone || 5.5);

    // Simplified planetary positions (mock data for serverless)
    const planets = {
      [PLANETS.SUN]: { longitude: 280.0, sign: "Capricorn", degree: 10.0, house: 1 },
      [PLANETS.MOON]: { longitude: 45.0, sign: "Taurus", degree: 15.0, house: 2 },
      [PLANETS.MARS]: { longitude: 120.0, sign: "Leo", degree: 0.0, house: 5 },
      [PLANETS.MERCURY]: { longitude: 290.0, sign: "Capricorn", degree: 20.0, house: 1 },
      [PLANETS.JUPITER]: { longitude: 180.0, sign: "Libra", degree: 0.0, house: 7 },
      [PLANETS.VENUS]: { longitude: 320.0, sign: "Aquarius", degree: 20.0, house: 2 },
      [PLANETS.SATURN]: { longitude: 240.0, sign: "Sagittarius", degree: 0.0, house: 9 },
      [PLANETS.RAHU]: { longitude: 90.0, sign: "Cancer", degree: 0.0, house: 4 },
      [PLANETS.KETU]: { longitude: 270.0, sign: "Capricorn", degree: 0.0, house: 10 }
    };

    // Simplified ascendant calculation
    const ascendant = {
      longitude: 270.0,
      sign: "Capricorn",
      degree: 0.0,
      nakshatra: "Uttara Ashadha"
    };

    // Simplified house cusps
    const houses = Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      cusp: (270 + i * 30) % 360,
      sign: RASHIS[Math.floor(((270 + i * 30) % 360) / 30)].english,
      planets: []
    }));

    // Return simplified birth chart data
    return {
      name,
      birthDetails: {
        date: birthDate,
        time: birthTime,
        place: birthPlace,
        coordinates: {
          latitude: geoData.lat,
          longitude: geoData.lng,
          timezone: geoData.timezone || 5.5
        }
      },
      ascendant,
      planets,
      houses,
      ayanamsa: 24.0, // Simplified
      calculationInfo: {
        julianDay,
        method: "Simplified for Serverless",
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error in generateBirthChart:', error);
    throw new Error(`Failed to generate birth chart: ${error.message}`);
  }
};

export {
  getDailyHoroscope,
  generateBirthChart,
  getGeoCoordinates,
  validateBirthData,
  RASHIS,
  PLANETS,
  PLANET_NAMES
};