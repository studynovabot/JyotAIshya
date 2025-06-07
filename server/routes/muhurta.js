import express from "express";
import { calculateMuhurta } from "../utils/astroCalculations.js";

const router = express.Router();

/**
 * @route POST /api/muhurta/calculate
 * @desc Calculate auspicious timing (Muhurta)
 * @access Public
 */
router.post("/calculate", async (req, res) => {
  try {
    const { date, activity } = req.body;
    
    // Validate input
    if (!date) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide a date" 
      });
    }
    
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide date in YYYY-MM-DD format" 
      });
    }
    
    // Calculate muhurta
    const muhurta = await calculateMuhurta(date, activity || "general");
    
    res.status(200).json({
      success: true,
      data: muhurta
    });
  } catch (error) {
    console.error("Error calculating muhurta:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error calculating muhurta", 
      error: error.message 
    });
  }
});

/**
 * @route GET /api/muhurta/activities
 * @desc Get list of activities for muhurta calculation
 * @access Public
 */
router.get("/activities", (req, res) => {
  const activities = [
    {
      id: "general",
      name: "General (सामान्य)",
      description: "General auspicious timings for any activity"
    },
    {
      id: "marriage",
      name: "Marriage (विवाह)",
      description: "Auspicious timings for wedding ceremonies"
    },
    {
      id: "travel",
      name: "Travel (यात्रा)",
      description: "Auspicious timings for starting a journey"
    },
    {
      id: "business",
      name: "Business (व्यापार)",
      description: "Auspicious timings for business activities"
    },
    {
      id: "griha-pravesh",
      name: "Housewarming (गृह प्रवेश)",
      description: "Auspicious timings for entering a new house"
    },
    {
      id: "naming-ceremony",
      name: "Naming Ceremony (नामकरण)",
      description: "Auspicious timings for naming a child"
    },
    {
      id: "vehicle-purchase",
      name: "Vehicle Purchase (वाहन खरीद)",
      description: "Auspicious timings for purchasing a vehicle"
    },
    {
      id: "education",
      name: "Education (शिक्षा)",
      description: "Auspicious timings for starting education"
    }
  ];
  
  res.status(200).json({
    success: true,
    data: activities
  });
});

/**
 * @route GET /api/muhurta/panchang/:date
 * @desc Get Panchang (Hindu almanac) for a specific date
 * @access Public
 */
router.get("/panchang/:date", async (req, res) => {
  try {
    const { date } = req.params;
    
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide date in YYYY-MM-DD format" 
      });
    }
    
    // Calculate muhurta (which includes panchang details)
    const muhurta = await calculateMuhurta(date, "general");
    
    // Extract panchang details
    const panchang = {
      date,
      tithi: muhurta.tithi,
      nakshatra: muhurta.nakshatra,
      yoga: muhurta.yoga,
      karana: muhurta.karana,
      sunrise: muhurta.sunrise,
      sunset: muhurta.sunset
    };
    
    res.status(200).json({
      success: true,
      data: panchang
    });
  } catch (error) {
    console.error("Error calculating panchang:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error calculating panchang", 
      error: error.message 
    });
  }
});

export default router;import express from "express";
import { calculateMuhurta } from "../utils/astroCalculations.js";

const router = express.Router();

/**
 * @route POST /api/muhurta/calculate
 * @desc Calculate auspicious timing (Muhurta)
 * @access Public
 */
router.post("/calculate", async (req, res) => {
  try {
    const { date, activity } = req.body;
    
    // Validate input
    if (!date) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide a date" 
      });
    }
    
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide date in YYYY-MM-DD format" 
      });
    }
    
    // Calculate muhurta
    const muhurta = await calculateMuhurta(date, activity || "general");
    
    res.status(200).json({
      success: true,
      data: muhurta
    });
  } catch (error) {
    console.error("Error calculating muhurta:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error calculating muhurta", 
      error: error.message 
    });
  }
});

/**
 * @route GET /api/muhurta/activities
 * @desc Get list of activities for muhurta calculation
 * @access Public
 */
router.get("/activities", (req, res) => {
  const activities = [
    {
      id: "general",
      name: "General (सामान्य)",
      description: "General auspicious timings for any activity"
    },
    {
      id: "marriage",
      name: "Marriage (विवाह)",
      description: "Auspicious timings for wedding ceremonies"
    },
    {
      id: "travel",
      name: "Travel (यात्रा)",
      description: "Auspicious timings for starting a journey"
    },
    {
      id: "business",
      name: "Business (व्यापार)",
      description: "Auspicious timings for business activities"
    },
    {
      id: "griha-pravesh",
      name: "Housewarming (गृह प्रवेश)",
      description: "Auspicious timings for entering a new house"
    },
    {
      id: "naming-ceremony",
      name: "Naming Ceremony (नामकरण)",
      description: "Auspicious timings for naming a child"
    },
    {
      id: "vehicle-purchase",
      name: "Vehicle Purchase (वाहन खरीद)",
      description: "Auspicious timings for purchasing a vehicle"
    },
    {
      id: "education",
      name: "Education (शिक्षा)",
      description: "Auspicious timings for starting education"
    }
  ];
  
  res.status(200).json({
    success: true,
    data: activities
  });
});

/**
 * @route GET /api/muhurta/panchang/:date
 * @desc Get Panchang (Hindu almanac) for a specific date
 * @access Public
 */
router.get("/panchang/:date", async (req, res) => {
  try {
    const { date } = req.params;
    
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide date in YYYY-MM-DD format" 
      });
    }
    
    // Calculate muhurta (which includes panchang details)
    const muhurta = await calculateMuhurta(date, "general");
    
    // Extract panchang details
    const panchang = {
      date,
      tithi: muhurta.tithi,
      nakshatra: muhurta.nakshatra,
      yoga: muhurta.yoga,
      karana: muhurta.karana,
      sunrise: muhurta.sunrise,
      sunset: muhurta.sunset
    };
    
    res.status(200).json({
      success: true,
      data: panchang
    });
  } catch (error) {
    console.error("Error calculating panchang:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error calculating panchang", 
      error: error.message 
    });
  }
});

export default router;