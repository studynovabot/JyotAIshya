import swisseph from 'swisseph';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup Swiss Ephemeris
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ephePath = path.join(__dirname, '../data/ephe');
swisseph.swe_set_ephe_path(ephePath);

// Constants for Vedic astrology
const PLANETS = {
  SUN: swisseph.SE_SUN,
  MOON: swisseph.SE_MOON,
  MARS: swisseph.SE_MARS,
  MERCURY: swisseph.SE_MERCURY,
  JUPITER: swisseph.SE_JUPITER,
  VENUS: swisseph.SE_VENUS,
  SATURN: swisseph.SE_SATURN,
  RAHU: swisseph.SE_MEAN_NODE, // North Node
  KETU: -1 // Calculated as opposite to Rahu
};

const PLANET_NAMES = {
  [PLANETS.SUN]: { en: "Sun", sa: "Surya (à¤¸à¥‚à¤°à¥à¤¯)" },
  [PLANETS.MOON]: { en: "Moon", sa: "Chandra (à¤šà¤‚à¤¦à¥à¤°)" },
  [PLANETS.MARS]: { en: "Mars", sa: "Mangal (à¤®à¤‚à¤—à¤²)" },
  [PLANETS.MERCURY]: { en: "Mercury", sa: "Budh (à¤¬à¥à¤§)" },
  [PLANETS.JUPITER]: { en: "Jupiter", sa: "Guru (à¤—à¥à¤°à¥)" },
  [PLANETS.VENUS]: { en: "Venus", sa: "Shukra (à¤¶à¥à¤•à¥à¤°)" },
  [PLANETS.SATURN]: { en: "Saturn", sa: "Shani (à¤¶à¤¨à¤¿)" },
  [PLANETS.RAHU]: { en: "Rahu", sa: "Rahu (à¤°à¤¾à¤¹à¥)" },
  [-1]: { en: "Ketu", sa: "Ketu (à¤•à¥‡à¤¤à¥)" }
};

const RASHIS = [
  { id: "mesh", name: "Mesh (à¤®à¥‡à¤·)", english: "Aries", element: "Agni (Fire)", lord: "Mangal (Mars)" },
  { id: "vrishabh", name: "Vrishabh (à¤µà¥ƒà¤·à¤­)", english: "Taurus", element: "Prithvi (Earth)", lord: "Shukra (Venus)" },
  { id: "mithun", name: "Mithun (à¤®à¤¿à¤¥à¥à¤¨)", english: "Gemini", element: "Vayu (Air)", lord: "Budh (Mercury)" },
  { id: "kark", name: "Kark (à¤•à¤°à¥à¤•)", english: "Cancer", element: "Jal (Water)", lord: "Chandra (Moon)" },
  { id: "simha", name: "Simha (à¤¸à¤¿à¤‚à¤¹)", english: "Leo", element: "Agni (Fire)", lord: "Surya (Sun)" },
  { id: "kanya", name: "Kanya (à¤•à¤¨à¥à¤¯à¤¾)", english: "Virgo", element: "Prithvi (Earth)", lord: "Budh (Mercury)" },
  { id: "tula", name: "Tula (à¤¤à¥à¤²à¤¾)", english: "Libra", element: "Vayu (Air)", lord: "Shukra (Venus)" },
  { id: "vrishchik", name: "Vrishchik (à¤µà¥ƒà¤¶à¥à¤šà¤¿à¤•)", english: "Scorpio", element: "Jal (Water)", lord: "Mangal (Mars)" },
  { id: "dhanu", name: "Dhanu (à¤§à¤¨à¥)", english: "Sagittarius", element: "Agni (Fire)", lord: "Guru (Jupiter)" },
  { id: "makar", name: "Makar (à¤®à¤•à¤°)", english: "Capricorn", element: "Prithvi (Earth)", lord: "Shani (Saturn)" },
  { id: "kumbh", name: "Kumbh (à¤•à¥à¤‚à¤­)", english: "Aquarius", element: "Vayu (Air)", lord: "Shani (Saturn)" },
  { id: "meen", name: "Meen (à¤®à¥€à¤¨)", english: "Pisces", element: "Jal (Water)", lord: "Guru (Jupiter)" }
];

// Houses in Vedic astrology
const HOUSES = [
  { number: 1, name: "Lagna (à¤²à¤—à¥à¤¨)", significations: ["Self", "Personality", "Physical body"] },
  { number: 2, name: "Dhana (à¤§à¤¨)", significations: ["Wealth", "Family", "Speech"] },
  { number: 3, name: "Sahaja (à¤¸à¤¹à¤œ)", significations: ["Siblings", "Courage", "Communication"] },
  { number: 4, name: "Sukha (à¤¸à¥à¤–)", significations: ["Happiness", "Mother", "Home"] },
  { number: 5, name: "Putra (à¤ªà¥à¤¤à¥à¤°)", significations: ["Children", "Intelligence", "Creativity"] },
  { number: 6, name: "Ripu (à¤°à¤¿à¤ªà¥)", significations: ["Enemies", "Disease", "Debt"] },
  { number: 7, name: "Yuvati (à¤¯à¥à¤µà¤¤à¤¿)", significations: ["Marriage", "Partnership", "Business"] },
  { number: 8, name: "Randhra (à¤°à¤¨à¥à¤§à¥à¤°)", significations: ["Longevity", "Obstacles", "Hidden things"] },
  { number: 9, name: "Dharma (à¤§à¤°à¥à¤®)", significations: ["Religion", "Fortune", "Father"] },
  { number: 10, name: "Karma (à¤•à¤°à¥à¤®)", significations: ["Career", "Status", "Authority"] },
  { number: 11, name: "Labha (à¤²à¤¾à¤­)", significations: ["Gains", "Income", "Desires"] },
  { number: 12, name: "Vyaya (à¤µà¥à¤¯à¤¯)", significations: ["Loss", "Expenses", "Liberation"] }
];

