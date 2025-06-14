import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});

export interface BirthDetails {
  name: string;
  dateOfBirth: string; // YYYY-MM-DD format
  timeOfBirth: string; // HH:MM format
  placeOfBirth: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

export interface PlanetPosition {
  name: string;
  symbol: string;
  longitude: number;
  sign: number; // 0-11 (Aries to Pisces)
  signName: string;
  house: number; // 1-12
  degree: number;
  minute: number;
  second: number;
  isRetrograde: boolean;
}

export interface NorthIndianChartData {
  ascendant: {
    sign: number;
    signName: string;
    degree: number;
  };
  houses: {
    [houseNumber: string]: {
      sign: number;
      signName: string;
      planets: PlanetPosition[];
    };
  };
  planets: PlanetPosition[];
}

// Zodiac signs in order (0-11)
const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const ZODIAC_SIGNS_SANSKRIT = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'
];

const PLANET_SYMBOLS = {
  'Sun': 'Su',
  'Moon': 'Mo',
  'Mars': 'Ma',
  'Mercury': 'Me',
  'Jupiter': 'Ju',
  'Venus': 'Ve',
  'Saturn': 'Sa',
  'Rahu': 'Ra',
  'Ketu': 'Ke'
};

export const calculateNorthIndianChart = async (birthDetails: BirthDetails): Promise<NorthIndianChartData> => {
  try {
    const prompt = `
You are an expert Vedic astrologer. Calculate the exact North Indian Kundali chart for the following birth details:

Name: ${birthDetails.name}
Date of Birth: ${birthDetails.dateOfBirth}
Time of Birth: ${birthDetails.timeOfBirth}
Place of Birth: ${birthDetails.placeOfBirth}
${birthDetails.latitude ? `Latitude: ${birthDetails.latitude}` : ''}
${birthDetails.longitude ? `Longitude: ${birthDetails.longitude}` : ''}

Please provide the following calculations using Vedic/Sidereal astrology (NOT Western/Tropical):

1. Ascendant (Lagna) sign and exact degree
2. All 9 planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu) with:
   - Exact longitude in degrees
   - Sign placement (0-11, where 0=Aries, 1=Taurus, etc.)
   - House placement (1-12)
   - Degree within the sign
   - Retrograde status (if applicable)

3. House cusps for all 12 houses with their sign placements

Important: 
- Use Lahiri Ayanamsa for sidereal calculations
- Account for the time zone and location
- Provide exact degrees and minutes
- Use traditional Vedic house system (whole sign houses)

Return the data in this exact JSON format:
{
  "ascendant": {
    "sign": 0,
    "signName": "Aries",
    "degree": 15.5
  },
  "planets": [
    {
      "name": "Sun",
      "symbol": "Su",
      "longitude": 45.25,
      "sign": 1,
      "signName": "Taurus",
      "house": 2,
      "degree": 15,
      "minute": 15,
      "second": 0,
      "isRetrograde": false
    }
  ],
  "houses": {
    "1": {
      "sign": 0,
      "signName": "Aries",
      "planets": []
    }
  }
}

Ensure all calculations are astronomically accurate for the given date, time, and location.
`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert Vedic astrologer with deep knowledge of astronomical calculations, ephemeris data, and traditional North Indian Kundali chart construction. Provide accurate sidereal calculations using Lahiri Ayanamsa."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.1-70b-versatile",
      temperature: 0.1,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from Groq API');
    }

    // Extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const chartData = JSON.parse(jsonMatch[0]);
    
    // Validate and process the data
    return processChartData(chartData);

  } catch (error) {
    console.error('Error calculating chart with Groq:', error);
    
    // Fallback to sample data if API fails
    return getSampleChartData(birthDetails);
  }
};

const processChartData = (rawData: any): NorthIndianChartData => {
  // Process planets and assign them to houses
  const houses: { [key: string]: { sign: number; signName: string; planets: PlanetPosition[] } } = {};
  
  // Initialize all houses
  for (let i = 1; i <= 12; i++) {
    const houseSign = (rawData.ascendant.sign + i - 1) % 12;
    houses[i.toString()] = {
      sign: houseSign,
      signName: ZODIAC_SIGNS[houseSign],
      planets: []
    };
  }

  // Process planets and place them in correct houses
  const processedPlanets: PlanetPosition[] = rawData.planets.map((planet: any) => {
    const processedPlanet: PlanetPosition = {
      name: planet.name,
      symbol: PLANET_SYMBOLS[planet.name as keyof typeof PLANET_SYMBOLS] || planet.symbol,
      longitude: planet.longitude,
      sign: planet.sign,
      signName: ZODIAC_SIGNS[planet.sign],
      house: planet.house,
      degree: planet.degree,
      minute: planet.minute || 0,
      second: planet.second || 0,
      isRetrograde: planet.isRetrograde || false
    };

    // Add planet to its house
    houses[planet.house.toString()].planets.push(processedPlanet);
    
    return processedPlanet;
  });

  return {
    ascendant: {
      sign: rawData.ascendant.sign,
      signName: ZODIAC_SIGNS[rawData.ascendant.sign],
      degree: rawData.ascendant.degree
    },
    houses,
    planets: processedPlanets
  };
};

// Fallback empty chart data (used only if API fails)
const getSampleChartData = (birthDetails: BirthDetails): NorthIndianChartData => {
  const houses: { [key: string]: { sign: number; signName: string; planets: PlanetPosition[] } } = {};
  
  // Initialize empty houses
  for (let i = 1; i <= 12; i++) {
    houses[i.toString()] = {
      sign: 0,
      signName: 'Unknown',
      planets: []
    };
  }

  return {
    ascendant: {
      sign: 0,
      signName: 'Unknown',
      degree: 0
    },
    houses,
    planets: []
  };
};

// Convert chart data to the format expected by the UI component
export const convertToUIFormat = (chartData: NorthIndianChartData) => {
  const uiData = {
    ascendant: chartData.ascendant.sign + 1, // Convert 0-11 to 1-12
    planets: {} as { [key: string]: string[] }
  };

  // Initialize all houses
  for (let i = 1; i <= 12; i++) {
    uiData.planets[i.toString()] = [];
  }

  // Add planets to their respective houses
  Object.keys(chartData.houses).forEach(houseNum => {
    const house = chartData.houses[houseNum];
    uiData.planets[houseNum] = house.planets.map(planet => planet.symbol);
  });

  return uiData;
};