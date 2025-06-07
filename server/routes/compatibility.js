import express from "express";
import { calculateKundali, calculateCompatibility } from "../utils/astroCalculations.js";

const router = express.Router();

/**
 * @route POST /api/compatibility/match
 * @desc Calculate compatibility between two birth charts
 * @access Public
 */
router.post("/match", async (req, res) => {
  try {
    const { person1, person2 } = req.body;
    
    // Validate input
    if (!person1 || !person2) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide details for both individuals" 
      });
    }
    
    const requiredFields = ['name', 'birthDate', 'birthTime', 'birthPlace'];
    
    for (const field of requiredFields) {
      if (!person1[field] || !person2[field]) {
        return res.status(400).json({ 
          success: false, 
          message: `Please provide ${field} for both individuals` 
        });
      }
    }
    
    // Calculate kundalis
    const kundali1 = await calculateKundali(
      person1.name,
      person1.birthDate,
      person1.birthTime,
      person1.birthPlace
    );
    
    const kundali2 = await calculateKundali(
      person2.name,
      person2.birthDate,
      person2.birthTime,
      person2.birthPlace
    );
    
    // Calculate compatibility
    const compatibility = calculateCompatibility(kundali1, kundali2);
    
    res.status(200).json({
      success: true,
      data: {
        person1: {
          name: person1.name,
          rashi: kundali1.planets.find(p => p.id === 1)?.rashiName // Moon's rashi
        },
        person2: {
          name: person2.name,
          rashi: kundali2.planets.find(p => p.id === 1)?.rashiName // Moon's rashi
        },
        compatibility
      }
    });
  } catch (error) {
    console.error("Error calculating compatibility:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error calculating compatibility", 
      error: error.message 
    });
  }
});

/**
 * @route POST /api/compatibility/guna-milan
 * @desc Calculate Guna Milan (Ashtakoot)
 * @access Public
 */
router.post("/guna-milan", async (req, res) => {
  try {
    const { person1, person2 } = req.body;
    
    // Validate input
    if (!person1 || !person2) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide details for both individuals" 
      });
    }
    
    const requiredFields = ['name', 'birthDate', 'birthTime', 'birthPlace'];
    
    for (const field of requiredFields) {
      if (!person1[field] || !person2[field]) {
        return res.status(400).json({ 
          success: false, 
          message: `Please provide ${field} for both individuals` 
        });
      }
    }
    
    // Calculate kundalis
    const kundali1 = await calculateKundali(
      person1.name,
      person1.birthDate,
      person1.birthTime,
      person1.birthPlace
    );
    
    const kundali2 = await calculateKundali(
      person2.name,
      person2.birthDate,
      person2.birthTime,
      person2.birthPlace
    );
    
    // Calculate compatibility
    const compatibility = calculateCompatibility(kundali1, kundali2);
    
    // Format response with detailed Guna Milan information
    const gunaDetails = {
      varna: {
        name: "à¤µà¤°à¥à¤£ à¤•à¥‚à¤Ÿ (Varna Kuta)",
        description: "Measures social compatibility and harmony between the couple.",
        points: compatibility.kutas.varna.points,
        maxPoints: compatibility.kutas.varna.maxPoints
      },
      vashya: {
        name: "à¤µà¤¶à¥à¤¯ à¤•à¥‚à¤Ÿ (Vashya Kuta)",
        description: "Measures mutual attraction and control in the relationship.",
        points: compatibility.kutas.vashya.points,
        maxPoints: compatibility.kutas.vashya.maxPoints
      },
      tara: {
        name: "à¤¤à¤¾à¤°à¤¾ à¤•à¥‚à¤Ÿ (Tara Kuta)",
        description: "Measures destiny compatibility and fortune of the couple.",
        points: compatibility.kutas.tara.points,
        maxPoints: compatibility.kutas.tara.maxPoints
      },
      yoni: {
        name: "à¤¯à¥‹à¤¨à¤¿ à¤•à¥‚à¤Ÿ (Yoni Kuta)",
        description: "Measures sexual compatibility and physical harmony.",
        points: compatibility.kutas.yoni.points,
        maxPoints: compatibility.kutas.yoni.maxPoints
      },
      grahaMaitri: {
        name: "à¤—à¥à¤°à¤¹ à¤®à¥ˆà¤¤à¥à¤°à¥€ à¤•à¥‚à¤Ÿ (Graha Maitri Kuta)",
        description: "Measures mental compatibility and friendship between the couple.",
        points: compatibility.kutas.grahaMaitri.points,
        maxPoints: compatibility.kutas.grahaMaitri.maxPoints
      },
      gana: {
        name: "à¤—à¤£ à¤•à¥‚à¤Ÿ (Gana Kuta)",
        description: "Measures temperament compatibility and spiritual harmony.",
        points: compatibility.kutas.gana.points,
        maxPoints: compatibility.kutas.gana.maxPoints
      },
      bhakoot: {
        name: "à¤­à¤•à¥‚à¤Ÿ (Bhakoot Kuta)",
        description: "Measures prosperity and welfare in the marriage.",
        points: compatibility.kutas.bhakoot.points,
        maxPoints: compatibility.kutas.bhakoot.maxPoints
      },
      nadi: {
        name: "à¤¨à¤¾à¤¡à¤¼à¥€ à¤•à¥‚à¤Ÿ (Nadi Kuta)",
        description: "Measures health compatibility and longevity of the relationship.",
        points: compatibility.kutas.nadi.points,
        maxPoints: compatibility.kutas.nadi.maxPoints
      }
    };
    
    res.status(200).json({
      success: true,
      data: {
        person1: {
          name: person1.name,
          rashi: kundali1.planets.find(p => p.id === 1)?.rashiName // Moon's rashi
        },
        person2: {
          name: person2.name,
          rashi: kundali2.planets.find(p => p.id === 1)?.rashiName // Moon's rashi
        },
        totalPoints: compatibility.totalPoints,
        maxPoints: 36,
        compatibilityPercentage: compatibility.compatibilityPercentage,
        recommendation: compatibility.recommendation,
        gunaDetails
      }
    });
  } catch (error) {
    console.error("Error calculating Guna Milan:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error calculating Guna Milan", 
      error: error.message 
    });
  }
});

export default router;import express from "express";
