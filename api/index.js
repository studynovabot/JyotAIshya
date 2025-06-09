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

  // API root endpoint
  return res.status(200).json({
    message: "Welcome to JyotAIshya API",
    version: "2.0.0",
    description: "Vedic Astrology API for birth chart analysis, horoscopes, compatibility matching, and more",
    status: "running",
    serverless: true,
    platform: "Vercel",
    timestamp: new Date().toISOString(),
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
    features: [
      "Real astrological calculations",
      "Vedic birth chart generation",
      "Dosha analysis (Manglik, Kaal Sarp, Sade Sati)",
      "Dasha period calculations",
      "Compatibility matching (Ashtakoot)",
      "Daily horoscopes",
      "Geographic coordinate lookup",
      "Data validation"
    ],
    documentation: "https://github.com/your-repo/jyotaishya-api",
    support: "For support, please contact the development team"
  });
}
