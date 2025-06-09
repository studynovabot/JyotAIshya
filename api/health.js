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

  // Health check endpoint
  return res.status(200).json({
    success: true,
    message: "JyotAIshya API is healthy",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    environment: "production",
    serverless: true,
    endpoints: {
      core: {
        health: "/api/health",
        info: "/api/"
      },
      kundali: {
        generate: "/api/kundali/generate",
        doshaCheck: "/api/kundali/dosha-check",
        dasha: "/api/kundali/dasha"
      },
      compatibility: {
        match: "/api/compatibility/match"
      },
      horoscope: {
        daily: "/api/horoscope/daily"
      },
      astro: {
        calculate: "/api/astro/calculate",
        validate: "/api/astro/validate",
        coordinates: "/api/astro/coordinates"
      }
    },
    totalFunctions: 10,
    status: "All serverless functions operational"
  });
}
