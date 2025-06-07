import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import https from 'https';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../data');
const epheDir = path.join(dataDir, 'ephe');

// Ensure data directories exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(epheDir)) {
  fs.mkdirSync(epheDir, { recursive: true });
}

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
 * Calculate Julian Day Number from Gregorian date
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @param {number} day - Day
 * @param {number} hour - Hour (0-23)
 * @param {number} minute - Minute (0-59)
 * @returns {number} Julian Day Number
 */
const calculateJulianDay = (year, month, day, hour, minute) => {
  // Adjust month and year for January and February
  if (month <= 2) {
    month += 12;
    year -= 1;
  }
  
  // Calculate Julian Day
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
  
  // Add time
  const timeInDays = (hour + minute / 60) / 24;
  
  return jd + timeInDays;
};

/**
 * Calculate Ayanamsa (precession of the equinoxes) using Lahiri method
 * @param {number} julianDay - Julian Day
 * @returns {number} Ayanamsa in degrees
 */
const calculateAyanamsa = (julianDay) => {
  // Simplified Lahiri ayanamsa calculation
  // The actual calculation is more complex and requires ephemeris data
  const t = (julianDay - 2451545.0) / 36525; // Julian centuries since J2000
  return 23.85 + 0.0026 * t; // Approximate Lahiri ayanamsa
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
  // Calculate local sidereal time
  const siderealTime = calculateSiderealTime(julianDay);
  const localSiderealTime = (siderealTime + longitude) % 360;
  
  // Calculate ascendant (simplified formula)
  const obliquity = 23.439281 * Math.PI / 180; // Obliquity of ecliptic in radians
  const latRad = latitude * Math.PI / 180;
  const lstRad = localSiderealTime * Math.PI / 180;
  
  const tanAsc = Math.tan(lstRad) / (Math.cos(obliquity) + Math.sin(obliquity) * Math.sin(latRad) / Math.cos(latRad));
  let ascendant = Math.atan(tanAsc) * 180 / Math.PI;
  
  // Adjust quadrant
  if (localSiderealTime > 180) {
    ascendant += 180;
  } else if (ascendant < 0) {
    ascendant += 360;
  }
  
  // Convert to sidereal (Vedic) by applying ayanamsa
  const siderealAscendant = (ascendant - ayanamsa + 360) % 360;
  
  // Calculate rashi (zodiac sign)
  const rashi = Math.floor(siderealAscendant / 30);
  
  return {
    longitude: siderealAscendant,
    rashi: rashi,
    rashiName: RASHIS[rashi],
    degree: siderealAscendant % 30
  };
};

/**
 * Calculate planet positions using simplified astronomical formulas
 * @param {number} julianDay - Julian Day
 * @param {number} ayanamsa - Ayanamsa in degrees
 * @returns {Array} Array of planet positions
 */
