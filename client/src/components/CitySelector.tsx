import React, { useState, useEffect } from 'react';
import {
  Box,
  Input,
  List,
  ListItem,
  Text,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { City, searchCities, ALL_CITIES } from '../data/cities';
import { useLanguage } from '../context/LanguageContext';

interface CitySelectorProps {
  value?: string;
  onChange: (city: City) => void;
  placeholder?: string;
  isInvalid?: boolean;
}

const CitySelector: React.FC<CitySelectorProps> = ({
  value = '',
  onChange,
  placeholder,
  isInvalid = false
}) => {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState(value);
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');

  useEffect(() => {
    if (searchTerm.length >= 2) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        const results = searchCities(searchTerm, language);
        setSuggestions(results.slice(0, 10)); // Limit to 10 results
        setIsOpen(true);
        setIsLoading(false);
      }, 300); // Debounce search

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
    }
  }, [searchTerm, language]);

  useEffect(() => {
    // If value prop changes, update search term
    if (value !== searchTerm) {
      setSearchTerm(value);
      // Try to find the city in our database
      const city = ALL_CITIES.find(c => 
        c.name.toLowerCase() === value.toLowerCase() ||
        c.nameHindi === value
      );
      setSelectedCity(city || null);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setSelectedCity(null);
  };

  const handleCitySelect = (city: City) => {
    const displayName = language === 'hi' ? city.nameHindi : city.name;
    setSearchTerm(displayName);
    setSelectedCity(city);
    setIsOpen(false);
    onChange(city);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay closing to allow for click on suggestions
    setTimeout(() => setIsOpen(false), 200);
  };

  const renderCityItem = (city: City) => {
    const name = language === 'hi' ? city.nameHindi : city.name;
    const state = language === 'hi' ? city.stateHindi : city.state;
    const country = language === 'hi' ? city.countryHindi : city.country;

    return (
      <ListItem
        key={city.id}
        p={3}
        cursor="pointer"
        _hover={{ bg: hoverBg }}
        onClick={() => handleCitySelect(city)}
        borderBottom="1px solid"
        borderColor={borderColor}
      >
        <VStack align="start" spacing={1}>
          <HStack justify="space-between" width="100%">
            <Text fontWeight="semibold" fontSize="sm">
              {name}
            </Text>
            <Badge colorScheme="blue" size="sm">
              {country}
            </Badge>
          </HStack>
          <Text fontSize="xs" color="gray.500">
            {state}, {country}
          </Text>
          <HStack spacing={2}>
            <Text fontSize="xs" color="gray.400">
              Lat: {city.latitude.toFixed(2)}°
            </Text>
            <Text fontSize="xs" color="gray.400">
              Lng: {city.longitude.toFixed(2)}°
            </Text>
            <Text fontSize="xs" color="gray.400">
              TZ: UTC{city.timezone >= 0 ? '+' : ''}{city.timezone}
            </Text>
          </HStack>
        </VStack>
      </ListItem>
    );
  };

  return (
    <Box position="relative" width="100%">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          {isLoading ? (
            <Spinner size="sm" color="gray.400" />
          ) : (
            <Icon as={SearchIcon} color="gray.400" />
          )}
        </InputLeftElement>
        <Input
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder || (language === 'hi' ? 'शहर खोजें...' : 'Search city...')}
          focusBorderColor="maroon.500"
          isInvalid={isInvalid}
          pl={10}
        />
      </InputGroup>

      {/* Selected city info */}
      {selectedCity && !isOpen && (
        <Box mt={2} p={2} bg="green.50" borderRadius="md" border="1px solid" borderColor="green.200">
          <HStack justify="space-between">
            <VStack align="start" spacing={0}>
              <Text fontSize="sm" fontWeight="semibold" color="green.700">
                {language === 'hi' ? selectedCity.nameHindi : selectedCity.name}
              </Text>
              <Text fontSize="xs" color="green.600">
                {language === 'hi' ? selectedCity.stateHindi : selectedCity.state}, {' '}
                {language === 'hi' ? selectedCity.countryHindi : selectedCity.country}
              </Text>
            </VStack>
            <Badge colorScheme="green" size="sm">
              ✓ Selected
            </Badge>
          </HStack>
        </Box>
      )}

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          zIndex={1000}
          bg={bgColor}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="md"
          boxShadow="lg"
          maxHeight="300px"
          overflowY="auto"
          mt={1}
        >
          <List spacing={0}>
            {suggestions.map(renderCityItem)}
          </List>
        </Box>
      )}

      {/* No results message */}
      {isOpen && suggestions.length === 0 && searchTerm.length >= 2 && !isLoading && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          zIndex={1000}
          bg={bgColor}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="md"
          boxShadow="lg"
          mt={1}
          p={4}
        >
          <Alert status="info" size="sm">
            <AlertIcon />
            <Text fontSize="sm">
              {language === 'hi' 
                ? 'कोई शहर नहीं मिला। कृपया अलग नाम से खोजें।'
                : 'No cities found. Please try a different search term.'
              }
            </Text>
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default CitySelector;