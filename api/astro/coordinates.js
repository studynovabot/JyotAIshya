// Geographic Coordinates Lookup Serverless Function

// CORS headers for Vercel serverless function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true'
};

module.exports = async function handler(req, res) {
  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Allow both GET and POST requests
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use GET or POST.'
    });
  }

  try {
    // Get place from query params (GET) or body (POST)
    const place = req.method === 'GET' ? req.query.place : req.body.place;

    if (!place) {
      return res.status(400).json({
        success: false,
        message: "Please provide a place name"
      });
    }

    console.log("🌍 Looking up coordinates for:", place);

    const coordinates = await getGeoCoordinates(place);

    return res.status(200).json({
      success: true,
      place: place,
      coordinates: coordinates,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Error getting coordinates:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get coordinates",
      error: error.message
    });
  }
}

/**
 * Get geographic coordinates for a location
 * @param {string} place - Name of the place
 * @returns {Promise<Object>} Latitude, longitude and timezone
 */
async function getGeoCoordinates(place) {
  // Comprehensive location database
  const mockLocations = {
    // Major Indian Cities
    'delhi': { lat: 28.7041, lng: 77.1025, timezone: 5.5 },
    'new delhi': { lat: 28.7041, lng: 77.1025, timezone: 5.5 },
    'mumbai': { lat: 19.0760, lng: 72.8777, timezone: 5.5 },
    'kolkata': { lat: 22.5726, lng: 88.3639, timezone: 5.5 },
    'chennai': { lat: 13.0827, lng: 80.2707, timezone: 5.5 },
    'bangalore': { lat: 12.9716, lng: 77.5946, timezone: 5.5 },
    'bengaluru': { lat: 12.9716, lng: 77.5946, timezone: 5.5 },
    'hyderabad': { lat: 17.3850, lng: 78.4867, timezone: 5.5 },
    'ahmedabad': { lat: 23.0225, lng: 72.5714, timezone: 5.5 },
    'pune': { lat: 18.5204, lng: 73.8567, timezone: 5.5 },
    'jaipur': { lat: 26.9124, lng: 75.7873, timezone: 5.5 },
    'lucknow': { lat: 26.8467, lng: 80.9462, timezone: 5.5 },
    'kanpur': { lat: 26.4499, lng: 80.3319, timezone: 5.5 },
    'nagpur': { lat: 21.1458, lng: 79.0882, timezone: 5.5 },
    'indore': { lat: 22.7196, lng: 75.8577, timezone: 5.5 },
    'thane': { lat: 19.2183, lng: 72.9781, timezone: 5.5 },
    'bhopal': { lat: 23.2599, lng: 77.4126, timezone: 5.5 },
    'visakhapatnam': { lat: 17.6868, lng: 83.2185, timezone: 5.5 },
    'pimpri-chinchwad': { lat: 18.6298, lng: 73.7997, timezone: 5.5 },
    'patna': { lat: 25.5941, lng: 85.1376, timezone: 5.5 },
    'vadodara': { lat: 22.3072, lng: 73.1812, timezone: 5.5 },
    'ludhiana': { lat: 30.9010, lng: 75.8573, timezone: 5.5 },
    'agra': { lat: 27.1767, lng: 78.0081, timezone: 5.5 },
    'nashik': { lat: 19.9975, lng: 73.7898, timezone: 5.5 },
    'faridabad': { lat: 28.4089, lng: 77.3178, timezone: 5.5 },
    'meerut': { lat: 28.9845, lng: 77.7064, timezone: 5.5 },
    'rajkot': { lat: 22.3039, lng: 70.8022, timezone: 5.5 },
    'kalyan-dombivli': { lat: 19.2403, lng: 73.1305, timezone: 5.5 },
    'vasai-virar': { lat: 19.4912, lng: 72.8054, timezone: 5.5 },
    'varanasi': { lat: 25.3176, lng: 82.9739, timezone: 5.5 },
    'srinagar': { lat: 34.0837, lng: 74.7973, timezone: 5.5 },
    'aurangabad': { lat: 19.8762, lng: 75.3433, timezone: 5.5 },
    'dhanbad': { lat: 23.7957, lng: 86.4304, timezone: 5.5 },
    'amritsar': { lat: 31.6340, lng: 74.8723, timezone: 5.5 },
    'navi mumbai': { lat: 19.0330, lng: 73.0297, timezone: 5.5 },
    'allahabad': { lat: 25.4358, lng: 81.8463, timezone: 5.5 },
    'prayagraj': { lat: 25.4358, lng: 81.8463, timezone: 5.5 },
    'ranchi': { lat: 23.3441, lng: 85.3096, timezone: 5.5 },
    'howrah': { lat: 22.5958, lng: 88.2636, timezone: 5.5 },
    'coimbatore': { lat: 11.0168, lng: 76.9558, timezone: 5.5 },
    'jabalpur': { lat: 23.1815, lng: 79.9864, timezone: 5.5 },
    'gwalior': { lat: 26.2183, lng: 78.1828, timezone: 5.5 },
    'vijayawada': { lat: 16.5062, lng: 80.6480, timezone: 5.5 },
    'jodhpur': { lat: 26.2389, lng: 73.0243, timezone: 5.5 },
    'madurai': { lat: 9.9252, lng: 78.1198, timezone: 5.5 },
    'raipur': { lat: 21.2514, lng: 81.6296, timezone: 5.5 },
    'kota': { lat: 25.2138, lng: 75.8648, timezone: 5.5 },
    'chandigarh': { lat: 30.7333, lng: 76.7794, timezone: 5.5 },
    'guwahati': { lat: 26.1445, lng: 91.7362, timezone: 5.5 },
    
    // International Cities
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
}
