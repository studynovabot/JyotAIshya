import React from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';

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

interface KundaliChartProps {
  kundaliData: KundaliData;
}

// Planet abbreviations in Sanskrit/Hindi
const PLANET_ABBREVIATIONS: { [key: string]: string } = {
  'Sun': 'सू',
  'Moon': 'च',
  'Mars': 'मं',
  'Mercury': 'बु',
  'Jupiter': 'गु',
  'Venus': 'शु',
  'Saturn': 'श',
  'Rahu': 'रा',
  'Ketu': 'के'
};

// Rashi abbreviations in Hindi
const RASHI_ABBREVIATIONS: { [key: string]: string } = {
  'Aries': 'मेष',
  'Taurus': 'वृष',
  'Gemini': 'मिथुन',
  'Cancer': 'कर्क',
  'Leo': 'सिंह',
  'Virgo': 'कन्या',
  'Libra': 'तुला',
  'Scorpio': 'वृश्चिक',
  'Sagittarius': 'धनु',
  'Capricorn': 'मकर',
  'Aquarius': 'कुम्भ',
  'Pisces': 'मीन'
};

const KundaliChart: React.FC<KundaliChartProps> = ({ kundaliData }) => {
  // Safety check
  if (!kundaliData || !kundaliData.planets || !kundaliData.ascendant) {
    return (
      <VStack spacing={4}>
        <Text>Loading chart data...</Text>
      </VStack>
    );
  }

  // Group planets by house (convert 0-11 rashi index to 1-12 house number)
  const planetsByHouse: { [key: number]: Planet[] } = {};
  kundaliData.planets?.forEach(planet => {
    if (typeof planet.rashi === 'number') {
      const houseNumber = planet.rashi + 1; // Convert 0-11 to 1-12
      if (!planetsByHouse[houseNumber]) {
        planetsByHouse[houseNumber] = [];
      }
      planetsByHouse[houseNumber].push(planet);
    }
  });

  // Get planets in a house
  const getPlanetsInHouse = (houseNumber: number): string => {
    const planets = planetsByHouse[houseNumber] || [];
    if (planets.length === 0) return '';

    return planets.map(planet => {
      const planetName = planet.name?.en || 'Unknown';
      const abbrev = PLANET_ABBREVIATIONS[planetName] || planetName.substring(0, 2);
      return planet.isRetrograde ? `${abbrev}(R)` : abbrev;
    }).join('\n');
  };

  // Get house sign (for now, we'll calculate based on ascendant)
  const getHouseSign = (houseNumber: number): string => {
    // Calculate the rashi for this house based on ascendant
    const ascendantRashi = kundaliData.ascendant?.rashi;
    if (typeof ascendantRashi !== 'number') return '';
    
    const houseRashi = (ascendantRashi + houseNumber - 1) % 12;

    // Map rashi index to name
    const rashiNames = ['मेष', 'वृष', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'];
    return rashiNames[houseRashi] || '';
  };

  // House component
  const HouseBox: React.FC<{ houseNumber: number; position: { top: string; left: string }; size?: string }> = ({
    houseNumber,
    position,
    size = "120px"
  }) => {
    const planets = getPlanetsInHouse(houseNumber);
    const sign = getHouseSign(houseNumber);

    return (
      <Box
        position="absolute"
        top={position.top}
        left={position.left}
        width={size}
        height={size}
        border="1px solid"
        borderColor="maroon.600"
        bg="white"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
        p={2}
        fontSize="sm"
        fontWeight="medium"
      >
        {/* House number in top left corner */}
        <Box position="absolute" top="2px" left="2px">
          <Text fontSize="xs" color="maroon.700" fontWeight="bold">
            {houseNumber}
          </Text>
        </Box>

        {/* Sign in top right corner */}
        <Box position="absolute" top="2px" right="2px">
          <Text fontSize="xs" color="gray.600">
            {sign}
          </Text>
        </Box>

        {/* Planets in center */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          width="100%"
          mt={4}
        >
          <Text
            fontSize="sm"
            color="maroon.800"
            textAlign="center"
            lineHeight="1.2"
            fontWeight="bold"
            whiteSpace="pre-line"
          >
            {planets}
          </Text>
        </Box>
      </Box>
    );
  };

  return (
    <VStack spacing={4}>
      {/* Birth details header */}
      <Text fontSize="lg" fontWeight="bold" color="maroon.700" textAlign="center">
        {kundaliData.dateOfBirth ? new Date(kundaliData.dateOfBirth).toLocaleDateString('hi-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }) : 'Unknown Date'}, {kundaliData.placeOfBirth || 'Unknown Place'}
      </Text>

      <Box position="relative" width="500px" height="500px" mx="auto" border="2px solid" borderColor="maroon.700" bg="white">
        {/* Main chart container with traditional North Indian layout */}

      {/* House 12 - Top Left */}
      <HouseBox houseNumber={12} position={{ top: "0px", left: "0px" }} size="125px" />

      {/* House 1 - Top Center */}
      <HouseBox houseNumber={1} position={{ top: "0px", left: "125px" }} size="125px" />

      {/* House 2 - Top Center */}
      <HouseBox houseNumber={2} position={{ top: "0px", left: "250px" }} size="125px" />

      {/* House 3 - Top Right */}
      <HouseBox houseNumber={3} position={{ top: "0px", left: "375px" }} size="125px" />

      {/* House 11 - Left Top */}
      <HouseBox houseNumber={11} position={{ top: "125px", left: "0px" }} size="125px" />

      {/* House 4 - Right Top */}
      <HouseBox houseNumber={4} position={{ top: "125px", left: "375px" }} size="125px" />

      {/* House 10 - Left Bottom */}
      <HouseBox houseNumber={10} position={{ top: "250px", left: "0px" }} size="125px" />

      {/* House 5 - Right Bottom */}
      <HouseBox houseNumber={5} position={{ top: "250px", left: "375px" }} size="125px" />

      {/* House 9 - Bottom Left */}
      <HouseBox houseNumber={9} position={{ top: "375px", left: "0px" }} size="125px" />

      {/* House 8 - Bottom Center Left */}
      <HouseBox houseNumber={8} position={{ top: "375px", left: "125px" }} size="125px" />

      {/* House 7 - Bottom Center Right */}
      <HouseBox houseNumber={7} position={{ top: "375px", left: "250px" }} size="125px" />

      {/* House 6 - Bottom Right */}
      <HouseBox houseNumber={6} position={{ top: "375px", left: "375px" }} size="125px" />

      {/* Diagonal lines to create traditional diamond pattern */}
      {/* Main diagonal from top-left to bottom-right */}
      <Box
        position="absolute"
        top="0"
        left="0"
        width="707px"
        height="1px"
        bg="maroon.600"
        transform="rotate(45deg)"
        transformOrigin="0 0"
        pointerEvents="none"
      />

      {/* Main diagonal from top-right to bottom-left */}
      <Box
        position="absolute"
        top="0"
        right="0"
        width="707px"
        height="1px"
        bg="maroon.600"
        transform="rotate(-45deg)"
        transformOrigin="100% 0"
        pointerEvents="none"
      />

      {/* Ascendant marker */}
      <Box
        position="absolute"
        top="-30px"
        left="50%"
        transform="translateX(-50%)"
        bg="maroon.700"
        color="white"
        px={3}
        py={1}
        borderRadius="md"
        fontSize="sm"
        fontWeight="bold"
        textAlign="center"
      >
        Lagna: {RASHI_ABBREVIATIONS[kundaliData.ascendant?.rashiName?.english] || kundaliData.ascendant?.rashiName?.name || 'Unknown'}
        </Box>
      </Box>
    </VStack>
  );
};

export default KundaliChart;
