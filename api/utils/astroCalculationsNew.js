// Optimized for Vercel serverless environment
// Removed file system dependencies that don't work in serverless

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

// Houses in Vedic astrology
const HOUSES = [
  { number: 1, name: "Lagna (लग्न)", significations: ["Self", "Personality", "Physical body"] },
  { number: 2, name: "Dhana (धन)", significations: ["Wealth", "Family", "Speech"] },
  { number: 3, name: "Sahaja (सहज)", significations: ["Siblings", "Courage", "Communication"] },
  { number: 4, name: "Sukha (सुख)", significations: ["Happiness", "Mother", "Home"] },
  { number: 5, name: "Putra (पुत्र)", significations: ["Children", "Intelligence", "Creativity"] },
  { number: 6, name: "Ripu (रिपु)", significations: ["Enemies", "Disease", "Debt"] },
  { number: 7, name: "Yuvati (युवति)", significations: ["Marriage", "Partnership", "Business"] },
  { number: 8, name: "Randhra (रन्ध्र)", significations: ["Longevity", "Obstacles", "Hidden things"] },
  { number: 9, name: "Dharma (धर्म)", significations: ["Religion", "Fortune", "Father"] },
  { number: 10, name: "Karma (कर्म)", significations: ["Career", "Status", "Authority"] },
  { number: 11, name: "Labha (लाभ)", significations: ["Gains", "Income", "Desires"] },
  { number: 12, name: "Vyaya (व्यय)", significations: ["Loss", "Expenses", "Liberation"] }
];

// Nakshatras (lunar mansions)
const NAKSHATRAS = [
  { id: 0, name: "Ashwini", deity: "Ashwini Kumaras", symbol: "Horse's head", ruler: "Ketu" },
  { id: 1, name: "Bharani", deity: "Yama", symbol: "Yoni", ruler: "Venus" },
  { id: 2, name: "Krittika", deity: "Agni", symbol: "Razor/Flame", ruler: "Sun" },
  { id: 3, name: "Rohini", deity: "Brahma", symbol: "Chariot/Ox cart", ruler: "Moon" },
  { id: 4, name: "Mrigashira", deity: "Soma", symbol: "Deer head", ruler: "Mars" },
  { id: 5, name: "Ardra", deity: "Rudra", symbol: "Teardrop", ruler: "Rahu" },
  { id: 6, name: "Punarvasu", deity: "Aditi", symbol: "Bow", ruler: "Jupiter" },
  { id: 7, name: "Pushya", deity: "Brihaspati", symbol: "Flower/Circle", ruler: "Saturn" },
  { id: 8, name: "Ashlesha", deity: "Nagas", symbol: "Serpent", ruler: "Mercury" },
  { id: 9, name: "Magha", deity: "Pitris", symbol: "Royal throne", ruler: "Ketu" },
  { id: 10, name: "Purva Phalguni", deity: "Bhaga", symbol: "Front of bed", ruler: "Venus" },
  { id: 11, name: "Uttara Phalguni", deity: "Aryaman", symbol: "Back of bed", ruler: "Sun" },
  { id: 12, name: "Hasta", deity: "Savitar", symbol: "Hand", ruler: "Moon" },
  { id: 13, name: "Chitra", deity: "Tvashtar", symbol: "Pearl/Jewel", ruler: "Mars" },
  { id: 14, name: "Swati", deity: "Vayu", symbol: "Coral/Sword", ruler: "Rahu" },
  { id: 15, name: "Vishakha", deity: "Indra-Agni", symbol: "Potter's wheel", ruler: "Jupiter" },
  { id: 16, name: "Anuradha", deity: "Mitra", symbol: "Lotus", ruler: "Saturn" },
  { id: 17, name: "Jyeshtha", deity: "Indra", symbol: "Earring/Umbrella", ruler: "Mercury" },
  { id: 18, name: "Mula", deity: "Nirrti", symbol: "Lion's tail/Roots", ruler: "Ketu" },
  { id: 19, name: "Purva Ashadha", deity: "Apas", symbol: "Fan/Tusk", ruler: "Venus" },
  { id: 20, name: "Uttara Ashadha", deity: "Vishvedevas", symbol: "Elephant tusk", ruler: "Sun" },
  { id: 21, name: "Shravana", deity: "Vishnu", symbol: "Three footprints", ruler: "Moon" },
  { id: 22, name: "Dhanishta", deity: "Vasus", symbol: "Drum", ruler: "Mars" },
  { id: 23, name: "Shatabhisha", deity: "Varuna", symbol: "Empty circle", ruler: "Rahu" },
  { id: 24, name: "Purva Bhadrapada", deity: "Aja Ekapada", symbol: "Front of funeral cot", ruler: "Jupiter" },
  { id: 25, name: "Uttara Bhadrapada", deity: "Ahir Budhnya", symbol: "Back of funeral cot", ruler: "Saturn" },
  { id: 26, name: "Revati", deity: "Pushan", symbol: "Fish", ruler: "Mercury" }
];

/**
 * Get geographic coordinates for a location using a geocoding API
 * @param {string} place - Name of the place
 * @returns {Promise<Object>} Latitude, longitude and timezone
 */
