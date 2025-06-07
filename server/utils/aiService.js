import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// API keys from environment variables
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const TOGETHER_AI_API_KEY = process.env.TOGETHER_AI_API_KEY;

// Base URLs for the AI services
const GROQ_API_URL = 'https://api.groq.com/openai/v1';
const TOGETHER_AI_URL = 'https://api.together.xyz/v1';

/**
 * Generate a response using Groq API
 * @param {string} prompt - The prompt to send to the AI
 * @param {string} model - The model to use (default: 'llama3-70b-8192')
 * @param {number} maxTokens - Maximum tokens to generate (default: 1024)
 * @param {number} temperature - Temperature for response generation (default: 0.7)
 * @returns {Promise<string>} - The generated text
 */
export const generateWithGroq = async (
  prompt,
  model = 'llama3-70b-8192',
  maxTokens = 1024,
  temperature = 0.7
) => {
  try {
    const response = await axios.post(
      `${GROQ_API_URL}/chat/completions`,
      {
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Groq API:', error.response?.data || error.message);
    throw new Error('Failed to generate response with Groq');
  }
};

/**
 * Generate a response using Together AI
 * @param {string} prompt - The prompt to send to the AI
 * @param {string} model - The model to use (default: 'mistralai/Mixtral-8x7B-Instruct-v0.1')
 * @param {number} maxTokens - Maximum tokens to generate (default: 1024)
 * @param {number} temperature - Temperature for response generation (default: 0.7)
 * @returns {Promise<string>} - The generated text
 */
export const generateWithTogetherAI = async (
  prompt,
  model = 'mistralai/Mixtral-8x7B-Instruct-v0.1',
  maxTokens = 1024,
  temperature = 0.7
) => {
  try {
    const response = await axios.post(
      `${TOGETHER_AI_URL}/completions`,
      {
        model,
        prompt,
        max_tokens: maxTokens,
        temperature,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOGETHER_AI_API_KEY}`
        }
      }
    );

    return response.data.choices[0].text;
  } catch (error) {
    console.error('Error calling Together AI API:', error.response?.data || error.message);
    throw new Error('Failed to generate response with Together AI');
  }
};

/**
 * Generate astrological insights using AI
 * @param {Object} data - The astrological data to analyze
 * @param {string} type - The type of analysis (e.g., 'kundali', 'horoscope', 'compatibility')
 * @param {string} preferredProvider - The preferred AI provider ('groq' or 'together')
 * @returns {Promise<string>} - The generated astrological insights
 */
export const generateAstrologicalInsights = async (data, type, preferredProvider = 'groq') => {
  // Create a prompt based on the type of analysis
  let prompt = '';
  
  switch (type) {
    case 'kundali':
      prompt = `As a Vedic astrology expert, analyze this birth chart data and provide detailed insights:
      
Name: ${data.name}
Date of Birth: ${data.dateOfBirth}
Time of Birth: ${data.timeOfBirth}
Place of Birth: ${data.placeOfBirth}
Coordinates: ${data.latitude}, ${data.longitude}

Planetary Positions:
${JSON.stringify(data.planets, null, 2)}

Houses:
${JSON.stringify(data.houses, null, 2)}

Please provide a comprehensive analysis including:
1. Overall personality traits and life path
2. Key strengths and challenges
3. Career aptitudes and financial prospects
4. Relationship patterns and compatibility indicators
5. Health predispositions
6. Important life periods and transitions
7. Spiritual path and evolution

Format the response in clear sections with headings.`;
      break;
      
    case 'horoscope':
      prompt = `As a Vedic astrology expert, provide a detailed ${data.period} horoscope for ${data.sign} sign.
      
Current planetary transits:
${JSON.stringify(data.transits, null, 2)}

Please include:
1. Overall themes and energy for this ${data.period}
2. Career and finances
3. Relationships and social life
4. Health and wellbeing
5. Spiritual growth
6. Advice and recommendations

Format the response in clear sections with headings.`;
      break;
      
    case 'compatibility':
      prompt = `As a Vedic astrology expert, analyze the compatibility between these two birth charts:
      
Person 1: ${data.person1.name}
Birth Details: ${data.person1.dateOfBirth}, ${data.person1.timeOfBirth}, ${data.person1.placeOfBirth}

Person 2: ${data.person2.name}
Birth Details: ${data.person2.dateOfBirth}, ${data.person2.timeOfBirth}, ${data.person2.placeOfBirth}

Matching Points (Ashtakoot):
${JSON.stringify(data.ashtakootPoints, null, 2)}

Please provide a comprehensive compatibility analysis including:
1. Overall compatibility score and summary
2. Emotional and mental connection
3. Communication patterns
4. Physical and romantic compatibility
5. Shared values and life goals
6. Potential challenges and how to overcome them
7. Long-term prospects

Format the response in clear sections with headings.`;
      break;
      
    default:
      prompt = `As a Vedic astrology expert, analyze this astrological data and provide insights:
      
${JSON.stringify(data, null, 2)}

Please provide a comprehensive analysis with clear sections and practical advice.`;
  }
  
  // Generate response using the preferred AI provider
  try {
    if (preferredProvider === 'groq') {
      return await generateWithGroq(prompt);
    } else {
      return await generateWithTogetherAI(prompt);
    }
  } catch (error) {
    // Fallback to the other provider if the preferred one fails
    console.warn(`Failed with ${preferredProvider}, trying alternative provider`);
    try {
      if (preferredProvider === 'groq') {
        return await generateWithTogetherAI(prompt);
      } else {
        return await generateWithGroq(prompt);
      }
    } catch (fallbackError) {
      console.error('Both AI providers failed:', fallbackError);
      throw new Error('Unable to generate astrological insights at this time');
    }
  }
};

export default {
  generateWithGroq,
  generateWithTogetherAI,
  generateAstrologicalInsights
};