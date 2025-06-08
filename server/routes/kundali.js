import express from "express";
import { calculateKundali, checkDoshas, calculateDasha } from "../utils/astroCalculationsNew.js";
import { KundaliService } from "../services/kundaliService.js";
import { authMiddleware, optionalAuthMiddleware } from "../utils/auth.js";

const router = express.Router();

/**
 * @route POST /api/kundali/generate
 * @desc Generate a Janma Kundali (birth chart) and save to database
 * @access Public (but saves to user account if authenticated)
 */
router.post("/generate", optionalAuthMiddleware, async (req, res) => {
  try {
    const { name, birthDate, birthTime, birthPlace } = req.body;

    // Validate input
    if (!name || !birthDate || !birthTime || !birthPlace) {
      return res.status(400).json({
        success: false,
        message: "कृपया सभी आवश्यक जानकारी प्रदान करें (Please provide all required fields)"
      });
    }

    // Calculate kundali
    const kundaliData = await calculateKundali(name, birthDate, birthTime, birthPlace);

    // Check for doshas
    const doshas = checkDoshas(kundaliData);

    // Calculate dasha periods
    const dashaPeriods = calculateDasha(kundaliData);

    // Prepare kundali data for database
    const kundaliForDB = {
      name,
      dateOfBirth: new Date(birthDate),
      timeOfBirth: birthTime,
      placeOfBirth: birthPlace,
      coordinates: {
        latitude: kundaliData.latitude,
        longitude: kundaliData.longitude
      },
      ascendant: kundaliData.ascendant,
      planets: kundaliData.planets,
      houses: kundaliData.houses,
      doshas,
      dashaPeriods
    };

    // If user is authenticated, save to their account
    if (req.user) {
      kundaliForDB.userId = req.user._id;

      try {
        const savedKundali = await KundaliService.createKundali(kundaliForDB);

        return res.status(201).json({
          success: true,
          data: savedKundali,
          message: "Kundali generated and saved successfully"
        });
      } catch (dbError) {
        console.error("Error saving kundali to database:", dbError);
        // Continue to return calculated data even if save fails
      }
    }

    // Return calculated data (for non-authenticated users or if save failed)
    res.status(200).json({
      success: true,
      data: {
        ...kundaliForDB,
        id: Date.now().toString() // Temporary ID for frontend
      },
      message: req.user ? "Kundali generated (save failed)" : "Kundali generated (not saved - please login to save)"
    });
  } catch (error) {
    console.error("Error generating kundali:", error);
    res.status(500).json({
      success: false,
      message: "कुंडली उत्पन्न करने में विफल (Failed to generate kundali)",
      error: error.message
    });
  }
});

/**
 * @route POST /api/kundali/dosha-check
 * @desc Check for specific doshas in a birth chart
 * @access Public
 */