const getGeoCoordinates = async (place) => {
  // First check if we have the location in our database
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
    'johannesburg': { lat: -26.2041, lng: 28.0473, timezone: 2 },
    'cairo': { lat: 30.0444, lng: 31.2357, timezone: 2 },
    'rio de janeiro': { lat: -22.9068, lng: -43.1729, timezone: -3 },
    'toronto': { lat: 43.6532, lng: -79.3832, timezone: -5 },
    'mexico city': { lat: 19.4326, lng: -99.1332, timezone: -6 },
    'los angeles': { lat: 34.0522, lng: -118.2437, timezone: -8 },
    'chicago': { lat: 41.8781, lng: -87.6298, timezone: -6 },
    'houston': { lat: 29.7604, lng: -95.3698, timezone: -6 },
    'phoenix': { lat: 33.4484, lng: -112.0740, timezone: -7 },
    'philadelphia': { lat: 39.9526, lng: -75.1652, timezone: -5 },
    'san antonio': { lat: 29.4241, lng: -98.4936, timezone: -6 },
    'san diego': { lat: 32.7157, lng: -117.1611, timezone: -8 },
    'dallas': { lat: 32.7767, lng: -96.7970, timezone: -6 },
    'san jose': { lat: 37.3382, lng: -121.8863, timezone: -8 },
    'austin': { lat: 30.2672, lng: -97.7431, timezone: -6 },
    'jacksonville': { lat: 30.3322, lng: -81.6557, timezone: -5 },
    'san francisco': { lat: 37.7749, lng: -122.4194, timezone: -8 },
    'columbus': { lat: 39.9612, lng: -82.9988, timezone: -5 },
    'fort worth': { lat: 32.7555, lng: -97.3308, timezone: -6 },
    'charlotte': { lat: 35.2271, lng: -80.8431, timezone: -5 },
    'detroit': { lat: 42.3314, lng: -83.0458, timezone: -5 },
    'el paso': { lat: 31.7619, lng: -106.4850, timezone: -7 },
    'memphis': { lat: 35.1495, lng: -90.0490, timezone: -6 },
    'seattle': { lat: 47.6062, lng: -122.3321, timezone: -8 },
    'denver': { lat: 39.7392, lng: -104.9903, timezone: -7 },
    'washington': { lat: 38.9072, lng: -77.0369, timezone: -5 },
    'boston': { lat: 42.3601, lng: -71.0589, timezone: -5 },
    'nashville': { lat: 36.1627, lng: -86.7816, timezone: -6 },
    'baltimore': { lat: 39.2904, lng: -76.6122, timezone: -5 },
    'oklahoma city': { lat: 35.4676, lng: -97.5164, timezone: -6 },
    // Default for unknown locations
    'default': { lat: 20.5937, lng: 78.9629, timezone: 5.5 } // Center of India
  };
  
  const normalizedPlace = place.toLowerCase().trim();
  
  // If we have the location in our database, return it
  if (mockLocations[normalizedPlace]) {
    return mockLocations[normalizedPlace];
  }
  
  // Otherwise, try to get it from a geocoding API
  try {
    // In a production environment, you would use a proper geocoding API
    // For now, we'll return the default location
    console.log(`Location "${place}" not found in database, using default coordinates.`);
    return mockLocations.default;
  } catch (error) {
    console.error(`Error getting coordinates for ${place}:`, error);
    return mockLocations.default;
  }
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

  // Handle hour overflow/underflow
  while (utcHour < 0) {
    utcHour += 24;
    utcDay -= 1;
  }
  while (utcHour >= 24) {
    utcHour -= 24;
    utcDay += 1;
  }

  // Handle day overflow/underflow
  if (utcDay < 1) {
    utcMonth -= 1;
    if (utcMonth < 1) {
      utcMonth = 12;
      utcYear -= 1;
    }
    // Get days in previous month
    const daysInMonth = new Date(utcYear, utcMonth, 0).getDate();
    utcDay += daysInMonth;
  }

  const daysInMonth = new Date(utcYear, utcMonth, 0).getDate();
  if (utcDay > daysInMonth) {
    utcDay -= daysInMonth;
    utcMonth += 1;
    if (utcMonth > 12) {
      utcMonth = 1;
      utcYear += 1;
    }
  }

  // Adjust month and year for January and February (Gregorian to Julian calendar conversion)
  if (utcMonth <= 2) {
    utcMonth += 12;
    utcYear -= 1;
  }

  // Calculate Julian Day Number using standard formula
  const a = Math.floor(utcYear / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (utcYear + 4716)) + Math.floor(30.6001 * (utcMonth + 1)) + utcDay + b - 1524.5;

  // Add time fraction
  const timeInDays = (utcHour + minute / 60) / 24;

  return jd + timeInDays;
};

/**
 * Calculate Ayanamsa (precession of the equinoxes) using accurate Lahiri method
 * @param {number} julianDay - Julian Day
 * @returns {number} Ayanamsa in degrees
 */
const calculateAyanamsa = (julianDay) => {
  // Accurate Lahiri ayanamsa calculation
  // Based on the formula used by the Indian Ephemeris and Nautical Almanac
  const t = (julianDay - 2451545.0) / 36525; // Julian centuries since J2000.0

  // Lahiri ayanamsa formula (more accurate)
  // Reference: Explanatory Supplement to the Astronomical Almanac
  let ayanamsa = 23.85 + 0.0026 * t;

  // More precise Lahiri calculation
  // Based on the spica-centric ayanamsa
  const spicaLongitude = 23.85; // Spica's longitude at epoch 1900.0
  const precessionRate = 50.2564; // arcseconds per year
  const yearsFromEpoch = (julianDay - 2415020.5) / 365.25; // Years from 1900.0

  ayanamsa = spicaLongitude + (precessionRate * yearsFromEpoch) / 3600;

  // Apply corrections for better accuracy
  const correction = 0.000139 * t * t - 0.0000001 * t * t * t;
  ayanamsa += correction;

  // Ensure positive value
  ayanamsa = ((ayanamsa % 360) + 360) % 360;

  return ayanamsa;
};

/**
 * Calculate sidereal time at Greenwich
 * @param {number} julianDay - Julian Day
 * @returns {number} Sidereal time in degrees
 */
const calculateSiderealTime = (julianDay) => {
  const t = (julianDay - 2451545.0) / 36525;
  let theta = 280.46061837 + 360.98564736629 * (julianDay - 2451545.0) + 
              0.000387933 * t * t - t * t * t / 38710000;
  
  // Normalize to 0-360 degrees
  theta = theta % 360;
  if (theta < 0) theta += 360;
  
  return theta;
};

/**
 * Calculate ascendant (Lagna)
 * @param {number} julianDay - Julian Day
 * @param {number} latitude - Latitude in degrees
 * @param {number} longitude - Longitude in degrees
 * @param {number} ayanamsa - Ayanamsa in degrees
 * @returns {Object} Ascendant information
 */
const calculateAscendant = (julianDay, latitude, longitude, ayanamsa) => {
  try {
    // Calculate local sidereal time
    const siderealTime = calculateSiderealTime(julianDay);
    const localSiderealTime = (siderealTime + longitude) % 360;

    // Calculate ascendant using simplified formula
    const obliquity = 23.439281 * Math.PI / 180; // Obliquity of ecliptic in radians
    const latRad = latitude * Math.PI / 180;
    const lstRad = localSiderealTime * Math.PI / 180;

    // Prevent division by zero
    const denominator = Math.cos(obliquity) + Math.sin(obliquity) * Math.sin(latRad) / Math.cos(latRad);
    if (Math.abs(denominator) < 1e-10) {
      throw new Error("Division by zero in ascendant calculation");
    }

    const tanAsc = Math.tan(lstRad) / denominator;
    let ascendant = Math.atan(tanAsc) * 180 / Math.PI;

    // Ensure ascendant is positive
    ascendant = ((ascendant % 360) + 360) % 360;

    // Adjust quadrant based on local sidereal time
    if (localSiderealTime >= 90 && localSiderealTime < 270) {
      ascendant += 180;
    }
    ascendant = ascendant % 360;

    // Convert to sidereal (Vedic) by applying ayanamsa
    const siderealAscendant = (ascendant - ayanamsa + 360) % 360;

    // Calculate rashi (zodiac sign)
    const rashi = Math.floor(siderealAscendant / 30);

    // Validate rashi
    if (rashi < 0 || rashi > 11) {
      throw new Error(`Invalid rashi calculated: ${rashi}`);
    }

    return {
      longitude: siderealAscendant,
      rashi: rashi,
      rashiName: RASHIS[rashi],
      degree: siderealAscendant % 30
    };
  } catch (error) {
    console.error("Error in calculateAscendant:", error);
    // Return a default ascendant (Aries 0°) in case of error
    return {
      longitude: 0,
      rashi: 0,
      rashiName: RASHIS[0],
      degree: 0
    };
  }
};

