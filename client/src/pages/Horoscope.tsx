import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  FormControl,
  FormLabel,
  Select,
  Stack,
  Alert,
  AlertIcon,
  Spinner,
  Center,
  Divider,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { FaSun, FaMoon, FaStar, FaHeart, FaBriefcase, FaMoneyBillWave, FaGraduationCap, FaHome } from 'react-icons/fa';
import { api } from '../utils/api';

interface HoroscopeData {
  rashi: {
    id: string;
    name: string;
    english: string;
  };
  date: string;
  prediction: {
    hindi: string;
    english: string;
  };
  luckyColor: string;
  luckyNumber: number;
  advice: string;
}

const zodiacSigns = [
  { id: 'mesh', name: 'Mesh (मेष)', english: 'Aries' },
  { id: 'vrishabh', name: 'Vrishabh (वृषभ)', english: 'Taurus' },
  { id: 'mithun', name: 'Mithun (मिथुन)', english: 'Gemini' },
  { id: 'kark', name: 'Kark (कर्क)', english: 'Cancer' },
  { id: 'simha', name: 'Simha (सिंह)', english: 'Leo' },
  { id: 'kanya', name: 'Kanya (कन्या)', english: 'Virgo' },
  { id: 'tula', name: 'Tula (तुला)', english: 'Libra' },
  { id: 'vrishchik', name: 'Vrishchik (वृश्चिक)', english: 'Scorpio' },
  { id: 'dhanu', name: 'Dhanu (धनु)', english: 'Sagittarius' },
  { id: 'makar', name: 'Makar (मकर)', english: 'Capricorn' },
  { id: 'kumbh', name: 'Kumbh (कुंभ)', english: 'Aquarius' },
  { id: 'meen', name: 'Meen (मीन)', english: 'Pisces' }
];

const periods = ['daily']; // Only daily is supported by backend

const Horoscope = () => {
  const [selectedSign, setSelectedSign] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bgColor = useColorModeValue('white', 'gray.700');

  const fetchHoroscope = async () => {
    if (!selectedSign) {
      setError('Please select a zodiac sign');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get(`/horoscope/daily/${selectedSign}`);

      if (response.data.success) {
        setHoroscope(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch horoscope');
      }
    } catch (err: any) {
      console.error('Error fetching horoscope:', err);
      setError(err.response?.data?.message || 'Error loading horoscope. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getZodiacIcon = (sign: string) => {
    switch (sign.toLowerCase()) {
      case 'aries': return '♈';
      case 'taurus': return '♉';
      case 'gemini': return '♊';
      case 'cancer': return '♋';
      case 'leo': return '♌';
      case 'virgo': return '♍';
      case 'libra': return '♎';
      case 'scorpio': return '♏';
      case 'sagittarius': return '♐';
      case 'capricorn': return '♑';
      case 'aquarius': return '♒';
      case 'pisces': return '♓';
      default: return '★';
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" size="xl" mb={2} color="maroon.700">
        Horoscope
      </Heading>
      <Text color="gray.600" mb={8}>
        Get insights into your day, week, month, or year ahead
      </Text>

      <Box
        bg={useColorModeValue('white', 'gray.700')}
        p={8}
        borderRadius="lg"
        boxShadow="base"
        mb={8}
      >
        <Stack spacing={6}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl id="sign" isRequired>
              <FormLabel>Select Your Zodiac Sign</FormLabel>
              <Select
                placeholder="Choose your sign"
                value={selectedSign}
                onChange={(e) => setSelectedSign(e.target.value)}
                focusBorderColor="maroon.500"
              >
                {zodiacSigns.map((sign) => (
                  <option key={sign.id} value={sign.id}>
                    {getZodiacIcon(sign.english)} {sign.name} ({sign.english})
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl id="period" isRequired>
              <FormLabel>Horoscope Period</FormLabel>
              <Select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                focusBorderColor="maroon.500"
              >
                {periods.map((period) => (
                  <option key={period} value={period}>
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </option>
                ))}
              </Select>
            </FormControl>
          </SimpleGrid>

          <Button
            colorScheme="maroon"
            size="lg"
            onClick={fetchHoroscope}
            isLoading={isLoading}
            loadingText="Fetching horoscope..."
          >
            Get Horoscope
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Center py={10}>
          <Spinner size="xl" color="maroon.500" />
        </Center>
      ) : horoscope ? (
        <Box
          bg={bgColor}
          p={8}
          borderRadius="lg"
          boxShadow="base"
        >
          <Flex align="center" mb={4}>
            <Text fontSize="4xl" mr={3}>{getZodiacIcon(horoscope.rashi.english)}</Text>
            <Heading as="h2" size="lg" color="maroon.700">
              {horoscope.rashi.name} ({horoscope.rashi.english}) Daily Horoscope
            </Heading>
          </Flex>
          <Text color="gray.600" mb={6}>
            For {horoscope.date}
          </Text>

          <Box>
            <Box mb={6}>
              <Flex align="center" mb={3}>
                <Icon as={FaSun} color="orange.400" mr={2} />
                <Heading as="h3" size="md" color="maroon.700">
                  Today's Prediction
                </Heading>
              </Flex>
              <Text mb={4} fontSize="lg">{horoscope.prediction.english}</Text>
              <Text fontSize="md" color="gray.600" fontStyle="italic">{horoscope.prediction.hindi}</Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
              <Card variant="outline">
                <CardHeader pb={2}>
                  <Heading size="sm">Lucky Color</Heading>
                </CardHeader>
                <CardBody pt={0}>
                  <Text>{horoscope.luckyColor}</Text>
                </CardBody>
              </Card>

              <Card variant="outline">
                <CardHeader pb={2}>
                  <Heading size="sm">Lucky Number</Heading>
                </CardHeader>
                <CardBody pt={0}>
                  <Text>{horoscope.luckyNumber}</Text>
                </CardBody>
              </Card>

              <Card variant="outline">
                <CardHeader pb={2}>
                  <Heading size="sm">Advice</Heading>
                </CardHeader>
                <CardBody pt={0}>
                  <Text>{horoscope.advice}</Text>
                </CardBody>
              </Card>
            </SimpleGrid>
          </Box>
        </Box>
      ) : null}
    </Container>
  );
};

export default Horoscope;