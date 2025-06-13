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

interface KundaliChartProps {
  kundaliData: KundaliData;
  style?: 'north' | 'south';
}

// Planet abbreviations in both languages
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

// Rashi abbreviations in both languages
const RASHI_ABBREVIATIONS = {
  en: {
    'Aries': 'Ar',
    'Taurus': 'Ta',
    'Gemini': 'Ge',
    'Cancer': 'Ca',
    'Leo': 'Le',
    'Virgo': 'Vi',
    'Libra': 'Li',
    'Scorpio': 'Sc',
    'Sagittarius': 'Sg',
    'Capricorn': 'Cp',
    'Aquarius': 'Aq',
    'Pisces': 'Pi'
  },
  hi: {
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
    'Aquarius': 'कुंभ',
    'Pisces': 'मीन'
  }
};

const KundaliChart: React.FC<KundaliChartProps> = ({ kundaliData, style = 'north' }) => {
  const { language, t } = useLanguage();
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

  // Get planets in a house with proper formatting
  const getPlanetsInHouse = (houseNumber: number): React.ReactNode => {
    const planets = planetsByHouse[houseNumber] || [];
    if (planets.length === 0) return null;

    return (
      <VStack spacing={1} align="center">
        {planets.map((planet, index) => {
          const planetName = planet.name?.en || 'Unknown';
          const abbrev = PLANET_ABBREVIATIONS[language][planetName as keyof typeof PLANET_ABBREVIATIONS[typeof language]] || planetName.substring(0, 2);
          
          return (
            <HStack key={index} spacing={1}>
              <Text fontSize="xs" fontWeight="bold" color="red.600">
                {abbrev}
              </Text>
              {planet.isRetrograde && (
                <Badge size="xs" colorScheme="orange" fontSize="6px">
                  R
                </Badge>
              )}
            </HStack>
          );
        })}
      </VStack>
    );
  };

  // Get house sign (calculate based on ascendant)
  const getHouseSign = (houseNumber: number): string => {
    const ascendantRashi = kundaliData.ascendant?.rashi;
    if (typeof ascendantRashi !== 'number') return '';
    
    const houseRashi = (ascendantRashi + houseNumber - 1) % 12;
    const rashiNames = language === 'hi' 
      ? ['मेष', 'वृष', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन']
      : ['Ar', 'Ta', 'Ge', 'Ca', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'];
    
    return rashiNames[houseRashi] || '';
  };

  // House component with improved styling
  const HouseBox: React.FC<{ 
    houseNumber: number; 
    position: { top: string; left: string }; 
    size?: string;
    isCorner?: boolean;
  }> = ({
    houseNumber,
    position,
    size = "120px",
    isCorner = false
  }) => {
    const planets = getPlanetsInHouse(houseNumber);
    const sign = getHouseSign(houseNumber);
    const isLagnaHouse = houseNumber === 1;

    return (
      <Box
        position="absolute"
        top={position.top}
        left={position.left}
        width={size}
        height={size}
        border="2px solid"
        borderColor={isLagnaHouse ? "red.500" : "gray.600"}
        bg={isLagnaHouse ? "red.50" : "white"}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
        p={2}
        fontSize="sm"
        fontWeight="medium"
        boxShadow="sm"
        _hover={{ boxShadow: "md" }}
        transition="box-shadow 0.2s"
      >
        {/* House number in top left corner */}
        <Box position="absolute" top="4px" left="4px">
          <Text 
            fontSize="xs" 
            color={isLagnaHouse ? "red.700" : "gray.700"} 
            fontWeight="bold"
            bg={isLagnaHouse ? "red.100" : "gray.100"}
            px={1}
            borderRadius="sm"
          >
            {houseNumber}
          </Text>
        </Box>

        {/* Sign in top right corner */}
        <Box position="absolute" top="4px" right="4px">
          <Text 
            fontSize="xs" 
            color="blue.600" 
            fontWeight="semibold"
            bg="blue.50"
            px={1}
            borderRadius="sm"
          >
            {sign}
          </Text>
        </Box>

        {/* Planets in center */}
        <Flex
          direction="column"
          align="center"
          justify="center"
          height="100%"
          width="100%"
          mt={6}
          mb={2}
        >
          {planets}
        </Flex>

        {/* Lagna indicator */}
        {isLagnaHouse && (
          <Box position="absolute" bottom="2px" left="50%" transform="translateX(-50%)">
            <Badge colorScheme="red" size="xs" fontSize="6px">
              {t('chart.lagna')}
            </Badge>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <VStack spacing={6}>
      {/* Birth details header */}
      <VStack spacing={2}>
        <Text fontSize="xl" fontWeight="bold" color="maroon.700" textAlign="center">
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

      {/* Chart Container */}
      <Box position="relative" width="600px" height="600px" mx="auto" bg="white" borderRadius="lg" boxShadow="lg" p={4}>
        {/* Traditional North Indian Kundali Chart Layout */}
        
        {/* Row 1 - Top */}
        <HouseBox houseNumber={12} position={{ top: "20px", left: "20px" }} size="130px" isCorner={true} />
        <HouseBox houseNumber={1} position={{ top: "20px", left: "150px" }} size="130px" />
        <HouseBox houseNumber={2} position={{ top: "20px", left: "280px" }} size="130px" />
        <HouseBox houseNumber={3} position={{ top: "20px", left: "410px" }} size="130px" isCorner={true} />

        {/* Row 2 - Middle */}
        <HouseBox houseNumber={11} position={{ top: "150px", left: "20px" }} size="130px" />
        <HouseBox houseNumber={4} position={{ top: "150px", left: "410px" }} size="130px" />

        {/* Row 3 - Middle */}
        <HouseBox houseNumber={10} position={{ top: "280px", left: "20px" }} size="130px" />
        <HouseBox houseNumber={5} position={{ top: "280px", left: "410px" }} size="130px" />

        {/* Row 4 - Bottom */}
        <HouseBox houseNumber={9} position={{ top: "410px", left: "20px" }} size="130px" isCorner={true} />
        <HouseBox houseNumber={8} position={{ top: "410px", left: "150px" }} size="130px" />
        <HouseBox houseNumber={7} position={{ top: "410px", left: "280px" }} size="130px" />
        <HouseBox houseNumber={6} position={{ top: "410px", left: "410px" }} size="130px" isCorner={true} />

        {/* Diagonal lines for traditional diamond pattern */}
        <Box
          position="absolute"
          top="150px"
          left="150px"
          width="260px"
          height="1px"
          bg="gray.400"
          transform="rotate(45deg)"
          transformOrigin="0 0"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          top="150px"
          right="150px"
          width="260px"
          height="1px"
          bg="gray.400"
          transform="rotate(-45deg)"
          transformOrigin="100% 0"
          pointerEvents="none"
        />

        {/* Center information */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          bg="white"
          border="2px solid"
          borderColor="maroon.500"
          borderRadius="md"
          p={3}
          textAlign="center"
          boxShadow="md"
        >
          <Text fontSize="sm" fontWeight="bold" color="maroon.700">
            {t('chart.lagna')}
          </Text>
          <Text fontSize="lg" fontWeight="bold" color="maroon.800">
            {RASHI_ABBREVIATIONS[language][kundaliData.ascendant?.rashiName?.english as keyof typeof RASHI_ABBREVIATIONS[typeof language]] || 
             kundaliData.ascendant?.rashiName?.name || 'Unknown'}
          </Text>
          <Text fontSize="xs" color="gray.600">
            {kundaliData.ascendant?.degree?.toFixed(1)}°
          </Text>
        </Box>
      </Box>
    </VStack>
  );
};

export default KundaliChart;