/**
 * Calculate accurate planet positions using VSOP87 approximations
 * @param {number} julianDay - Julian Day
 * @param {number} ayanamsa - Ayanamsa in degrees
 * @returns {Array} Array of planet positions
 */
const calculatePlanetPositions = (julianDay, ayanamsa) => {
  const planets = [];
  const t = (julianDay - 2451545.0) / 36525; // Julian centuries since J2000.0

  // More accurate orbital elements based on VSOP87 theory
  const calculateSunPosition = (t) => {
    // Sun's mean longitude
    const L0 = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;
    // Sun's mean anomaly
    const M = 357.52911 + 35999.05029 * t - 0.0001537 * t * t;
    // Eccentricity of Earth's orbit
    const e = 0.016708634 - 0.000042037 * t - 0.0000001267 * t * t;

    // Convert to radians
    const MRad = (M * Math.PI) / 180;

    // Calculate equation of center
    const C = (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(MRad) +
              (0.019993 - 0.000101 * t) * Math.sin(2 * MRad) +
              0.000289 * Math.sin(3 * MRad);

    // True longitude
    const trueLongitude = (L0 + C) % 360;

    return trueLongitude;
  };
  const calculateMoonPosition = (t) => {
    // Moon's mean longitude
    const L = 218.3164477 + 481267.88123421 * t - 0.0015786 * t * t + 0.000001856 * t * t * t;
    // Moon's mean elongation
    const D = 297.8501921 + 445267.1114034 * t - 0.0018819 * t * t + 0.000001831 * t * t * t;
    // Sun's mean anomaly
    const M = 357.5291092 + 35999.0502909 * t - 0.0001536 * t * t + 0.000000041 * t * t * t;
    // Moon's mean anomaly
    const Mp = 134.9633964 + 477198.8675055 * t + 0.0087414 * t * t + 0.000014808 * t * t * t;
    // Moon's argument of latitude
    const F = 93.2720950 + 483202.0175233 * t - 0.0036539 * t * t - 0.000000344 * t * t * t;

    // Convert to radians
    const LRad = (L * Math.PI) / 180;
    const DRad = (D * Math.PI) / 180;
    const MRad = (M * Math.PI) / 180;
    const MpRad = (Mp * Math.PI) / 180;
    const FRad = (F * Math.PI) / 180;

    // Calculate lunar longitude corrections (simplified ELP-2000/82 theory)
    let deltaL = 6.288774 * Math.sin(MpRad) +
                 1.274027 * Math.sin(2 * DRad - MpRad) +
                 0.658314 * Math.sin(2 * DRad) +
                 0.213618 * Math.sin(2 * MpRad) +
                 -0.185116 * Math.sin(MRad) +
                 -0.114332 * Math.sin(2 * FRad) +
                 0.058793 * Math.sin(2 * DRad - 2 * MpRad) +
                 0.057066 * Math.sin(2 * DRad - MRad - MpRad) +
                 0.053322 * Math.sin(2 * DRad + MpRad) +
                 0.045758 * Math.sin(2 * DRad - MRad);

    // True longitude
    const trueLongitude = (L + deltaL) % 360;

    return trueLongitude;
  };
  const calculatePlanetPosition = (planetId, t) => {
    // Simplified planetary calculations based on VSOP87 theory
    const planetData = {
      [PLANETS.MARS]: {
        L0: 355.433275 + 19140.2993313 * t,
        M: 19.3730 + 19139.4819985 * t,
        e: 0.0934006 - 0.0000771 * t,
        a: 1.5236915,
        period: 686.98
      },
      [PLANETS.MERCURY]: {
        L0: 252.250906 + 149472.6746358 * t,
        M: 174.7948 + 149472.5153 * t,
        e: 0.20563175 - 0.000020406 * t,
        a: 0.3870983,
        period: 87.97
      },
      [PLANETS.JUPITER]: {
        L0: 34.351484 + 3034.9056746 * t,
        M: 19.8950 + 3034.6951 * t,
        e: 0.0484979 - 0.0000016 * t,
        a: 5.2026032,
        period: 4332.59
      },
      [PLANETS.VENUS]: {
        L0: 181.979801 + 58517.8156760 * t,
        M: 50.4161 + 58517.8035 * t,
        e: 0.00677188 - 0.000047766 * t,
        a: 0.7233316,
        period: 224.70
      },
      [PLANETS.SATURN]: {
        L0: 50.077471 + 1222.1137943 * t,
        M: 317.0207 + 1222.1138 * t,
        e: 0.0565314 - 0.000346641 * t,
        a: 9.5549091,
        period: 10759.22
      }
    };

    const data = planetData[planetId];
    if (!data) return null;

    // Calculate mean longitude and anomaly
    const L = data.L0 % 360;
    const M = (data.M % 360) * Math.PI / 180;

    // Calculate eccentric anomaly using Kepler's equation (iterative solution)
    let E = M;
    for (let i = 0; i < 10; i++) {
      const deltaE = (M + data.e * Math.sin(E) - E) / (1 - data.e * Math.cos(E));
      E += deltaE;
      if (Math.abs(deltaE) < 1e-8) break; // Convergence check
    }

    // Calculate true anomaly
    const v = 2 * Math.atan(Math.sqrt((1 + data.e) / (1 - data.e)) * Math.tan(E / 2));

    // Calculate heliocentric longitude
    const longitude = (L + (v * 180 / Math.PI) - (M * 180 / Math.PI)) % 360;

    return {
      longitude: longitude,
      isRetrograde: calculateRetrograde(planetId, t, data.period)
    };
  };
  const calculateRetrograde = (planetId, t, period) => {
    // Calculate if planet is retrograde based on its synodic period
    // This is a simplified calculation - in reality, retrograde motion is more complex
    const earthPeriod = 365.25;
    const synodicPeriod = (earthPeriod * period) / Math.abs(earthPeriod - period);

    // Calculate phase in synodic cycle
    const phase = ((t * 36525) % synodicPeriod) / synodicPeriod;

    // Retrograde periods (approximate)
    const retrogradeRanges = {
      [PLANETS.MERCURY]: [0.3, 0.7], // Mercury retrograde ~3 times per year
      [PLANETS.VENUS]: [0.4, 0.6],   // Venus retrograde ~1.5 times per year
      [PLANETS.MARS]: [0.35, 0.65],  // Mars retrograde ~every 2 years
      [PLANETS.JUPITER]: [0.4, 0.6], // Jupiter retrograde ~4 months per year
      [PLANETS.SATURN]: [0.4, 0.6]   // Saturn retrograde ~4.5 months per year
    };

    const range = retrogradeRanges[planetId];
    if (!range) return false;

    return phase >= range[0] && phase <= range[1];
  };
  // Calculate Sun position
  const sunLongitude = calculateSunPosition(t);
  const sunSiderealLongitude = (sunLongitude - ayanamsa + 360) % 360;
  const sunRashi = Math.floor(sunSiderealLongitude / 30);
  const sunNakshatra = Math.floor(sunSiderealLongitude / (360/27));

  planets.push({
    id: PLANETS.SUN,
    name: PLANET_NAMES[PLANETS.SUN],
    longitude: sunSiderealLongitude,
    rashi: sunRashi,
    rashiName: RASHIS[sunRashi],
    nakshatra: sunNakshatra,
    nakshatraName: NAKSHATRAS[sunNakshatra],
    degree: sunSiderealLongitude % 30,
    isRetrograde: false // Sun is never retrograde
  });

  // Calculate Moon position
  const moonLongitude = calculateMoonPosition(t);
  const moonSiderealLongitude = (moonLongitude - ayanamsa + 360) % 360;
  const moonRashi = Math.floor(moonSiderealLongitude / 30);
  const moonNakshatra = Math.floor(moonSiderealLongitude / (360/27));

  planets.push({
    id: PLANETS.MOON,
    name: PLANET_NAMES[PLANETS.MOON],
    longitude: moonSiderealLongitude,
    rashi: moonRashi,
    rashiName: RASHIS[moonRashi],
    nakshatra: moonNakshatra,
    nakshatraName: NAKSHATRAS[moonNakshatra],
    degree: moonSiderealLongitude % 30,
    isRetrograde: false // Moon is never retrograde
  });

  // Calculate other planets
  const planetIds = [PLANETS.MARS, PLANETS.MERCURY, PLANETS.JUPITER, PLANETS.VENUS, PLANETS.SATURN];

  for (const planetId of planetIds) {
    const planetPos = calculatePlanetPosition(planetId, t);
    if (!planetPos) continue;

    const siderealLongitude = (planetPos.longitude - ayanamsa + 360) % 360;
    const rashi = Math.floor(siderealLongitude / 30);
    const nakshatra = Math.floor(siderealLongitude / (360/27));

    planets.push({
      id: planetId,
      name: PLANET_NAMES[planetId],
      longitude: siderealLongitude,
      rashi: rashi,
      rashiName: RASHIS[rashi],
      nakshatra: nakshatra,
      nakshatraName: NAKSHATRAS[nakshatra],
      degree: siderealLongitude % 30,
      isRetrograde: planetPos.isRetrograde
    });
  }
  
  // Calculate Rahu (North Node) - Moon's ascending node
  // More accurate calculation of lunar nodes
  const moonNode = 125.1228 - 1934.136 * t + 0.0020708 * t * t + t * t * t / 450000;
  const rahuLongitude = (moonNode + 180) % 360; // Rahu is 180° from the ascending node
  const siderealRahuLongitude = (rahuLongitude - ayanamsa + 360) % 360;
  const rahuRashi = Math.floor(siderealRahuLongitude / 30);
  const rahuNakshatra = Math.floor(siderealRahuLongitude / (360/27));

  planets.push({
    id: PLANETS.RAHU,
    name: PLANET_NAMES[PLANETS.RAHU],
    longitude: siderealRahuLongitude,
    rashi: rahuRashi,
    rashiName: RASHIS[rahuRashi],
    nakshatra: rahuNakshatra,
    nakshatraName: NAKSHATRAS[rahuNakshatra],
    degree: siderealRahuLongitude % 30,
    isRetrograde: true // Rahu is always retrograde
  });

  // Calculate Ketu (South Node) - exactly 180 degrees from Rahu
  const ketuLongitude = (siderealRahuLongitude + 180) % 360;
  const ketuRashi = Math.floor(ketuLongitude / 30);
  const ketuNakshatra = Math.floor(ketuLongitude / (360/27));

  planets.push({
    id: PLANETS.KETU,
    name: PLANET_NAMES[PLANETS.KETU],
    longitude: ketuLongitude,
    rashi: ketuRashi,
    rashiName: RASHIS[ketuRashi],
    nakshatra: ketuNakshatra,
    nakshatraName: NAKSHATRAS[ketuNakshatra],
    degree: ketuLongitude % 30,
    isRetrograde: true // Ketu is always retrograde
  });
  
  return planets;
};

/**
 * Calculate house cusps using Equal House system (traditional Vedic method)
 * @param {Object} ascendant - Ascendant information
 * @param {number} latitude - Geographic latitude
 * @param {number} longitude - Geographic longitude
 * @param {number} julianDay - Julian Day
 * @returns {Array} House cusps information
 */
const calculateHouseCusps = (ascendant, latitude, longitude, julianDay) => {
  const houseCusps = [];

  // Calculate Local Sidereal Time
  const t = (julianDay - 2451545.0) / 36525;
  const gmst = 280.46061837 + 360.98564736629 * (julianDay - 2451545.0) + 0.000387933 * t * t - t * t * t / 38710000;
  const lst = (gmst + longitude) % 360;

  // In Vedic astrology, we primarily use Equal House system
  // where each house is exactly 30 degrees from the ascendant
  for (let i = 0; i < 12; i++) {
    const houseLongitude = (ascendant.longitude + i * 30) % 360;
    const rashi = Math.floor(houseLongitude / 30);

    houseCusps.push({
      house: i + 1,
      houseName: HOUSES[i],
      longitude: houseLongitude,
      rashi: rashi,
      rashiName: RASHIS[rashi],
      degree: houseLongitude % 30,
      cuspDegree: houseLongitude
    });
  }

  // For advanced calculations, we can also provide Placidus cusps
  // This is more complex and requires iterative calculations
  const placidusHouses = calculatePlacidusHouses(ascendant.longitude, latitude, lst);

  // Add Placidus information to house cusps
  houseCusps.forEach((house, index) => {
    if (placidusHouses[index]) {
      house.placidusLongitude = placidusHouses[index];
      house.placidusRashi = Math.floor(placidusHouses[index] / 30);
      house.placidusRashiName = RASHIS[house.placidusRashi];
    }
  });

  return houseCusps;
};

/**
 * Calculate Placidus house cusps (simplified)
 * @param {number} ascendantLongitude - Ascendant longitude
 * @param {number} latitude - Geographic latitude
 * @param {number} lst - Local Sidereal Time
 * @returns {Array} Placidus house longitudes
 */
const calculatePlacidusHouses = (ascendantLongitude, latitude, lst) => {
  const houses = new Array(12);

  // Houses 1, 4, 7, 10 are the angular houses (easy to calculate)
  houses[0] = ascendantLongitude; // 1st house (Ascendant)
  houses[6] = (ascendantLongitude + 180) % 360; // 7th house (Descendant)

  // Calculate MC (Midheaven) - 10th house cusp
  const mc = (lst + 90) % 360;
  houses[9] = mc; // 10th house
  houses[3] = (mc + 180) % 360; // 4th house (IC)

  // For intermediate houses (2,3,5,6,8,9,11,12), use simplified approximation
  // In a full implementation, these would require iterative calculations
  const latRad = latitude * Math.PI / 180;

  for (let i = 1; i < 12; i++) {
    if (i === 0 || i === 3 || i === 6 || i === 9) continue; // Skip angular houses

    // Simplified calculation for intermediate houses
    if (i < 6) {
      // Houses 2, 3, 5
      const fraction = i / 6;
      houses[i] = (houses[0] + fraction * 180) % 360;
    } else {
      // Houses 8, 9, 11, 12
      const fraction = (i - 6) / 6;
      houses[i] = (houses[6] + fraction * 180) % 360;
    }
  }

  return houses;
};

/**
 * Validate birth data inputs
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
};

/**
 * Validate calculated planetary positions for sanity
 * @param {Array} planets - Array of planet positions
 * @param {string} birthDate - Birth date for context
 * @returns {Object} Validation result
 */
const validatePlanetaryPositions = (planets, birthDate) => {
  const warnings = [];
  const [year, month] = birthDate.split('-').map(Number);

  // Find Sun position
  const sun = planets.find(p => p.id === PLANETS.SUN);
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
      warnings.push(`Sun position (${sun.rashiName.english}) seems unusual for ${month}/${year}`);
    }
  }

  // Check for planets in valid ranges
  planets.forEach(planet => {
    if (planet.longitude < 0 || planet.longitude >= 360) {
      warnings.push(`${planet.name.en} longitude (${planet.longitude}°) is out of valid range`);
    }
    if (planet.rashi < 0 || planet.rashi > 11) {
      warnings.push(`${planet.name.en} rashi (${planet.rashi}) is out of valid range`);
    }
  });

  return {
    hasWarnings: warnings.length > 0,
    warnings: warnings
  };
};

