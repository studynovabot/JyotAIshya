import React from 'react';
import { Box, Text, VStack, HStack, Badge, Flex, Grid, GridItem } from '@chakra-ui/react';
import { useLanguage } from '../context/LanguageContext';

interface Planet {
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

interface House {
  number: number;
  sign: string;
  signLord: string;
  degree: number;
}

interface Ascendant {
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
}

interface KundaliData {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  planets: Planet[];
  houses?: House[];
  ascendant: Ascendant;
}

interface ProKeralaChartProps {
  kundaliData: KundaliData;
}

// Planet abbreviations matching ProKerala format
const PLANET_ABBREVIATIONS = {
  en: {
    'Sun': 'Su',
    'Moon': 'Mo',
    'Mars': 'Ma',
    'Mercury': 'Me',
    'Jupiter': 'Ju',
    'Venus': 'Ve',
    'Saturn': 'Sa',
    'Rahu': 'Ra',
    'Ketu': 'Ke'
  },
  hi: {
    'Sun': 'सू',
    'Moon': 'च',
    'Mars': 'मं',
    'Mercury': 'बु',
    'Jupiter': 'गु',
    'Venus': 'शु',
    'Saturn': 'श',
    'Rahu': 'रा',
    'Ketu': 'के'
  }
};

// Rashi names in Hindi (matching ProKerala)
const RASHI_NAMES_HI = [
  'मेष', 'वृष', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन'
];

const RASHI_NAMES_EN = [
  'Ar', 'Ta', 'Ge', 'Ca', 'Le', 'Vi', 
  'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'
];

const ProKeralaChart: React.FC<ProKeralaChartProps> = ({ kundaliData }) => {
  const { language, t } = useLanguage();
  
  // Safety check
  if (!kundaliData || !kundaliData.planets || !kundaliData.ascendant) {
    return (
      <VStack spacing={4}>
        <Text>Loading chart data...</Text>
      </VStack>
    );
  }

  // North Indian chart layout - Fixed house positions
  // House 1 (Lagna) is always at the top middle
  // Houses go counter-clockwise from there
  const HOUSE_POSITIONS = {
    1: { row: 0, col: 1 },  // Top middle (Lagna)
    2: { row: 0, col: 2 },  // Top right
    3: { row: 1, col: 3 },  // Right top
    4: { row: 2, col: 3 },  // Right bottom
    5: { row: 3, col: 2 },  // Bottom right
    6: { row: 3, col: 1 },  // Bottom middle
    7: { row: 3, col: 0 },  // Bottom left
    8: { row: 2, col: 0 },  // Left bottom
    9: { row: 1, col: 0 },  // Left top
    10: { row: 0, col: 0 }, // Top left
    11: { row: 1, col: 1 }, // Center left
    12: { row: 1, col: 2 }  // Center right
  };

  // Group planets by their rashi (sign)
  const planetsByRashi: { [key: number]: Planet[] } = {};
  kundaliData.planets.forEach(planet => {
    if (typeof planet.rashi === 'number') {
      if (!planetsByRashi[planet.rashi]) {
        planetsByRashi[planet.rashi] = [];
      }
      planetsByRashi[planet.rashi].push(planet);
    }
  });

  // Calculate which house each rashi falls into based on ascendant
  const getRashiHouse = (rashiIndex: number): number => {
    const ascendantRashi = kundaliData.ascendant.rashi;
    // Calculate house number (1-12) based on rashi position relative to ascendant
    let house = rashiIndex - ascendantRashi + 1;
    if (house <= 0) house += 12;
    return house;
  };

  // Get planets in a specific house
  const getPlanetsInHouse = (houseNumber: number): Planet[] => {
    const planets: Planet[] = [];
    
    // Find which rashi corresponds to this house
    const ascendantRashi = kundaliData.ascendant.rashi;
    const rashiForHouse = (ascendantRashi + houseNumber - 1) % 12;
    
    // Get planets in this rashi
    if (planetsByRashi[rashiForHouse]) {
      planets.push(...planetsByRashi[rashiForHouse]);
    }
    
    return planets;
  };

  // Get rashi name for a house
  const getRashiForHouse = (houseNumber: number): string => {
    const ascendantRashi = kundaliData.ascendant.rashi;
    const rashiIndex = (ascendantRashi + houseNumber - 1) % 12;
    return language === 'hi' ? RASHI_NAMES_HI[rashiIndex] : RASHI_NAMES_EN[rashiIndex];
  };

  // House component matching ProKerala style
  const HouseBox: React.FC<{ houseNumber: number }> = ({ houseNumber }) => {
    const planets = getPlanetsInHouse(houseNumber);
    const rashiName = getRashiForHouse(houseNumber);
    const isLagna = houseNumber === 1;
    
    return (
      <Box
        width="120px"
        height="120px"
        border="2px solid"
        borderColor="black"
        bg={isLagna ? "#ffe6e6" : "white"}
        position="relative"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        fontSize="12px"
        fontFamily="Arial, sans-serif"
      >
        {/* House number in top-left corner */}
        <Text
          position="absolute"
          top="2px"
          left="4px"
          fontSize="10px"
          fontWeight="bold"
          color="black"
        >
          {houseNumber}
        </Text>

        {/* Rashi name in top-right corner */}
        <Text
          position="absolute"
          top="2px"
          right="4px"
          fontSize="10px"
          color="blue"
          fontWeight="bold"
        >
          {rashiName}
        </Text>

        {/* Planets in center */}
        <VStack spacing={1} mt={4}>
          {planets.map((planet, index) => {
            const planetName = planet.name?.en || 'Unknown';
            const abbrev = PLANET_ABBREVIATIONS[language][planetName as keyof typeof PLANET_ABBREVIATIONS[typeof language]] || planetName.substring(0, 2);
            
            return (
              <HStack key={index} spacing={1}>
                <Text
                  fontSize="11px"
                  fontWeight="bold"
                  color="red"
                >
                  {abbrev}
                </Text>
                {planet.isRetrograde && (
                  <Text fontSize="8px" color="orange">
                    R
                  </Text>
                )}
              </HStack>
            );
          })}
        </VStack>

        {/* Lagna indicator */}
        {isLagna && (
          <Text
            position="absolute"
            bottom="2px"
            left="50%"
            transform="translateX(-50%)"
            fontSize="8px"
            fontWeight="bold"
            color="red"
            bg="white"
            px={1}
            borderRadius="2px"
          >
            Lagna
          </Text>
        )}
      </Box>
    );
  };

  return (
    <VStack spacing={6}>
      {/* Birth details header */}
      <VStack spacing={2}>
        <Text fontSize="xl" fontWeight="bold" color="black" textAlign="center">
          {kundaliData.name || 'Birth Chart'}
        </Text>
        <Text fontSize="md" color="gray.600" textAlign="center">
          {kundaliData.dateOfBirth ? new Date(kundaliData.dateOfBirth).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }) : 'Unknown Date'} • {kundaliData.timeOfBirth || 'Unknown Time'}
        </Text>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          {kundaliData.placeOfBirth || 'Unknown Place'}
        </Text>
      </VStack>

