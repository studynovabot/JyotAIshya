import express from "express";
import { calculateKundali, checkDoshas, calculateDasha } from "../utils/astroCalculationsNew.js";

const router = express.Router();

/**
 * @route POST /api/kundali/generate
 * @desc Generate a Janma Kundali (birth chart)
 * @access Public
 */
router.post("/generate", async (req, res) => {
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

    res.status(200).json({
      success: true,
      data: {
        kundali: kundaliData,
        doshas,
        dashaPeriods
      }
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

export default router;