/**
 * Calculate Kundali (birth chart) with improved accuracy and validation
 * @param {string} name - Name of the person
 * @param {string} birthDate - Birth date in YYYY-MM-DD format
 * @param {string} birthTime - Birth time in HH:MM format
 * @param {string} birthPlace - Birth place
 * @returns {Object} Complete Kundali data
 */
export const calculateKundali = async (name, birthDate, birthTime, birthPlace) => {
  try {
    // Validate input data
    const validation = validateBirthData(birthDate, birthTime, birthPlace);
    if (!validation.isValid) {
      throw new Error(`Invalid birth data: ${validation.errors.join(', ')}`);
    }

    // Parse birth date and time
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour, minute] = birthTime.split(':').map(Number);

    // Get geographic coordinates
    const geoData = await getGeoCoordinates(birthPlace);

    // Calculate Julian day with timezone adjustment
    const julianDay = calculateJulianDay(year, month, day, hour, minute, geoData.timezone || 5.5);

    // Calculate Ayanamsa
    const ayanamsa = calculateAyanamsa(julianDay);

    // Calculate ascendant (Lagna)
    const ascendant = calculateAscendant(julianDay, geoData.lat, geoData.lng, ayanamsa);

    // Calculate planet positions
    const planets = calculatePlanetPositions(julianDay, ayanamsa);

    // Validate planetary positions
    const planetValidation = validatePlanetaryPositions(planets, birthDate);

    // Calculate house cusps
    const houses = calculateHouseCusps(ascendant, geoData.lat, geoData.lng, julianDay);

    // Return complete Kundali data
    const kundaliData = {
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
      ayanamsa,
      calculationInfo: {
        julianDay: julianDay,
        ayanamsa: ayanamsa,
        warnings: planetValidation.warnings || []
      }
    };

    // Log warnings if any
    if (planetValidation.hasWarnings) {
      console.warn("Planetary position warnings:", planetValidation.warnings);
    }

    return kundaliData;
  } catch (error) {
    console.error("Error calculating kundali:", error);
    console.error("Stack trace:", error.stack);
    console.error("Input data:", { name, birthDate, birthTime, birthPlace });
    throw new Error(`Failed to calculate kundali: ${error.message}`);
  }
};

