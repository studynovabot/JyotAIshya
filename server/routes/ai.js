import express from 'express';
import { generateAstrologicalInsights } from '../utils/aiService.js';
import { asyncHandler } from '../utils/errorHandler.js';

const router = express.Router();

/**
 * @route POST /api/ai/analyze
 * @desc Analyze astrological data using AI
 * @access Private
 */
router.post('/analyze', asyncHandler(async (req, res) => {
  const { data, type, provider = 'groq' } = req.body;
  
  if (!data || !type) {
    return res.status(400).json({
      success: false,
      message: 'Data and type are required'
    });
  }
  
  const insights = await generateAstrologicalInsights(data, type, provider);
  
  res.json({
    success: true,
    data: {
      insights,
      provider,
      type,
      timestamp: new Date().toISOString()
    }
  });
}));

/**
 * @route GET /api/ai/health
 * @desc Check AI service health
 * @access Public
 */
router.get('/health', asyncHandler(async (req, res) => {
  // Simple health check that doesn't actually call the AI APIs
  res.json({
    success: true,
    message: 'AI services are configured',
    providers: {
      groq: !!process.env.GROQ_API_KEY,
      together: !!process.env.TOGETHER_AI_API_KEY
    }
  });
}));

export default router;