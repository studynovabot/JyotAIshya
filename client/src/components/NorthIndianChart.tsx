import React from 'react';
import { Box, Text, Tooltip } from '@chakra-ui/react';
import './NorthIndianChart.css';

interface ChartData {
  ascendant: number;
  planets: {
    [houseNumber: string]: string[];
  };
}

interface NorthIndianChartProps {
  data: ChartData;
  size?: number;
  showTooltips?: boolean;
}

const PLANET_NAMES: { [key: string]: string } = {
  'Su': 'Sun (Surya)',
  'Mo': 'Moon (Chandra)',
  'Ma': 'Mars (Mangal)',
  'Me': 'Mercury (Budh)',
  'Ju': 'Jupiter (Guru)',
  'Ve': 'Venus (Shukra)',
  'Sa': 'Saturn (Shani)',
  'Ra': 'Rahu',
  'Ke': 'Ketu'
};

// Traditional North Indian Chart Layout
// Houses are FIXED in position, signs rotate based on ascendant
const HOUSE_POSITIONS = {
  1: { top: '0%', left: '33.33%', width: '33.33%', height: '25%' },      // Top center
  2: { top: '0%', left: '66.66%', width: '33.33%', height: '25%' },      // Top right
  3: { top: '25%', left: '75%', width: '25%', height: '25%' },           // Right top
  4: { top: '50%', left: '75%', width: '25%', height: '25%' },           // Right bottom
  5: { top: '75%', left: '66.66%', width: '33.33%', height: '25%' },     // Bottom right
  6: { top: '75%', left: '33.33%', width: '33.33%', height: '25%' },     // Bottom center
  7: { top: '75%', left: '0%', width: '33.33%', height: '25%' },         // Bottom left
  8: { top: '50%', left: '0%', width: '25%', height: '25%' },            // Left bottom
  9: { top: '25%', left: '0%', width: '25%', height: '25%' },            // Left top
  10: { top: '0%', left: '0%', width: '33.33%', height: '25%' },         // Top left
  11: { top: '25%', left: '25%', width: '25%', height: '25%' },          // Inner left
  12: { top: '25%', left: '50%', width: '25%', height: '25%' }           // Inner right
};

const NorthIndianChart: React.FC<NorthIndianChartProps> = ({
  data,
  size = 500,
  showTooltips = true
}) => {
  // Get planets for a specific house
  const getPlanetsInHouse = (houseNum: number): string[] => {
    return data.planets[houseNum.toString()] || [];
  };

  const renderPlanet = (planet: string, index: number) => {
    const PlanetComponent = (
      <Text
        key={`${planet}-${index}`}
        className="planet-symbol"
        cursor={showTooltips ? 'pointer' : 'default'}
      >
        {planet}
      </Text>
    );

    if (showTooltips) {
      return (
        <Tooltip
          key={`tooltip-${planet}-${index}`}
          label={PLANET_NAMES[planet] || planet}
          placement="top"
          hasArrow
          bg="gray.800"
          color="white"
          fontSize="sm"
        >
          {PlanetComponent}
        </Tooltip>
      );
    }

    return PlanetComponent;
  };

  const renderHouse = (houseNumber: number) => {
    const planets = getPlanetsInHouse(houseNumber);
    const position = HOUSE_POSITIONS[houseNumber as keyof typeof HOUSE_POSITIONS];
    const isLagna = houseNumber === 1;
    
    return (
      <Box
        key={`house-${houseNumber}`}
        className={`chart-house ${isLagna ? 'lagna-house' : ''}`}
        position="absolute"
        top={position.top}
        left={position.left}
        width={position.width}
        height={position.height}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={1}
        border="2px solid #DC143C"
        bg={isLagna ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.8)'}
      >
        <Text className="house-number" mb={1} fontSize="sm" fontWeight="bold">
          {houseNumber}
        </Text>
        {isLagna && (
          <Text className="lagna-label" mb={1} fontSize="xs">
            Lagna
          </Text>
        )}
        <Box display="flex" flexWrap="wrap" justifyContent="center" alignItems="center">
          {planets.map((planet, index) => renderPlanet(planet, index))}
        </Box>
      </Box>
    );
  };

  return (
    <Box
      className="north-indian-chart"
      position="relative"
      width={`${size}px`}
      height={`${size}px`}
      borderRadius="md"
      overflow="hidden"
      mx="auto"
      bg="linear-gradient(135deg, #FFF8DC 0%, #F5DEB3 100%)"
      border="3px solid #DC143C"
      boxShadow="0 8px 32px rgba(139, 69, 19, 0.3)"
    >
      {/* Sacred Om symbol in center */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        fontSize="6xl"
        color="rgba(220, 20, 60, 0.1)"
        fontWeight="bold"
        zIndex={0}
        userSelect="none"
      >
        ॐ
      </Box>

      {/* Render all 12 houses */}
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(houseNumber => 
        renderHouse(houseNumber)
      )}

      {/* Center diamond with diagonal lines */}
      <Box
        position="absolute"
        top="25%"
        left="25%"
        width="50%"
        height="50%"
        border="2px solid #DC143C"
        bg="rgba(255, 248, 220, 0.9)"
        zIndex={1}
      >
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
          <line x1="0%" y1="0%" x2="100%" y2="100%" stroke="#DC143C" strokeWidth="2" />
          <line x1="100%" y1="0%" x2="0%" y2="100%" stroke="#DC143C" strokeWidth="2" />
        </svg>
        
        {/* Center Lagna indicator */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          bg="rgba(255, 255, 255, 0.95)"
          border="2px solid #DC143C"
          borderRadius="md"
          px={2}
          py={1}
          zIndex={3}
        >
          <Text fontSize="xs" fontWeight="bold" color="#8B4513" textAlign="center">
            Lagna
          </Text>
          <Text fontSize="xs" color="#8B4513" textAlign="center">
            House 1
          </Text>
        </Box>
      </Box>

      {/* Chart title */}
      <Box
        position="absolute"
        bottom={2}
        left="50%"
        transform="translateX(-50%)"
        bg="rgba(255, 255, 255, 0.9)"
        px={3}
        py={1}
        borderRadius="md"
        border="1px solid #DC143C"
      >
        <Text fontSize="xs" fontWeight="bold" color="#8B4513">
          North Indian Kundali
        </Text>
      </Box>
    </Box>
  );
};

export default NorthIndianChart;