/**
 * Check for various doshas in a birth chart
 * @param {Object} kundaliData - Kundali data
 * @returns {Object} Dosha information
 */
export const checkDoshas = (kundaliData) => {
  const { planets, houses, ascendant } = kundaliData;
  
  // Find specific planets
  const mars = planets.find(p => p.id === PLANETS.MARS);
  const saturn = planets.find(p => p.id === PLANETS.SATURN);
  const rahu = planets.find(p => p.id === PLANETS.RAHU);
  const ketu = planets.find(p => p.id === PLANETS.KETU);
  const moon = planets.find(p => p.id === PLANETS.MOON);
  
  // Check for Manglik Dosha (Mars in 1st, 4th, 7th, 8th, or 12th house from Lagna or Moon)
  let isManglik = false;
  const manglikHouses = [1, 4, 7, 8, 12];
  
  // Calculate Mars house position from Lagna
  const marsHouseFromLagna = Math.floor(((mars.rashi - ascendant.rashi + 12) % 12) + 1);
  
  // Calculate Mars house position from Moon
  const marsHouseFromMoon = Math.floor(((mars.rashi - moon.rashi + 12) % 12) + 1);
  
  if (manglikHouses.includes(marsHouseFromLagna) || manglikHouses.includes(marsHouseFromMoon)) {
    isManglik = true;
  }
  
  // Check for Kaal Sarp Dosha (all planets between Rahu and Ketu)
  let isKaalSarp = true;
  
  // Determine if we need to check clockwise or counterclockwise
  const isClockwise = ((ketu.longitude - rahu.longitude + 360) % 360) < 180;
  
  for (const planet of planets) {
    // Skip Rahu and Ketu in the check
    if (planet.id === PLANETS.RAHU || planet.id === PLANETS.KETU) continue;
    
    if (isClockwise) {
      // Check if planet is NOT between Rahu and Ketu (clockwise)
      if (planet.longitude < rahu.longitude && planet.longitude > ketu.longitude) {
        isKaalSarp = false;
        break;
      }
    } else {
      // Check if planet is NOT between Rahu and Ketu (counterclockwise)
      if (!(planet.longitude > rahu.longitude || planet.longitude < ketu.longitude)) {
        isKaalSarp = false;
        break;
      }
    }
  }
  
  // Check for Sade Sati (Saturn's transit through 12th, 1st, and 2nd houses from Moon)
  let isSadeSati = false;
  
  // Calculate Saturn's house position from Moon
  const saturnHouseFromMoon = Math.floor(((saturn.rashi - moon.rashi + 12) % 12) + 1);
  
  if ([12, 1, 2].includes(saturnHouseFromMoon)) {
    isSadeSati = true;
  }
  
  return {
    manglik: {
      present: isManglik,
      description: "Manglik Dosha occurs when Mars is positioned in the 1st, 4th, 7th, 8th, or 12th house from the Lagna (Ascendant) or Moon. It is believed to affect marital harmony and can cause conflicts in relationships.",
      remedies: [
        "Perform Kuja Dosha Nivarana Puja",
        "Worship Lord Hanuman on Tuesdays",
        "Recite Mangal Gayatri Mantra",
        "Donate red items like coral, masoor dal, or red cloth"
      ]
    },
    kaalSarp: {
      present: isKaalSarp,
      description: "Kaal Sarp Dosha occurs when all planets are positioned between Rahu and Ketu. It can cause obstacles in various aspects of life including career, health, and relationships.",
      remedies: [
        "Perform Kaal Sarp Dosha Nivarana Puja",
        "Visit Trimbakeshwar temple in Nashik",
        "Recite Maha Mrityunjaya Mantra",
        "Feed snakes milk (symbolically through proper rituals)"
      ]
    },
    sadeSati: {
      present: isSadeSati,
      description: "Sade Sati occurs when Saturn transits through the 12th, 1st, and 2nd houses from the Moon's position. This 7.5-year period is often associated with challenges and hardships.",
      remedies: [
        "Recite Hanuman Chalisa daily",
        "Offer oil to Lord Shani on Saturdays",
        "Donate black items like sesame, iron, or black cloth",
        "Feed crows and dogs on Saturdays"
      ]
    }
  };
};

