// Utility to convert kundali data to North Indian chart format

interface KundaliPlanet {
  id: number;
  name: {
    en: string;
    sa: string;
  };
  longitude: number;
  rashi: number; // 0-11 index
  rashiName: {
    id: string;
    name: string;
    english: string;
    element: string;
    lord: string;
  };
  nakshatra: number;
  nakshatraName: {
    id: number;
    name: string;
    deity: string;
    symbol: string;
    ruler: string;
  };
  degree: number;
  isRetrograde: boolean;
}

interface KundaliData {
  planets: KundaliPlanet[];
  ascendant: {
    longitude: number;
    rashi: number;
    rashiName: {
      id: string;
      name: string;
      english: string;
      element: string;
      lord: string;
    };
    degree: number;
  };
}

interface ChartData {
  ascendant: number;
  planets: {
    [houseNumber: string]: string[];
  };
}

// Planet name mapping from English to abbreviations
const PLANET_ABBREVIATIONS: { [key: string]: string } = {
  'Sun': 'Su',
  'Moon': 'Mo',
  'Mars': 'Ma',
  'Mercury': 'Me',
  'Jupiter': 'Ju',
  'Venus': 'Ve',
  'Saturn': 'Sa',
  'Rahu': 'Ra',
  'Ketu': 'Ke',
  'Uranus': 'Ur',
  'Neptune': 'Ne',
  'Pluto': 'Pl'
};

// Convert rashi index (0-11) to house number (1-12)
const convertRashiToHouse = (rashiIndex: number, ascendantRashi: number): number => {
  // Calculate house number based on ascendant
  // House 1 starts from ascendant rashi
  const houseNumber = ((rashiIndex - ascendantRashi + 12) % 12) + 1;
  return houseNumber;
};

export const convertKundaliToChartData = (kundaliData: KundaliData): ChartData => {
  const chartData: ChartData = {
    ascendant: 1, // Always 1 in North Indian system
    planets: {}
  };

  // Initialize all houses as empty arrays
  for (let i = 1; i <= 12; i++) {
    chartData.planets[i.toString()] = [];
  }

  // Get ascendant rashi index
  const ascendantRashi = kundaliData.ascendant.rashi;

  // Process each planet
  kundaliData.planets.forEach(planet => {
    const planetName = planet.name.en;
    const planetAbbr = PLANET_ABBREVIATIONS[planetName] || planetName.substring(0, 2);
    
    // Convert planet's rashi to house number
    const houseNumber = convertRashiToHouse(planet.rashi, ascendantRashi);
    
    // Add planet to the appropriate house
    chartData.planets[houseNumber.toString()].push(planetAbbr);
  });

  return chartData;
};