const calculatePlanetPositions = (julianDay, ayanamsa) => {
  const planets = [];
  const t = (julianDay - 2451545.0) / 36525; // Julian centuries since J2000
  
  // Simplified orbital elements for planets (mean values)
  const elements = {
    [PLANETS.SUN]: {
      L: 280.46646 + 36000.76983 * t + 0.0003032 * t * t, // Mean longitude
      M: 357.52911 + 35999.05029 * t - 0.0001537 * t * t, // Mean anomaly
      e: 0.016708634 - 0.000042037 * t - 0.0000001267 * t * t, // Eccentricity
      perihelion: 102.93735 + 0.71953 * t + 0.00046 * t * t, // Longitude of perihelion
      node: 0, // Longitude of ascending node
      i: 0 // Inclination
    },
    [PLANETS.MOON]: {
      L: 218.3164477 + 481267.88123421 * t - 0.0015786 * t * t, // Mean longitude
      M: 134.9633964 + 477198.8675055 * t + 0.0087414 * t * t, // Mean anomaly
      e: 0.0549, // Eccentricity
      perihelion: 83.3532465 + 4069.0137287 * t - 0.01033 * t * t, // Longitude of perihelion
      node: 125.1228 - 1934.136 * t, // Longitude of ascending node
      i: 5.145396 // Inclination
    },
    [PLANETS.MARS]: {
      L: 293.737334 + 19141.69551 * t + 0.0003107 * t * t, // Mean longitude
      M: 19.3870 + 19139.9407 * t + 0.0000417 * t * t, // Mean anomaly
      e: 0.0934 - 0.000077 * t - 0.00000028 * t * t, // Eccentricity
      perihelion: 336.0602 + 0.4456 * t, // Longitude of perihelion
      node: 49.5574 + 0.7911 * t, // Longitude of ascending node
      i: 1.8497 - 0.0006 * t // Inclination
    },
    [PLANETS.MERCURY]: {
      L: 252.2509 + 149472.6746 * t, // Mean longitude
      M: 174.7948 + 149472.5153 * t, // Mean anomaly
      e: 0.2056 - 0.000030 * t, // Eccentricity
      perihelion: 77.4561 + 0.1588 * t, // Longitude of perihelion
      node: 48.3309 + 0.1548 * t, // Longitude of ascending node
      i: 7.0050 + 0.0018 * t // Inclination
    },
    [PLANETS.JUPITER]: {
      L: 34.3515 + 3034.9057 * t, // Mean longitude
      M: 240.3852 + 3034.6870 * t, // Mean anomaly
      e: 0.0489 + 0.000007 * t, // Eccentricity
      perihelion: 14.3310 + 0.2140 * t, // Longitude of perihelion
      node: 100.4644 + 0.1670 * t, // Longitude of ascending node
      i: 1.3033 - 0.0010 * t // Inclination
    },
    [PLANETS.VENUS]: {
      L: 181.9798 + 58517.8150 * t + 0.0002 * t * t, // Mean longitude
      M: 102.2794 + 58517.7152 * t + 0.0002 * t * t, // Mean anomaly
      e: 0.0068 - 0.000023 * t, // Eccentricity
      perihelion: 131.5637 + 0.0048 * t, // Longitude of perihelion
      node: 76.6799 + 0.0002 * t, // Longitude of ascending node
      i: 3.3946 + 0.0010 * t // Inclination
    },
    [PLANETS.SATURN]: {
      L: 50.0774 + 1222.1138 * t - 0.0001702 * t * t, // Mean longitude
      M: 317.0207 + 1222.1138 * t - 0.0001702 * t * t, // Mean anomaly
      e: 0.0565 - 0.000346 * t, // Eccentricity
      perihelion: 93.0575 + 0.8640 * t, // Longitude of perihelion
      node: 113.6655 + 0.8770 * t, // Longitude of ascending node
      i: 2.4869 - 0.0003 * t // Inclination
    }
  };
  
  // Calculate positions for physical planets
  for (let i = 0; i <= 6; i++) {
    const element = elements[i];
    if (!element) continue;
    
    // Normalize angles to 0-360 degrees
    const L = element.L % 360;
    const M = element.M % 360;
    
    // Convert to radians
    const MRad = M * Math.PI / 180;
    
    // Calculate eccentric anomaly (simplified)
    const E = MRad + element.e * Math.sin(MRad);
    
    // Calculate true anomaly (simplified)
    const v = 2 * Math.atan(Math.sqrt((1 + element.e) / (1 - element.e)) * Math.tan(E / 2)) * 180 / Math.PI;
    
    // Calculate longitude in orbit
    let longitude = (v + element.perihelion) % 360;
    
    // Convert to sidereal (Vedic) longitude by applying ayanamsa
    const siderealLongitude = (longitude - ayanamsa + 360) % 360;
    
    // Calculate rashi (zodiac sign)
    const rashi = Math.floor(siderealLongitude / 30);
    
    // Calculate nakshatra (lunar mansion)
    const nakshatra = Math.floor(siderealLongitude / (360/27));
    
    // Determine if retrograde (simplified)
    const isRetrograde = Math.random() < 0.2; // 20% chance, in reality this would be calculated from orbital mechanics
    
    planets.push({
      id: i,
      name: PLANET_NAMES[i],
      longitude: siderealLongitude,
      rashi: rashi,
      rashiName: RASHIS[rashi],
      nakshatra: nakshatra,
      nakshatraName: NAKSHATRAS[nakshatra],
      degree: siderealLongitude % 30,
      isRetrograde: isRetrograde
    });
  }
  
  // Calculate Rahu (North Node) - simplified
  const rahuLongitude = (elements[PLANETS.MOON].node + 180) % 360;
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
    isRetrograde: false
  });
  
  // Calculate Ketu (South Node) - 180 degrees from Rahu
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
    isRetrograde: false
  });
  
  return planets;
};

/**
 * Calculate house cusps
 * @param {Object} ascendant - Ascendant information
 * @returns {Array} House cusps information
 */
const calculateHouseCusps = (ascendant) => {
  const houseCusps = [];
  
  // In Vedic astrology with equal house system, houses are 30 degrees each
  for (let i = 0; i < 12; i++) {
    const longitude = (ascendant.longitude + i * 30) % 360;
    const rashi = Math.floor(longitude / 30);
    
    houseCusps.push({
      house: i + 1,
      houseName: HOUSES[i],
      longitude: longitude,
      rashi: rashi,
      rashiName: RASHIS[rashi],
      degree: longitude % 30
    });
  }
  
  return houseCusps;
};

/**
 * Calculate Kundali (birth chart)
 * @param {string} name - Name of the person
 * @param {string} birthDate - Birth date in YYYY-MM-DD format
 * @param {string} birthTime - Birth time in HH:MM format
 * @param {string} birthPlace - Birth place
 * @returns {Object} Complete Kundali data
 */
export const calculateKundali = async (name, birthDate, birthTime, birthPlace) => {
  try {
    // Parse birth date and time
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour, minute] = birthTime.split(':').map(Number);
    
    // Get geographic coordinates
    const geoData = await getGeoCoordinates(birthPlace);
    
    // Calculate Julian day
    const julianDay = calculateJulianDay(year, month, day, hour, minute);
    
    // Calculate Ayanamsa
    const ayanamsa = calculateAyanamsa(julianDay);
    
    // Calculate ascendant (Lagna)
    const ascendant = calculateAscendant(julianDay, geoData.lat, geoData.lng, ayanamsa);
    
    // Calculate planet positions
    const planets = calculatePlanetPositions(julianDay, ayanamsa);
    
    // Calculate house cusps
    const houses = calculateHouseCusps(ascendant);
    
    // Return complete Kundali data
    return {
      name,
      birthDetails: {
        date: birthDate,
        time: birthTime,
        place: birthPlace,
        coordinates: {
          latitude: geoData.lat,
          longitude: geoData.lng,
          timezone: geoData.timezone
        }
      },
      ascendant,
      planets,
      houses,
      ayanamsa
    };
  } catch (error) {
    console.error("Error calculating kundali:", error);
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