      {/* North Indian Chart Layout - ProKerala Style */}
      <Box
        width="480px"
        height="480px"
        position="relative"
        bg="white"
        border="2px solid black"
        mx="auto"
      >
        {/* Create the diamond layout using absolute positioning */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(houseNumber => {
          const pos = HOUSE_POSITIONS[houseNumber as keyof typeof HOUSE_POSITIONS];
          return (
            <Box
              key={houseNumber}
              position="absolute"
              top={`${pos.row * 120}px`}
              left={`${pos.col * 120}px`}
            >
              <HouseBox houseNumber={houseNumber} />
            </Box>
          );
        })}

        {/* Diagonal lines to create diamond pattern */}
        <svg
          position="absolute"
          top="0"
          left="0"
          width="480"
          height="480"
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        >
          {/* Main diagonal lines */}
          <line x1="0" y1="240" x2="240" y2="0" stroke="black" strokeWidth="2" />
          <line x1="240" y1="0" x2="480" y2="240" stroke="black" strokeWidth="2" />
          <line x1="480" y1="240" x2="240" y2="480" stroke="black" strokeWidth="2" />
          <line x1="240" y1="480" x2="0" y2="240" stroke="black" strokeWidth="2" />
          
          {/* Inner diamond lines */}
          <line x1="120" y1="120" x2="360" y2="120" stroke="black" strokeWidth="1" />
          <line x1="120" y1="360" x2="360" y2="360" stroke="black" strokeWidth="1" />
          <line x1="120" y1="120" x2="120" y2="360" stroke="black" strokeWidth="1" />
          <line x1="360" y1="120" x2="360" y2="360" stroke="black" strokeWidth="1" />
        </svg>
      </Box>

      {/* Chart Legend */}
      <Box mt={4} p={4} bg="gray.50" borderRadius="md" width="500px">
        <Text fontSize="sm" fontWeight="bold" mb={2}>Chart Information:</Text>
        <HStack spacing={4} flexWrap="wrap">
          <Text fontSize="xs">
            <strong>Lagna:</strong> {getRashiForHouse(1)} ({kundaliData.ascendant.degree?.toFixed(1)}°)
          </Text>
          <Text fontSize="xs">
            <strong>Birth Time:</strong> {kundaliData.timeOfBirth}
          </Text>
          <Text fontSize="xs">
            <strong>Place:</strong> {kundaliData.placeOfBirth}
          </Text>
        </HStack>
      </Box>
    </VStack>
  );
};

export default ProKeralaChart;