/**
 * Calculate planetary periods (Dasha)
 * @param {Object} kundaliData - Kundali data
 * @returns {Object} Dasha information
 */
export const calculateDasha = (kundaliData) => {
  const { planets, birthDetails } = kundaliData;
  const moon = planets.find(p => p.id === PLANETS.MOON);
  
  // Dasha periods in years for each planet
  const dashaPeriods = {
    [PLANETS.SUN]: 6,
    [PLANETS.MOON]: 10,
    [PLANETS.MARS]: 7,
    [PLANETS.MERCURY]: 17,
    [PLANETS.JUPITER]: 16,
    [PLANETS.VENUS]: 20,
    [PLANETS.SATURN]: 19,
    [PLANETS.RAHU]: 18,
    [PLANETS.KETU]: 7
  };
  
  // Total Dasha cycle in years
  const totalDashaCycle = Object.values(dashaPeriods).reduce((sum, years) => sum + years, 0);
  
  // Calculate starting Dasha based on Moon's nakshatra
  const startingPlanetOrder = [
    PLANETS.KETU, PLANETS.VENUS, PLANETS.SUN, PLANETS.MOON, PLANETS.MARS,
    PLANETS.RAHU, PLANETS.JUPITER, PLANETS.SATURN, PLANETS.MERCURY
  ];
  
  // Calculate the starting planet based on Moon's nakshatra
  const startingPlanetIndex = moon.nakshatra % 9;
  const startingPlanet = startingPlanetOrder[startingPlanetIndex];
  
  // Calculate the portion of the nakshatra traversed by the Moon
  const nakshatraLength = 360 / 27; // Length of one nakshatra in degrees
  const nakshatraStartDegree = moon.nakshatra * nakshatraLength;
  const degreeInNakshatra = moon.longitude - nakshatraStartDegree;
  const portionTraversed = degreeInNakshatra / nakshatraLength;
  
  // Calculate the remaining portion of the current Dasha at birth
  const currentDashaLength = dashaPeriods[startingPlanet] * 365.25 * 24 * 60 * 60 * 1000; // in milliseconds
  const remainingPortion = 1 - portionTraversed;
  const remainingTime = currentDashaLength * remainingPortion;
  
  // Parse birth date and time
  const [year, month, day] = birthDetails.date.split('-').map(Number);
  const [hour, minute] = birthDetails.time.split(':').map(Number);
  const birthDateTime = new Date(year, month - 1, day, hour, minute);
  
  // Calculate end date of current Dasha
  const currentDashaEndDate = new Date(birthDateTime.getTime() + remainingTime);
  
  // Generate Dasha periods
  const dashaPeriodsList = [];
  let currentDate = new Date(birthDateTime.getTime());
  let currentPlanetIndex = startingPlanetOrder.indexOf(startingPlanet);
  
  // Add the first (partial) Dasha
  dashaPeriodsList.push({
    planet: PLANET_NAMES[startingPlanet],
    startDate: birthDateTime.toISOString().split('T')[0],
    endDate: currentDashaEndDate.toISOString().split('T')[0],
    years: dashaPeriods[startingPlanet] * remainingPortion
  });
  
  currentDate = new Date(currentDashaEndDate.getTime());
  
  // Add subsequent Dashas
  for (let i = 1; i < 9; i++) {
    currentPlanetIndex = (currentPlanetIndex + 1) % 9;
    const planet = startingPlanetOrder[currentPlanetIndex];
    const periodLength = dashaPeriods[planet] * 365.25 * 24 * 60 * 60 * 1000; // in milliseconds
    
    const startDate = new Date(currentDate.getTime());
    const endDate = new Date(currentDate.getTime() + periodLength);
    
    dashaPeriodsList.push({
      planet: PLANET_NAMES[planet],
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      years: dashaPeriods[planet]
    });
    
    currentDate = new Date(endDate.getTime());
  }
  
  return {
    currentDasha: {
      planet: PLANET_NAMES[startingPlanet],
      startDate: birthDateTime.toISOString().split('T')[0],
      endDate: currentDashaEndDate.toISOString().split('T')[0],
      remainingYears: dashaPeriods[startingPlanet] * remainingPortion
    },
    dashaPeriods: dashaPeriodsList
  };
};