/**
 * Convert date and time to Julian Day
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} time - Time in HH:MM format
 * @returns {number} Julian Day
 */
const getJulianDay = (date, time) => {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  
  // Calculate Julian day
  return swisseph.swe_julday(
    year,
    month,
    day,
    hour + minute / 60,
    swisseph.SE_GREG_CAL
  );
};

/**
 * Get geographic coordinates for a location
 * @param {string} place - Name of the place
 * @returns {Object} Latitude, longitude and timezone
 */
const getGeoCoordinates = async (place) => {
  // In a real application, this would use a geocoding API
  // For now, we'll use a simple mock implementation
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
    // Default for unknown locations
    'default': { lat: 20.5937, lng: 78.9629, timezone: 5.5 } // Center of India
  };
  
  const normalizedPlace = place.toLowerCase().trim();
  return mockLocations[normalizedPlace] || mockLocations.default;
};

/**
 * Calculate Ayanamsa (precession of the equinoxes)
 * @param {number} julianDay - Julian day
 * @returns {number} Ayanamsa value
 */
const getAyanamsa = (julianDay) => {
  // Using Lahiri Ayanamsa which is standard in Indian astrology
  return swisseph.swe_get_ayanamsa(julianDay, swisseph.SE_SIDM_LAHIRI);
};

/**
 * Calculate planet positions
 * @param {number} julianDay - Julian day
 * @param {number} ayanamsa - Ayanamsa value
 * @returns {Array} Array of planet positions
 */
const calculatePlanetPositions = (julianDay, ayanamsa) => {
  const planets = [];
  
  // Calculate positions for all planets
  Object.entries(PLANETS).forEach(([name, planetId]) => {
    if (planetId === -1) {
      // Ketu is calculated as opposite to Rahu (180 degrees apart)
      const rahuPosition = planets.find(p => p.id === PLANETS.RAHU);
      if (rahuPosition) {
        const ketuLongitude = (rahuPosition.longitude + 180) % 360;
        planets.push({
          id: planetId,
          name: PLANET_NAMES[planetId],
          longitude: ketuLongitude,
          rashi: Math.floor(ketuLongitude / 30),
          rashiName: RASHIS[Math.floor(ketuLongitude / 30)],
          nakshatra: Math.floor(ketuLongitude / (360/27)),
          degree: ketuLongitude % 30
        });
      }
    } else {
      // Calculate position for other planets
      const flag = swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED;
      const result = swisseph.swe_calc_ut(julianDay, planetId, flag);
      
      if (result.error === undefined) {
        // Convert to sidereal (Vedic) longitude by applying ayanamsa
        const siderealLongitude = (result.longitude - ayanamsa + 360) % 360;
        
        planets.push({
          id: planetId,
          name: PLANET_NAMES[planetId],
          longitude: siderealLongitude,
          rashi: Math.floor(siderealLongitude / 30),
          rashiName: RASHIS[Math.floor(siderealLongitude / 30)],
          nakshatra: Math.floor(siderealLongitude / (360/27)),
          degree: siderealLongitude % 30,
          isRetrograde: result.retrograde
        });
      }
    }
  });
  
  return planets;
};

/**
 * Calculate ascendant (Lagna)
 * @param {number} julianDay - Julian day
 * @param {Object} geoData - Geographic coordinates
 * @param {number} ayanamsa - Ayanamsa value
 * @returns {Object} Ascendant information
 */
const calculateAscendant = (julianDay, geoData, ayanamsa) => {
  const { lat, lng } = geoData;
  
  // Calculate ascendant
  const flag = swisseph.SEFLG_SWIEPH;
  const houses = swisseph.swe_houses(
    julianDay,
    lat,
    lng,
    'P' // Placidus house system
  );
  
  // Convert to sidereal (Vedic) longitude by applying ayanamsa
  const siderealAscendant = (houses.ascendant - ayanamsa + 360) % 360;
  
  return {
    longitude: siderealAscendant,
    rashi: Math.floor(siderealAscendant / 30),
    rashiName: RASHIS[Math.floor(siderealAscendant / 30)],
    degree: siderealAscendant % 30
  };
};

