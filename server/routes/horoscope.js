import express from "express";
import { getDailyHoroscope } from "../utils/astroCalculations.js";

const router = express.Router();

/**
 * @route GET /api/horoscope/daily/:rashi
 * @desc Get daily horoscope for a specific Vedic rashi (zodiac sign)
 * @access Public
 */
router.get("/daily/:rashi", async (req, res) => {
  try {
    const { rashi } = req.params;
    
    // Validate rashi (Vedic zodiac sign)
    const validRashis = [
      "mesh", "vrishabh", "mithun", "kark", 
      "simha", "kanya", "tula", "vrishchik", 
      "dhanu", "makar", "kumbh", "meen"
    ];
    
    if (!validRashis.includes(rashi.toLowerCase())) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid rashi. Please provide a valid Vedic rashi name." 
      });
    }

    // Get horoscope
    const horoscope = await getDailyHoroscope(rashi);

    res.status(200).json({
      success: true,
      data: horoscope
    });
  } catch (error) {
    console.error("Error fetching horoscope:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch horoscope", 
      error: error.message 
    });
  }
});

/**
 * @route GET /api/horoscope/rashis
 * @desc Get list of all Vedic rashis (zodiac signs)
 * @access Public
 */
router.get("/rashis", (req, res) => {
  const rashis = [
    { id: "mesh", name: "Mesh (???)", element: "Agni (Fire)", lord: "Mangal (Mars)" },
    { id: "vrishabh", name: "Vrishabh (????)", element: "Prithvi (Earth)", lord: "Shukra (Venus)" },
    { id: "mithun", name: "Mithun (?????)", element: "Vayu (Air)", lord: "Budh (Mercury)" },
    { id: "kark", name: "Kark (????)", element: "Jal (Water)", lord: "Chandra (Moon)" },
    { id: "simha", name: "Simha (????)", element: "Agni (Fire)", lord: "Surya (Sun)" },
    { id: "kanya", name: "Kanya (?????)", element: "Prithvi (Earth)", lord: "Budh (Mercury)" },
    { id: "tula", name: "Tula (????)", element: "Vayu (Air)", lord: "Shukra (Venus)" },
    { id: "vrishchik", name: "Vrishchik (???????)", element: "Jal (Water)", lord: "Mangal (Mars)" },
    { id: "dhanu", name: "Dhanu (???)", element: "Agni (Fire)", lord: "Guru (Jupiter)" },
    { id: "makar", name: "Makar (???)", element: "Prithvi (Earth)", lord: "Shani (Saturn)" },
    { id: "kumbh", name: "Kumbh (????)", element: "Vayu (Air)", lord: "Shani (Saturn)" },
    { id: "meen", name: "Meen (???)", element: "Jal (Water)", lord: "Guru (Jupiter)" }
  ];

  res.status(200).json({
    success: true,
    data: rashis
  });
});

export default router;
