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

const NorthIndianChart: React.FC<NorthIndianChartProps> = ({
  data,
  size = 400,
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

  const renderHouse = (houseNumber: number, gridColumn: string, gridRow: string, isLagna: boolean = false) => {
    const planets = getPlanetsInHouse(houseNumber);
    
    return (
      <Box
        key={`house-${houseNumber}`}
        className={`chart-house ${isLagna ? 'lagna-house' : ''}`}
        gridColumn={gridColumn}
        gridRow={gridRow}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={1}
        position="relative"
      >
        <Text className="house-number" mb={1}>{houseNumber}</Text>
        {isLagna && <Text className="lagna-label" mb={1}>Lagna</Text>}
        <Box display="flex" flexWrap="wrap" justifyContent="center">
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
    >
      {/* Ganesh watermark in center */}
      <Box className="ganesh-watermark">
        ॐ
      </Box>

      {/* Chart structure using CSS Grid */}
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        display="grid"
        gridTemplateColumns="1fr 1fr 1fr 1fr"
        gridTemplateRows="1fr 1fr 1fr 1fr"
        zIndex={2}
      >
        {/* Row 1 */}
        {renderHouse(12, "1", "1")}
        {renderHouse(1, "2", "1", true)}
        {renderHouse(2, "3", "1")}
        {renderHouse(3, "4", "1")}

        {/* Row 2 */}
        {renderHouse(11, "1", "2")}
        
        {/* Center - Empty space with diagonal lines */}
        <Box
          gridColumn="2 / 4"
          gridRow="2 / 4"
          position="relative"
          className="chart-house"
        >
          {/* Diagonal lines to create diamond effect */}
          <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
            <line x1="0%" y1="0%" x2="100%" y2="100%" stroke="#DC143C" strokeWidth="1" />
            <line x1="100%" y1="0%" x2="0%" y2="100%" stroke="#DC143C" strokeWidth="1" />
          </svg>
        </Box>
        
        {renderHouse(4, "4", "2")}

        {/* Row 3 */}
        {renderHouse(10, "1", "3")}
        {renderHouse(5, "4", "3")}

        {/* Row 4 */}
        {renderHouse(9, "1", "4")}
        {renderHouse(8, "2", "4")}
        {renderHouse(7, "3", "4")}
        {renderHouse(6, "4", "4")}
      </Box>

      {/* Center Lagna label */}
      <Box className="chart-center">
        <Text className="lagna-label">
          Lagna
        </Text>
        <Text className="lagna-label" fontSize="xs">
          {data.ascendant}
        </Text>
      </Box>
    </Box>
  );
};

export default NorthIndianChart;