router.post("/dosha-check", async (req, res) => {
  try {
    const { name, birthDate, birthTime, birthPlace, doshaTypes } = req.body;

    // Validate input
    if (!name || !birthDate || !birthTime || !birthPlace) {
      return res.status(400).json({ 
        success: false, 
        message: "कृपया सभी आवश्यक जानकारी प्रदान करें (Please provide all required fields)" 
      });
    }

    // Calculate kundali
    const kundaliData = await calculateKundali(name, birthDate, birthTime, birthPlace);
    
    // Check for specific doshas
    let doshaResults = {};
    
    if (!doshaTypes || doshaTypes.length === 0) {
      // Check all doshas if none specified
      doshaResults = checkDoshas(kundaliData);
    } else {
      // Check only specified doshas
      doshaTypes.forEach(doshaType => {
        switch(doshaType.toLowerCase()) {
          case "manglik":
          case "mangal":
            doshaResults.manglik = checkDoshas(kundaliData).manglik;
            break;
          case "kaalsarp":
          case "kalasarpa":
            doshaResults.kaalSarp = checkDoshas(kundaliData).kaalSarp;
            break;
          case "sadesati":
          case "sadhe-sati":
            doshaResults.sadeSati = checkDoshas(kundaliData).sadeSati;
            break;
          default:
            // Ignore invalid dosha types
            break;
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        name,
        doshas: doshaResults
      }
    });
  } catch (error) {
    console.error("Error checking doshas:", error);
    res.status(500).json({ 
      success: false, 
      message: "दोष जांच में त्रुटि (Error in dosha check)", 
      error: error.message 
    });
  }
});

/**
 * @route POST /api/kundali/dasha
 * @desc Calculate Dasha (planetary periods) for a birth chart
 * @access Public
 */
router.post("/dasha", async (req, res) => {
  try {
    const { name, birthDate, birthTime, birthPlace } = req.body;

    // Validate input
    if (!name || !birthDate || !birthTime || !birthPlace) {
      return res.status(400).json({ 
        success: false, 
        message: "कृपया सभी आवश्यक जानकारी प्रदान करें (Please provide all required fields)" 
      });
    }

    // Calculate kundali
    const kundaliData = await calculateKundali(name, birthDate, birthTime, birthPlace);
    
    // Calculate dasha periods
    const dashaPeriods = calculateDasha(kundaliData);

    res.status(200).json({
      success: true,
      data: {
        name,
        dashaPeriods
      }
    });
  } catch (error) {
    console.error("Error calculating dasha:", error);
    res.status(500).json({ 
      success: false, 
      message: "दशा गणना में त्रुटि (Error in dasha calculation)", 
      error: error.message 
    });
  }
});

/**
 * @route GET /api/kundali/:id
 * @desc Get a specific kundali by ID
 * @access Public (if public) / Private (if owned)
 */
router.get("/:id", optionalAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const kundali = await KundaliService.getKundaliById(id);

    if (!kundali) {
      return res.status(404).json({
        success: false,
        message: "Kundali not found"
      });
    }

    // Check if user can access this kundali
    const canAccess = kundali.isPublic ||
                     (req.user && kundali.isOwnedBy(req.user._id));

    if (!canAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    res.status(200).json({
      success: true,
      data: kundali
    });
  } catch (error) {
    console.error("Error fetching kundali:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching kundali",
      error: error.message
    });
  }
});

/**
 * @route PUT /api/kundali/:id
 * @desc Update a kundali
 * @access Private (owner only)
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const kundali = await KundaliService.getKundaliById(id);

    if (!kundali) {
      return res.status(404).json({
        success: false,
        message: "Kundali not found"
      });
    }

    // Check if user owns this kundali
    if (!kundali.isOwnedBy(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const updatedKundali = await KundaliService.updateKundali(id, updateData);

    res.status(200).json({
      success: true,
      data: updatedKundali
    });
  } catch (error) {
    console.error("Error updating kundali:", error);
    res.status(500).json({
      success: false,
      message: "Error updating kundali",
      error: error.message
    });
  }
});

/**
 * @route DELETE /api/kundali/:id
 * @desc Delete a kundali
 * @access Private (owner only)
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const kundali = await KundaliService.getKundaliById(id);

    if (!kundali) {
      return res.status(404).json({
        success: false,
        message: "Kundali not found"
      });
    }

    // Check if user owns this kundali
    if (!kundali.isOwnedBy(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    await KundaliService.deleteKundali(id);

    res.status(200).json({
      success: true,
      message: "Kundali deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting kundali:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting kundali",
      error: error.message
    });
  }
});

/**
 * @route GET /api/kundali/public/list
 * @desc Get public kundalis
 * @access Public
 */
router.get("/public/list", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const kundalis = await KundaliService.getPublicKundalis({
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      data: kundalis
    });
  } catch (error) {
    console.error("Error fetching public kundalis:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching public kundalis",
      error: error.message
    });
  }
});

export default router;