/**
 * Calculate house cusps
 * @param {number} julianDay - Julian day
 * @param {Object} geoData - Geographic coordinates
 * @param {number} ayanamsa - Ayanamsa value
 * @returns {Array} House cusps information
 */
const calculateHouseCusps = (julianDay, geoData, ayanamsa) => {
  const { lat, lng } = geoData;
  
  // Calculate houses
  const flag = swisseph.SEFLG_SWIEPH;
  const houses = swisseph.swe_houses(
    julianDay,
    lat,
    lng,
    'P' // Placidus house system
  );
  
  const houseCusps = [];
  
  // Process each house cusp
  for (let i = 1; i <= 12; i++) {
    // Convert to sidereal (Vedic) longitude by applying ayanamsa
    const siderealLongitude = (houses.cusps[i] - ayanamsa + 360) % 360;
    
    houseCusps.push({
      house: i,
      houseName: HOUSES[i-1],
      longitude: siderealLongitude,
      rashi: Math.floor(siderealLongitude / 30),
      rashiName: RASHIS[Math.floor(siderealLongitude / 30)],
      degree: siderealLongitude % 30
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
  // Get geographic coordinates
  const geoData = await getGeoCoordinates(birthPlace);
  
  // Calculate Julian day
  const julianDay = getJulianDay(birthDate, birthTime);
  
  // Calculate Ayanamsa
  const ayanamsa = getAyanamsa(julianDay);
  
  // Calculate ascendant (Lagna)
  const ascendant = calculateAscendant(julianDay, geoData, ayanamsa);
  
  // Calculate planet positions
  const planets = calculatePlanetPositions(julianDay, ayanamsa);
  
  // Calculate house cusps
  const houses = calculateHouseCusps(julianDay, geoData, ayanamsa);
  
  // Return complete Kundali data
  return {
    name,
    birthDetails: {
      date: birthDate,
      time: birthTime,
      place: birthPlace,
      coordinates: {
        latitude: geoData.lat,
        longitude: geoData.lng
      }
    },
    ascendant,
    planets,
    houses,
    ayanamsa
  };
};

/**
 * Check for various doshas in a birth chart
 * @param {Object} kundaliData - Kundali data
 * @returns {Object} Dosha information
 */
export const checkDoshas = (kundaliData) => {
  const { planets, houses } = kundaliData;
  
  // Find specific planets
  const mars = planets.find(p => p.id === PLANETS.MARS);
  const saturn = planets.find(p => p.id === PLANETS.SATURN);
  const rahu = planets.find(p => p.id === PLANETS.RAHU);
  const ketu = planets.find(p => p.id === -1); // Ketu
  
  // Check for Manglik Dosha (Mars in 1st, 4th, 7th, 8th, or 12th house)
  const manglikHouses = [1, 4, 7, 8, 12];
  let isManglik = false;
  
  if (mars) {
    // Find which house Mars is in
    const marsHouse = houses.findIndex(house => {
      const nextHouse = houses[(houses.indexOf(house) + 1) % 12];
      return mars.longitude >= house.longitude && 
             (mars.longitude < nextHouse.longitude || 
              (nextHouse.longitude < house.longitude && 
               (mars.longitude < nextHouse.longitude || mars.longitude >= house.longitude)));
    }) + 1;
    
    isManglik = manglikHouses.includes(marsHouse);
  }
  
  // Check for Kaal Sarp Dosha (all planets between Rahu and Ketu)
  let isKaalSarp = false;
  
  if (rahu && ketu) {
    // Check if all planets are between Rahu and Ketu
    const rahuLongitude = rahu.longitude;
    const ketuLongitude = ketu.longitude;
    
    // Determine if we need to check clockwise or counterclockwise
    const isClockwise = (ketuLongitude > rahuLongitude);
    
    isKaalSarp = planets.every(planet => {
      // Skip Rahu and Ketu in the check
      if (planet.id === PLANETS.RAHU || planet.id === -1) return true;
      
      if (isClockwise) {
        return planet.longitude > rahuLongitude && planet.longitude < ketuLongitude;
      } else {
        return planet.longitude > rahuLongitude || planet.longitude < ketuLongitude;
      }
    });
  }
  
  // Check for Sade Sati (Saturn's transit through 12th, 1st, and 2nd houses from Moon)
  let isSadeSati = false;
  
  const moon = planets.find(p => p.id === PLANETS.MOON);
  if (moon && saturn) {
    const moonRashi = moon.rashi;
    const saturnRashi = saturn.rashi;
    
    // Sade Sati occurs when Saturn is in the 12th, 1st, or 2nd house from the Moon's position
    const sadeSatiRashis = [
      (moonRashi - 1 + 12) % 12, // 12th from Moon
      moonRashi,                  // 1st (same as Moon)
      (moonRashi + 1) % 12        // 2nd from Moon
    ];
    
    isSadeSati = sadeSatiRashis.includes(saturnRashi);
  }
  
  return {
    manglik: {
      present: isManglik,
      description: "Manglik Dosha occurs when Mars is positioned in the 1st, 4th, 7th, 8th, or 12th house of the birth chart. It is believed to affect marriage and partnerships.",
      remedies: isManglik ? [
        "Perform Kuja Dosha Nivaran Puja",
        "Worship Lord Hanuman on Tuesdays",
        "Recite Mangal Gayatri Mantra",
        "Donate red items on Tuesday"
      ] : []
    },
    kaalSarp: {
      present: isKaalSarp,
      description: "Kaal Sarp Dosha occurs when all planets are positioned between Rahu and Ketu. It is believed to cause obstacles and delays in life.",
      remedies: isKaalSarp ? [
        "Perform Kaal Sarp Dosha Nivaran Puja",
        "Visit Trimbakeshwar temple in Nashik",
        "Worship Lord Shiva",
        "Perform Nag Puja"
      ] : []
    },
    sadeSati: {
      present: isSadeSati,
      description: "Sade Sati occurs when Saturn transits through the 12th, 1st, and 2nd houses from the Moon's position. This period lasts for approximately 7.5 years and is believed to bring challenges and hardships.",
      remedies: isSadeSati ? [
        "Recite Hanuman Chalisa daily",
        "Offer oil to Lord Shani on Saturdays",
        "Wear a 7-faced (Saptamukhi) Rudraksha",
        "Feed crows and dogs on Saturdays",
        "Donate black items like sesame, oil, or iron"
      ] : []
    }
  };
};

/**
 * Calculate compatibility between two birth charts (Guna Milan)
 * @param {Object} kundali1 - First person's Kundali data
 * @param {Object} kundali2 - Second person's Kundali data
 * @returns {Object} Compatibility analysis
 */
export const calculateCompatibility = (kundali1, kundali2) => {
  // Extract Moon positions for both charts
  const moon1 = kundali1.planets.find(p => p.id === PLANETS.MOON);
  const moon2 = kundali2.planets.find(p => p.id === PLANETS.MOON);
  
  if (!moon1 || !moon2) {
    throw new Error("Moon position not found in one or both charts");
  }
  
  // Calculate Nakshatras (lunar mansions)
  const nakshatra1 = Math.floor(moon1.longitude / (360/27));
  const nakshatra2 = Math.floor(moon2.longitude / (360/27));
  
  // Calculate Varna (class compatibility) - 1 point
  const varnaPoints = calculateVarnaKuta(moon1.rashi, moon2.rashi);
  
  // Calculate Vashya (dominance compatibility) - 2 points
  const vashyaPoints = calculateVashyaKuta(moon1.rashi, moon2.rashi);
  
  // Calculate Tara (birth star compatibility) - 3 points
  const taraPoints = calculateTaraKuta(nakshatra1, nakshatra2);
  
  // Calculate Yoni (sexual compatibility) - 4 points
  const yoniPoints = calculateYoniKuta(nakshatra1, nakshatra2);
  
  // Calculate Graha Maitri (planetary friendship) - 5 points
  const grahaMaitriPoints = calculateGrahaMaitriKuta(moon1.rashi, moon2.rashi);
  
  // Calculate Gana (temperament compatibility) - 6 points
  const ganaPoints = calculateGanaKuta(nakshatra1, nakshatra2);
  
  // Calculate Bhakoot (zodiac compatibility) - 7 points
  const bhakootPoints = calculateBhakootKuta(moon1.rashi, moon2.rashi);
  
  // Calculate Nadi (health compatibility) - 8 points
  const nadiPoints = calculateNadiKuta(nakshatra1, nakshatra2);
  
  // Calculate total points (out of 36)
  const totalPoints = varnaPoints + vashyaPoints + taraPoints + yoniPoints + 
                      grahaMaitriPoints + ganaPoints + bhakootPoints + nadiPoints;
  
  // Determine compatibility percentage and recommendation
  const compatibilityPercentage = (totalPoints / 36) * 100;
  
  let recommendation;
  if (compatibilityPercentage >= 75) {
    recommendation = "à¤‰à¤¤à¥à¤¤à¤® (Excellent) - This match is highly auspicious and recommended.";
  } else if (compatibilityPercentage >= 60) {
    recommendation = "à¤®à¤§à¥à¤¯à¤® (Good) - This match is favorable with minor considerations.";
  } else if (compatibilityPercentage >= 45) {
    recommendation = "à¤¸à¤¾à¤§à¤¾à¤°à¤£ (Average) - This match requires careful consideration and possibly remedial measures.";
  } else {
    recommendation = "à¤•à¤·à¥à¤Ÿà¤ªà¥à¤°à¤¦ (Challenging) - This match may face significant challenges and is generally not recommended without proper remedial measures.";
  }
  
  return {
    totalPoints,
    compatibilityPercentage: Math.round(compatibilityPercentage),
    recommendation,
    kutas: {
      varna: { points: varnaPoints, maxPoints: 1, description: "Varna Kuta measures social compatibility" },
      vashya: { points: vashyaPoints, maxPoints: 2, description: "Vashya Kuta measures mutual attraction and control" },
      tara: { points: taraPoints, maxPoints: 3, description: "Tara Kuta measures destiny compatibility" },
      yoni: { points: yoniPoints, maxPoints: 4, description: "Yoni Kuta measures sexual compatibility" },
      grahaMaitri: { points: grahaMaitriPoints, maxPoints: 5, description: "Graha Maitri measures mental compatibility" },
      gana: { points: ganaPoints, maxPoints: 6, description: "Gana Kuta measures temperament compatibility" },
      bhakoot: { points: bhakootPoints, maxPoints: 7, description: "Bhakoot Kuta measures prosperity and welfare" },
      nadi: { points: nadiPoints, maxPoints: 8, description: "Nadi Kuta measures health compatibility" }
    }
  };
};

// Helper functions for Guna Milan (compatibility matching)
// These are simplified implementations - in a real application, these would be more detailed

function calculateVarnaKuta(rashi1, rashi2) {
  // Simplified Varna calculation
  const varnas = [
    [0, 1, 2, 3], // Brahmin (Mesh, Simha, Dhanu)
    [1, 2, 3, 0], // Kshatriya (Vrishabh, Kanya, Makar)
    [2, 3, 0, 1], // Vaishya (Mithun, Tula, Kumbh)
    [3, 0, 1, 2]  // Shudra (Kark, Vrishchik, Meen)
  ];
  
  const varna1 = Math.floor(rashi1 / 3) % 4;
  const varna2 = Math.floor(rashi2 / 3) % 4;
  
  return varnas[varna1][varna2] === 0 ? 1 : 0;
}

function calculateVashyaKuta(rashi1, rashi2) {
  // Simplified Vashya calculation
  const vashyaGroups = [
    [0, 4, 8], // Manav (Human)
    [1, 5, 9], // Chatushpad (Quadruped)
    [2, 6, 10], // Jalachara (Water)
    [3, 7, 11]  // Vanachara (Forest)
  ];
  
  const group1 = vashyaGroups.findIndex(group => group.includes(rashi1));
  const group2 = vashyaGroups.findIndex(group => group.includes(rashi2));
  
  if (group1 === group2) return 2;
  if ((group1 + 1) % 4 === group2) return 1;
  return 0;
}

function calculateTaraKuta(nakshatra1, nakshatra2) {
  // Calculate Tara (birth star compatibility)
  const difference = (nakshatra2 - nakshatra1 + 27) % 9;
  
  // Tara values: 1, 3, 5, 7, 9 are good (Janma, Sampat, Pratyari, Sadhaka, Mitra)
  // Tara values: 2, 4, 6, 8 are not good (Vipat, Kshema, Sadhya, Vadha)
  const goodTaras = [1, 3, 5, 7, 0]; // 0 is equivalent to 9 in modulo 9
  
  return goodTaras.includes(difference) ? 3 : 0;
}

function calculateYoniKuta(nakshatra1, nakshatra2) {
  // Simplified Yoni calculation
  // In a real application, this would use a 14x14 compatibility matrix for animal symbols
  const yoniAnimals = [
    "Horse", "Elephant", "Sheep", "Snake", "Dog", "Cat", "Rat", "Cow",
    "Buffalo", "Tiger", "Deer", "Monkey", "Mongoose", "Lion"
  ];
  
  const yoni1 = nakshatra1 % 14;
  const yoni2 = nakshatra2 % 14;
  
  // Simplified compatibility check
  if (yoni1 === yoni2) return 4; // Same animal - highest compatibility
  if (Math.abs(yoni1 - yoni2) <= 2) return 3; // Similar animals
  if (Math.abs(yoni1 - yoni2) <= 5) return 2; // Moderately compatible
  if (Math.abs(yoni1 - yoni2) <= 8) return 1; // Less compatible
  return 0; // Least compatible
}

function calculateGrahaMaitriKuta(rashi1, rashi2) {
  // Simplified Graha Maitri calculation
  // In a real application, this would use a planet friendship matrix
  const lords = [0, 1, 2, 3, 4, 2, 1, 0, 5, 6, 6, 5]; // Planet lords for each rashi
  
  const lord1 = lords[rashi1];
  const lord2 = lords[rashi2];
  
  // Simplified friendship check
  if (lord1 === lord2) return 5; // Same lord - highest compatibility
  if (Math.abs(lord1 - lord2) === 1) return 4; // Friends
  if (Math.abs(lord1 - lord2) === 2) return 3; // Neutral
  if (Math.abs(lord1 - lord2) === 3) return 1; // Enemies
  return 0; // Bitter enemies
}

function calculateGanaKuta(nakshatra1, nakshatra2) {
  // Gana (temperament) calculation
  const ganas = [
    2, 1, 0, 2, 1, 0, 2, 1, 0, // Nakshatra 1-9
    2, 1, 0, 2, 1, 0, 2, 1, 0, // Nakshatra 10-18
    2, 1, 0, 2, 1, 0, 2, 1, 0  // Nakshatra 19-27
  ];
  
  const gana1 = ganas[nakshatra1];
  const gana2 = ganas[nakshatra2];
  
  // 0: Deva (Divine), 1: Manushya (Human), 2: Rakshasa (Demon)
  if (gana1 === gana2) return 6; // Same gana
  if ((gana1 === 0 && gana2 === 1) || (gana1 === 1 && gana2 === 0)) return 5; // Deva and Manushya
  if ((gana1 === 1 && gana2 === 2) || (gana1 === 2 && gana2 === 1)) return 1; // Manushya and Rakshasa
  return 0; // Deva and Rakshasa - incompatible
}

function calculateBhakootKuta(rashi1, rashi2) {
  // Bhakoot (zodiac compatibility) calculation
  const difference = (rashi2 - rashi1 + 12) % 12;
  
  // 2nd and 12th houses are considered inauspicious for marriage
  if (difference === 2 || difference === 12) return 0;
  
  // 6th and 8th houses are also considered challenging
  if (difference === 6 || difference === 8) return 2;
  
  // Other houses are auspicious
  return 7;
}

function calculateNadiKuta(nakshatra1, nakshatra2) {
  // Nadi (health compatibility) calculation
  const nadis = [
    0, 1, 2, 0, 1, 2, 0, 1, 2, // Nakshatra 1-9
    0, 1, 2, 0, 1, 2, 0, 1, 2, // Nakshatra 10-18
    0, 1, 2, 0, 1, 2, 0, 1, 2  // Nakshatra 19-27
  ];
  
  const nadi1 = nadis[nakshatra1];
  const nadi2 = nadis[nakshatra2];
  
  // 0: Aadi (Beginning), 1: Madhya (Middle), 2: Antya (End)
  // Same Nadi is considered inauspicious for health of progeny
  if (nadi1 === nadi2) return 0;
  
  return 8; // Different Nadis are auspicious
}

/**
 * Calculate Muhurta (auspicious timing)
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} activity - Type of activity
 * @returns {Object} Auspicious timings
 */
export const calculateMuhurta = async (date, activity) => {
  // Get Julian day for the date
  const julianDay = getJulianDay(date, "00:00");
  
  // Calculate sunrise and sunset times (simplified)
  const sunrise = "06:00";
  const sunset = "18:00";
  
  // Calculate Tithi (lunar day)
  const tithi = calculateTithi(julianDay);
  
  // Calculate Nakshatra (lunar mansion)
  const nakshatra = calculateNakshatra(julianDay);
  
  // Calculate Yoga
  const yoga = calculateYoga(julianDay);
  
  // Calculate Karana (half of a Tithi)
  const karana = calculateKarana(julianDay);
  
  // Determine auspicious hours based on activity type
  const auspiciousHours = getAuspiciousHours(activity, tithi, nakshatra, yoga, karana);
  
  return {
    date,
    activity,
    tithi,
    nakshatra,
    yoga,
    karana,
    sunrise,
    sunset,
    auspiciousHours
  };
};

// Helper functions for Muhurta calculation
// These are simplified implementations - in a real application, these would be more detailed

function calculateTithi(julianDay) {
  // Simplified Tithi calculation
  // In a real application, this would calculate the angular distance between the Sun and Moon
  const tithiIndex = Math.floor((julianDay % 30) * 0.5) % 15;
  const tithiNames = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashti", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima/Amavasya"
  ];
  
  return {
    index: tithiIndex,
    name: tithiNames[tithiIndex],
    paksha: Math.floor((julianDay % 30) / 15) === 0 ? "Shukla (Waxing)" : "Krishna (Waning)"
  };
}

function calculateNakshatra(julianDay) {
  // Simplified Nakshatra calculation
  const nakshatraIndex = Math.floor((julianDay % 27) + 0.5) % 27;
  const nakshatraNames = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
    "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
  ];
  
  return {
    index: nakshatraIndex,
    name: nakshatraNames[nakshatraIndex]
  };
}

function calculateYoga(julianDay) {
  // Simplified Yoga calculation
  const yogaIndex = Math.floor((julianDay % 27) + 0.25) % 27;
  const yogaNames = [
    "Vishkumbha", "Preeti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shula",
    "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana",
    "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"
  ];
  
  return {
    index: yogaIndex,
    name: yogaNames[yogaIndex]
  };
}

function calculateKarana(julianDay) {
  // Simplified Karana calculation
  const karanaIndex = Math.floor((julianDay % 30) * 2) % 11;
  const karanaNames = [
    "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti", "Shakuni", "Chatushpada", "Naga", "Kimstughna"
  ];
  
  return {
    index: karanaIndex,
    name: karanaNames[karanaIndex]
  };
}

function getAuspiciousHours(activity, tithi, nakshatra, yoga, karana) {
  // Simplified auspicious hours calculation based on activity type
  // In a real application, this would be much more detailed
  
  const auspiciousHours = [];
  
  switch (activity.toLowerCase()) {
    case "marriage":
    case "vivah":
      // Auspicious for marriage
      if ([1, 3, 5, 7, 10, 11, 13].includes(tithi.index)) {
        auspiciousHours.push("10:00 - 12:00");
        auspiciousHours.push("16:00 - 18:00");
      }
      break;
      
    case "travel":
    case "yatra":
      // Auspicious for travel
      if ([2, 3, 5, 7, 10, 11, 12].includes(tithi.index)) {
        auspiciousHours.push("08:00 - 10:00");
        auspiciousHours.push("14:00 - 16:00");
      }
      break;
      
    case "business":
    case "vyapar":
      // Auspicious for business
      if ([2, 5, 7, 10, 11, 13].includes(tithi.index)) {
        auspiciousHours.push("09:00 - 11:00");
        auspiciousHours.push("15:00 - 17:00");
      }
      break;
      
    case "housewarming":
    case "griha pravesh":
      // Auspicious for housewarming
      if ([1, 2, 3, 5, 7, 10, 11, 12, 13].includes(tithi.index)) {
        auspiciousHours.push("08:00 - 10:00");
        auspiciousHours.push("10:00 - 12:00");
      }
      break;
      
    default:
      // General auspicious hours
      auspiciousHours.push("08:00 - 10:00");
      auspiciousHours.push("10:00 - 12:00");
      auspiciousHours.push("16:00 - 18:00");
  }
  
  return auspiciousHours;
}

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
    "à¤†à¤œ à¤†à¤ªà¤•à¥‡ à¤²à¤¿à¤ à¤¶à¥à¤­ à¤¦à¤¿à¤¨ à¤¹à¥ˆà¥¤ à¤†à¤ªà¤•à¥€ à¤Šà¤°à¥à¤œà¤¾ à¤‰à¤šà¥à¤š à¤°à¤¹à¥‡à¤—à¥€ à¤”à¤° à¤†à¤ª à¤¨à¤ à¤•à¤¾à¤°à¥à¤¯à¥‹à¤‚ à¤®à¥‡à¤‚ à¤¸à¤«à¤²à¤¤à¤¾ à¤ªà¥à¤°à¤¾à¤ªà¥à¤¤ à¤•à¤°à¥‡à¤‚à¤—à¥‡à¥¤",
    "à¤†à¤œ à¤†à¤ªà¤•à¥‹ à¤µà¤¿à¤¤à¥à¤¤à¥€à¤¯ à¤®à¤¾à¤®à¤²à¥‹à¤‚ à¤®à¥‡à¤‚ à¤¸à¤¾à¤µà¤§à¤¾à¤¨à¥€ à¤¬à¤°à¤¤à¤¨à¥‡ à¤•à¥€ à¤†à¤µà¤¶à¥à¤¯à¤•à¤¤à¤¾ à¤¹à¥ˆà¥¤ à¤ªà¤°à¤¿à¤µà¤¾à¤° à¤•à¥‡ à¤¸à¤¾à¤¥ à¤¸à¤®à¤¯ à¤¬à¤¿à¤¤à¤¾à¤à¤‚à¥¤",
    "à¤†à¤œ à¤¸à¤‚à¤šà¤¾à¤° à¤”à¤° à¤¯à¤¾à¤¤à¥à¤°à¤¾ à¤•à¥‡ à¤²à¤¿à¤ à¤…à¤šà¥à¤›à¤¾ à¤¦à¤¿à¤¨ à¤¹à¥ˆà¥¤ à¤¨à¤ à¤¸à¤‚à¤ªà¤°à¥à¤• à¤†à¤ªà¤•à¥‡ à¤²à¤¿à¤ à¤²à¤¾à¤­à¤¦à¤¾à¤¯à¤• à¤¹à¥‹à¤‚à¤—à¥‡à¥¤",
    "à¤†à¤œ à¤­à¤¾à¤µà¤¨à¤¾à¤¤à¥à¤®à¤• à¤®à¤¾à¤®à¤²à¥‹à¤‚ à¤ªà¤° à¤§à¥à¤¯à¤¾à¤¨ à¤¦à¥‡à¤‚à¥¤ à¤˜à¤° à¤”à¤° à¤ªà¤°à¤¿à¤µà¤¾à¤° à¤¸à¥‡ à¤œà¥à¤¡à¤¼à¥‡ à¤¨à¤¿à¤°à¥à¤£à¤¯ à¤¸à¤«à¤² à¤¹à¥‹à¤‚à¤—à¥‡à¥¤",
    "à¤†à¤œ à¤†à¤ª à¤°à¤šà¤¨à¤¾à¤¤à¥à¤®à¤•à¤¤à¤¾ à¤¸à¥‡ à¤­à¤°à¥‡ à¤¹à¥‹à¤‚à¤—à¥‡à¥¤ à¤ªà¥à¤°à¥‡à¤® à¤”à¤° à¤°à¥‹à¤®à¤¾à¤‚à¤¸ à¤•à¥‡ à¤²à¤¿à¤ à¤…à¤šà¥à¤›à¤¾ à¤¦à¤¿à¤¨ à¤¹à¥ˆà¥¤",
    "à¤†à¤œ à¤µà¤¿à¤¶à¥à¤²à¥‡à¤·à¤£à¤¾à¤¤à¥à¤®à¤• à¤¸à¥‹à¤š à¤†à¤ªà¤•à¥€ à¤®à¤¦à¤¦ à¤•à¤°à¥‡à¤—à¥€à¥¤ à¤¸à¥à¤µà¤¾à¤¸à¥à¤¥à¥à¤¯ à¤ªà¤° à¤µà¤¿à¤¶à¥‡à¤· à¤§à¥à¤¯à¤¾à¤¨ à¤¦à¥‡à¤‚à¥¤",
    "à¤†à¤œ à¤¸à¤¾à¤®à¤¾à¤œà¤¿à¤• à¤—à¤¤à¤¿à¤µà¤¿à¤§à¤¿à¤¯à¥‹à¤‚ à¤•à¥‡ à¤²à¤¿à¤ à¤…à¤šà¥à¤›à¤¾ à¤¦à¤¿à¤¨ à¤¹à¥ˆà¥¤ à¤¸à¤¾à¤à¥‡à¤¦à¤¾à¤°à¥€ à¤”à¤° à¤¸à¤‚à¤¬à¤‚à¤§ à¤®à¤œà¤¬à¥‚à¤¤ à¤¹à¥‹à¤‚à¤—à¥‡à¥¤",
    "à¤†à¤œ à¤—à¤¹à¤¨ à¤…à¤§à¥à¤¯à¤¯à¤¨ à¤”à¤° à¤¶à¥‹à¤§ à¤•à¥‡ à¤²à¤¿à¤ à¤…à¤šà¥à¤›à¤¾ à¤¦à¤¿à¤¨ à¤¹à¥ˆà¥¤ à¤†à¤§à¥à¤¯à¤¾à¤¤à¥à¤®à¤¿à¤• à¤µà¤¿à¤·à¤¯à¥‹à¤‚ à¤®à¥‡à¤‚ à¤°à¥à¤šà¤¿ à¤¬à¤¢à¤¼à¥‡à¤—à¥€à¥¤",
    "à¤†à¤œ à¤¯à¤¾à¤¤à¥à¤°à¤¾ à¤”à¤° à¤¶à¤¿à¤•à¥à¤·à¤¾ à¤•à¥‡ à¤²à¤¿à¤ à¤…à¤šà¥à¤›à¤¾ à¤¦à¤¿à¤¨ à¤¹à¥ˆà¥¤ à¤¦à¥‚à¤°à¤¦à¤°à¥à¤¶à¤¿à¤¤à¤¾ à¤†à¤ªà¤•à¥€ à¤®à¤¦à¤¦ à¤•à¤°à¥‡à¤—à¥€à¥¤",
    "à¤†à¤œ à¤•à¥ˆà¤°à¤¿à¤¯à¤° à¤”à¤° à¤µà¥à¤¯à¤¾à¤µà¤¸à¤¾à¤¯à¤¿à¤• à¤®à¤¾à¤®à¤²à¥‹à¤‚ à¤ªà¤° à¤§à¥à¤¯à¤¾à¤¨ à¤¦à¥‡à¤‚à¥¤ à¤…à¤§à¤¿à¤•à¤¾à¤° à¤”à¤° à¤œà¤¿à¤®à¥à¤®à¥‡à¤¦à¤¾à¤°à¥€ à¤®à¤¿à¤² à¤¸à¤•à¤¤à¥€ à¤¹à¥ˆà¥¤",
    "à¤†à¤œ à¤¨à¤µà¤¾à¤šà¤¾à¤° à¤”à¤° à¤¤à¤•à¤¨à¥€à¤•à¥€ à¤µà¤¿à¤·à¤¯à¥‹à¤‚ à¤•à¥‡ à¤²à¤¿à¤ à¤…à¤šà¥à¤›à¤¾ à¤¦à¤¿à¤¨ à¤¹à¥ˆà¥¤ à¤®à¤¿à¤¤à¥à¤°à¤¤à¤¾ à¤”à¤° à¤¸à¤¾à¤®à¤¾à¤œà¤¿à¤• à¤¸à¤‚à¤ªà¤°à¥à¤• à¤¬à¤¢à¤¼à¥‡à¤‚à¤—à¥‡à¥¤",
    "à¤†à¤œ à¤†à¤§à¥à¤¯à¤¾à¤¤à¥à¤®à¤¿à¤• à¤”à¤° à¤­à¤¾à¤µà¤¨à¤¾à¤¤à¥à¤®à¤• à¤µà¤¿à¤•à¤¾à¤¸ à¤•à¥‡ à¤²à¤¿à¤ à¤…à¤šà¥à¤›à¤¾ à¤¦à¤¿à¤¨ à¤¹à¥ˆà¥¤ à¤…à¤‚à¤¤à¤°à¥à¤œà¥à¤žà¤¾à¤¨ à¤ªà¤° à¤­à¤°à¥‹à¤¸à¤¾ à¤•à¤°à¥‡à¤‚à¥¤"
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
    advice: "à¤†à¤œ à¤•à¥‡ à¤¦à¤¿à¤¨ à¤•à¤¾ à¤†à¤¨à¤‚à¤¦ à¤²à¥‡à¤‚ à¤”à¤° à¤¸à¤•à¤¾à¤°à¤¾à¤¤à¥à¤®à¤• à¤°à¤¹à¥‡à¤‚à¥¤ (Enjoy the day and stay positive.)"
  };
};