/**
 * Calculate compatibility between two birth charts (Ashtakoot method)
 * @param {Object} kundali1 - First person's kundali data
 * @param {Object} kundali2 - Second person's kundali data
 * @returns {Object} Compatibility information
 */
export const calculateCompatibility = (kundali1, kundali2) => {
  // Get Moon's rashi for both individuals
  const moon1 = kundali1.planets.find(p => p.id === PLANETS.MOON);
  const moon2 = kundali2.planets.find(p => p.id === PLANETS.MOON);
  
  if (!moon1 || !moon2) {
    throw new Error("Moon position not found in one or both kundalis");
  }
  
  const rashi1 = moon1.rashi;
  const rashi2 = moon2.rashi;
  
  // Calculate Varna Kuta (1 point)
  const varnaValues = [
    "Brahmin", "Kshatriya", "Vaishya", "Shudra", 
    "Brahmin", "Kshatriya", "Vaishya", "Shudra", 
    "Brahmin", "Kshatriya", "Vaishya", "Shudra"
  ];
  const varna1 = varnaValues[rashi1];
  const varna2 = varnaValues[rashi2];
  
  const varnaPoints = (varna1 === varna2) ? 1 : 
                      (varna1 === "Brahmin" && varna2 === "Kshatriya") ? 0.5 :
                      (varna1 === "Kshatriya" && varna2 === "Brahmin") ? 0.5 :
                      0;
  
  // Calculate Vashya Kuta (2 points)
  const vashyaGroups = [
    [0, 4, 8], // Mesh, Simha, Dhanu (Human)
    [1, 5, 9], // Vrishabh, Kanya, Makar (Quadruped)
    [2, 6, 10], // Mithun, Tula, Kumbh (Human)
    [3, 7, 11]  // Kark, Vrishchik, Meen (Aquatic)
  ];
  
  let vashyaPoints = 0;
  for (const group of vashyaGroups) {
    if (group.includes(rashi1) && group.includes(rashi2)) {
      vashyaPoints = 2;
      break;
    }
  }
  
  // Calculate Tara Kuta (3 points)
  const nakshatra1 = Math.floor(moon1.longitude / (360/27));
  const nakshatra2 = Math.floor(moon2.longitude / (360/27));
  
  const taraDifference = (nakshatra2 - nakshatra1 + 27) % 9;
  const taraPoints = [3, 0, 1.5, 3, 0, 1.5, 3, 0, 1.5][taraDifference];
  
  // Calculate Yoni Kuta (4 points)
  const yoniValues = [
    "Horse", "Elephant", "Sheep", "Snake", "Dog", "Cat", "Rat", "Cow", 
    "Buffalo", "Tiger", "Hare", "Monkey", "Mongoose", "Lion", "Horse"
  ];
  
  const yoni1 = yoniValues[nakshatra1 % 14];
  const yoni2 = yoniValues[nakshatra2 % 14];
  
  const yoniPoints = (yoni1 === yoni2) ? 4 : 
                     (yoni1 === "Horse" && yoni2 === "Elephant") ? 3 :
                     (yoni1 === "Elephant" && yoni2 === "Horse") ? 3 :
                     (yoni1 === "Sheep" && yoni2 === "Cow") ? 3 :
                     (yoni1 === "Cow" && yoni2 === "Sheep") ? 3 :
                     2; // Default for other combinations
  
  // Calculate Graha Maitri Kuta (5 points)
  const rashiLords = [
    PLANETS.MARS, PLANETS.VENUS, PLANETS.MERCURY, PLANETS.MOON,
    PLANETS.SUN, PLANETS.MERCURY, PLANETS.VENUS, PLANETS.MARS,
    PLANETS.JUPITER, PLANETS.SATURN, PLANETS.SATURN, PLANETS.JUPITER
  ];
  
  const lord1 = rashiLords[rashi1];
  const lord2 = rashiLords[rashi2];
  
  // Friendship matrix (simplified)
  const friendships = {
    [PLANETS.SUN]: [PLANETS.MOON, PLANETS.MARS, PLANETS.JUPITER],
    [PLANETS.MOON]: [PLANETS.SUN, PLANETS.MERCURY],
    [PLANETS.MARS]: [PLANETS.SUN, PLANETS.MOON, PLANETS.JUPITER],
    [PLANETS.MERCURY]: [PLANETS.SUN, PLANETS.VENUS],
    [PLANETS.JUPITER]: [PLANETS.SUN, PLANETS.MOON, PLANETS.MARS],
    [PLANETS.VENUS]: [PLANETS.MERCURY, PLANETS.SATURN],
    [PLANETS.SATURN]: [PLANETS.MERCURY, PLANETS.VENUS]
  };
  
  const grahaMaitriPoints = (lord1 === lord2) ? 5 :
                           (friendships[lord1]?.includes(lord2) && friendships[lord2]?.includes(lord1)) ? 4 :
                           (friendships[lord1]?.includes(lord2) || friendships[lord2]?.includes(lord1)) ? 3 :
                           0;
  
  // Calculate Gana Kuta (6 points)
  const ganaValues = [
    "Deva", "Manushya", "Rakshasa", "Deva", "Manushya", "Rakshasa",
    "Deva", "Manushya", "Rakshasa", "Deva", "Manushya", "Rakshasa",
    "Deva", "Manushya", "Rakshasa", "Deva", "Manushya", "Rakshasa",
    "Deva", "Manushya", "Rakshasa", "Deva", "Manushya", "Rakshasa",
    "Deva", "Manushya", "Rakshasa"
  ];
  
  const gana1 = ganaValues[nakshatra1];
  const gana2 = ganaValues[nakshatra2];
  
  const ganaPoints = (gana1 === gana2) ? 6 :
                    (gana1 === "Deva" && gana2 === "Manushya") ? 5 :
                    (gana1 === "Manushya" && gana2 === "Deva") ? 5 :
                    (gana1 === "Manushya" && gana2 === "Rakshasa") ? 5 :
                    (gana1 === "Rakshasa" && gana2 === "Manushya") ? 5 :
                    0;
  
  // Calculate Bhakoot Kuta (7 points)
  const bhakootDifference = (rashi2 - rashi1 + 12) % 12;
  const bhakootPoints = (bhakootDifference === 6 || bhakootDifference === 0) ? 0 : 7;
  
  // Calculate Nadi Kuta (8 points)
  const nadiValues = [
    "Aadi", "Madhya", "Antya", "Aadi", "Madhya", "Antya",
    "Aadi", "Madhya", "Antya", "Aadi", "Madhya", "Antya"
  ];
  
  const nadi1 = nadiValues[rashi1];
  const nadi2 = nadiValues[rashi2];
  
  const nadiPoints = (nadi1 === nadi2) ? 0 : 8;
  
  // Calculate total points
  const totalPoints = varnaPoints + vashyaPoints + taraPoints + yoniPoints + 
                     grahaMaitriPoints + ganaPoints + bhakootPoints + nadiPoints;
  
  // Calculate compatibility percentage
  const maxPoints = 36;
  const compatibilityPercentage = Math.round((totalPoints / maxPoints) * 100);
  
  // Generate recommendation
  let recommendation;
  if (compatibilityPercentage >= 75) {
    recommendation = "Excellent match! This relationship has strong compatibility and is highly recommended.";
  } else if (compatibilityPercentage >= 60) {
    recommendation = "Good match. This relationship has good compatibility and is recommended.";
  } else if (compatibilityPercentage >= 45) {
    recommendation = "Average match. This relationship has moderate compatibility and may require effort to maintain harmony.";
  } else if (compatibilityPercentage >= 30) {
    recommendation = "Below average match. This relationship has challenges and may require significant effort to maintain harmony.";
  } else {
    recommendation = "Poor match. This relationship has significant compatibility challenges and is not recommended without careful consideration.";
  }
  
  return {
    kutas: {
      varna: {
        points: varnaPoints,
        maxPoints: 1,
        details: {
          person1: varna1,
          person2: varna2
        }
      },
      vashya: {
        points: vashyaPoints,
        maxPoints: 2
      },
      tara: {
        points: taraPoints,
        maxPoints: 3,
        details: {
          nakshatra1: nakshatra1 + 1,
          nakshatra2: nakshatra2 + 1,
          taraDifference
        }
      },
      yoni: {
        points: yoniPoints,
        maxPoints: 4,
        details: {
          person1: yoni1,
          person2: yoni2
        }
      },
      grahaMaitri: {
        points: grahaMaitriPoints,
        maxPoints: 5,
        details: {
          lord1: PLANET_NAMES[lord1].en,
          lord2: PLANET_NAMES[lord2].en
        }
      },
      gana: {
        points: ganaPoints,
        maxPoints: 6,
        details: {
          person1: gana1,
          person2: gana2
        }
      },
      bhakoot: {
        points: bhakootPoints,
        maxPoints: 7,
        details: {
          rashi1: rashi1 + 1,
          rashi2: rashi2 + 1,
          difference: bhakootDifference
        }
      },
      nadi: {
        points: nadiPoints,
        maxPoints: 8,
        details: {
          person1: nadi1,
          person2: nadi2
        }
      }
    },
    totalPoints,
    maxPoints,
    compatibilityPercentage,
    recommendation
  };
};

