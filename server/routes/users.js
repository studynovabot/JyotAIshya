import express from "express";
import { registerUser, loginUser, authMiddleware } from "../utils/auth.js";
import { UserService } from "../services/userService.js";
import { KundaliService } from "../services/kundaliService.js";

const router = express.Router();

/**
 * @route POST /api/users/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide all required fields" 
      });
    }
    
    // Register user
    const { user, token } = await registerUser(name, email, password);
    
    res.status(201).json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * @route POST /api/users/login
 * @desc Login a user
 * @access Public
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide email and password" 
      });
    }
    
    // Login user
    const { user, token } = await loginUser(email, password);
    
    res.status(200).json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(401).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * @route GET /api/users/me
 * @desc Get current user
 * @access Private
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // User is already attached to req by authMiddleware
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({
      success: false,
      message: "Error getting user",
      error: error.message
    });
  }
});

/**
 * @route PUT /api/users/me
 * @desc Update current user
 * @access Private
 */
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { name, email, dateOfBirth, placeOfBirth, timeOfBirth, preferences } = req.body;

    // Update user
    const updatedUser = await UserService.updateUser(req.user._id, {
      name,
      email,
      dateOfBirth,
      placeOfBirth,
      timeOfBirth,
      preferences
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message
    });
  }
});

/**
 * @route DELETE /api/users/me
 * @desc Delete current user (soft delete)
 * @access Private
 */
router.delete("/me", authMiddleware, async (req, res) => {
  try {
    // Soft delete user
    const success = await UserService.deleteUser(req.user._id);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message
    });
  }
});

/**
 * @route GET /api/users/me/kundalis
 * @desc Get current user's kundalis
 * @access Private
 */
router.get("/me/kundalis", authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Get user's kundalis
    const kundalis = await KundaliService.getKundalisByUserId(req.user._id, {
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      data: kundalis
    });
  } catch (error) {
    console.error("Error getting kundalis:", error);
    res.status(500).json({
      success: false,
      message: "Error getting kundalis",
      error: error.message
    });
  }
});

export default router;