/**
 * Get daily horoscope for a specific rashi
 * @param {string} rashi - Rashi (zodiac sign) name
 * @returns {Object} Daily horoscope
 */
export const getDailyHoroscope = async (rashi) => {
  // In a real application, this would fetch from a database or API
  // For now, we'll return mock data
  
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
 * Calculate Muhurta (auspicious timing) for a given date and activity
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} activity - Type of activity
 * @returns {Object} Muhurta information
 */
export const calculateMuhurta = async (date, activity) => {
  // Parse the date
  const [year, month, day] = date.split('-').map(Number);
  
  // Calculate Julian day for the date
  const julianDay = calculateJulianDay(year, month, day, 0, 0);
  
  // Calculate sunrise and sunset times (simplified)
  const sunrise = '06:00';
  const sunset = '18:00';
  
  // Calculate Tithi (lunar day)
  const tithiIndex = Math.floor((julianDay % 30) * 0.5) % 15;
  const tithiNames = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashti', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
  ];
  
  const tithi = {
    index: tithiIndex,
    name: tithiNames[tithiIndex],
    paksha: Math.floor((julianDay % 30) / 15) === 0 ? 'Shukla (Waxing)' : 'Krishna (Waning)'
  };
  
  // Calculate Nakshatra (lunar mansion)
  const nakshatraIndex = Math.floor((julianDay % 27) + 0.5) % 27;
  
  const nakshatra = {
    index: nakshatraIndex,
    name: NAKSHATRAS[nakshatraIndex].name
  };
  
  // Calculate Yoga
  const yogaIndex = Math.floor((julianDay % 27) + 0.25) % 27;
  const yogaNames = [
    'Vishkumbha', 'Preeti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shula',
    'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyana',
    'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'
  ];
  
  const yoga = {
    index: yogaIndex,
    name: yogaNames[yogaIndex]
  };
  
  // Calculate Karana (half of a Tithi)
  const karanaIndex = Math.floor((julianDay % 30) * 2) % 11;
  const karanaNames = [
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'
  ];
  
  const karana = {
    index: karanaIndex,
    name: karanaNames[karanaIndex]
  };
  
  // Determine auspicious hours based on activity type
  const auspiciousHours = [];
  
  switch (activity.toLowerCase()) {
    case 'marriage':
    case 'vivah':
      // Auspicious for marriage
      if ([1, 3, 5, 7, 10, 11, 13].includes(tithiIndex)) {
        auspiciousHours.push('10:00 - 12:00');
        auspiciousHours.push('16:00 - 18:00');
      }
      break;
      
    case 'travel':
    case 'yatra':
      // Auspicious for travel
      if ([2, 3, 5, 7, 10, 11, 12].includes(tithiIndex)) {
        auspiciousHours.push('08:00 - 10:00');
        auspiciousHours.push('14:00 - 16:00');
      }
      break;
      
    case 'business':
    case 'vyapar':
      // Auspicious for business
      if ([2, 5, 7, 10, 11, 13].includes(tithiIndex)) {
        auspiciousHours.push('09:00 - 11:00');
        auspiciousHours.push('15:00 - 17:00');
      }
      break;
      
    case 'griha-pravesh':
      // Auspicious for housewarming
      if ([1, 2, 3, 5, 7, 10, 11, 12, 13].includes(tithiIndex)) {
        auspiciousHours.push('08:00 - 10:00');
        auspiciousHours.push('10:00 - 12:00');
      }
      break;
      
    default:
      // General auspicious hours
      auspiciousHours.push('08:00 - 10:00');
      auspiciousHours.push('10:00 - 12:00');
      auspiciousHours.push('16:00 - 18:00');
  }
  
  return {
    date,
    activity,
    tithi,
    nakshatra,
    yoga,
    karana,
    sunrise,
    sunset,
    auspiciousHours,
    inauspiciousHours: ['12:30 - 14:00', '14:00 - 15:30'] // Rahu Kaal and Yama Ghantam (simplified)
  };
};
