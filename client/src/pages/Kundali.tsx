import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  SimpleGrid,
  useColorModeValue,
  FormErrorMessage,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Spinner,
  Center,
  useToast,
  Select,
  VStack,
} from '@chakra-ui/react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { fetchAPI } from '../utils/api';
import KundaliChart from '../components/KundaliChart';

interface KundaliFormData {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  latitude?: number;
  longitude?: number;
}

interface KundaliResponse {
  id: string;
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  coordinates: {
    latitude?: number;
    longitude?: number;
  };
  userId?: string;
  createdAt?: string;
  planets: {
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
  }[];
  houses?: {
    number: number;
    sign: string;
    signLord: string;
    degree: number;
  }[];
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

const Kundali = () => {
  const [searchParams] = useSearchParams();
  const kundaliId = searchParams.get('id');
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [formData, setFormData] = useState<KundaliFormData>({
    name: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kundaliData, setKundaliData] = useState<KundaliResponse | null>(null);
  const bgColor = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    if (kundaliId) {
      fetchKundaliData(kundaliId);
    }
  }, [kundaliId, token]);

  const fetchKundaliData = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/kundali/get?id=${id}`);

      if (response.data.success) {
        setKundaliData(response.data.data);
        setFormData({
          name: response.data.data.name,
          dateOfBirth: response.data.data.dateOfBirth.split('T')[0],
          timeOfBirth: response.data.data.timeOfBirth,
          placeOfBirth: response.data.data.placeOfBirth,
        });
      } else {
        setError('Failed to fetch birth chart data');
      }
    } catch (err) {
      console.error('Error fetching kundali:', err);
      setError('Error loading birth chart. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    }
    
    if (!formData.timeOfBirth) {
      errors.timeOfBirth = 'Time of birth is required';
    }
    
    if (!formData.placeOfBirth.trim()) {
      errors.placeOfBirth = 'Place of birth is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const endpoint = kundaliId
        ? `/kundali/update?id=${kundaliId}`
        : '/kundali/generate';

      const method = kundaliId ? 'PUT' : 'POST';

      // Map form data to backend expected format
      const requestData = {
        name: formData.name,
        birthDate: formData.dateOfBirth,
        birthTime: formData.timeOfBirth,
        birthPlace: formData.placeOfBirth
      };

      let response;

      try {
        // Try axios first
        console.log('Attempting axios request...');

        response = await api({
          method: method.toLowerCase(),
          url: endpoint,
          data: requestData
        });
        console.log('Axios request successful');
      } catch (axiosError: any) {
        console.error('Axios request failed:', axiosError);

        try {
          // If axios fails, try fetch
          console.log('Attempting fetch request...');
          const fetchResponse = await fetchAPI(endpoint, {
            method,
            body: JSON.stringify(requestData),
          });

          response = { data: fetchResponse };
          console.log('Fetch request successful');
        } catch (fetchError: any) {
          console.error('Fetch request also failed:', fetchError);
          throw fetchError;
        }
      }

      if (response.data.success) {
        setKundaliData(response.data.data);
        toast({
          title: kundaliId ? 'Birth chart updated' : 'Birth chart created',
          description: kundaliId
            ? 'Your birth chart has been updated successfully.'
            : 'Your birth chart has been generated successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        if (!kundaliId) {
          navigate(`/kundali?id=${response.data.data.id}`);
        }
      } else {
        setError(response.data.message || 'Failed to process birth chart');
      }
    } catch (err: any) {
      console.error('Both axios and fetch failed:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPlanetCard = (planet: any) => (
    <Card key={planet.name?.en || planet.name || 'unknown'} variant="outline" size="sm">
      <CardHeader pb={2}>
        <Heading size="sm" color="maroon.700">{planet.name?.en || planet.name || 'Unknown'}</Heading>
      </CardHeader>
      <CardBody pt={0}>
        <Text fontSize="sm">Sign: {planet.rashiName?.english || planet.rashiName?.name || 'Unknown'}</Text>
        <Text fontSize="sm">House: {planet.rashi + 1}</Text>
        <Text fontSize="sm">Nakshatra: {planet.nakshatraName?.name || 'Unknown'}</Text>
        <Text fontSize="sm">Degree: {planet.degree?.toFixed(2) || '0'}°</Text>
        {planet.isRetrograde && (
          <Text fontSize="sm" color="orange.500">Retrograde</Text>
        )}
      </CardBody>
    </Card>
  );

  const renderHouseCard = (house: any) => (
    <Card key={`house-${house.number}`} variant="outline" size="sm">
      <CardHeader pb={2}>
        <Heading size="sm" color="maroon.700">House {house.number}</Heading>
      </CardHeader>
      <CardBody pt={0}>
        <Text fontSize="sm">Sign: {house.sign}</Text>
        <Text fontSize="sm">Lord: {house.signLord}</Text>
        <Text fontSize="sm">Degree: {house.degree.toFixed(2)}°</Text>
      </CardBody>
    </Card>
  );

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" size="xl" mb={2} color="maroon.700">
        Birth Chart (Kundali)
      </Heading>
      <Text color="gray.600" mb={8}>
        Generate your Vedic astrological birth chart with detailed planetary positions
      </Text>

      {error && (
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <Tabs colorScheme="maroon" variant="enclosed" isLazy>
        <TabList>
          <Tab>Birth Details</Tab>
          {kundaliData && <Tab>Visual Chart</Tab>}
          {kundaliData && <Tab>Chart Analysis</Tab>}
          {kundaliData && <Tab>Planets</Tab>}
          {kundaliData && <Tab>Houses</Tab>}
        </TabList>

        <TabPanels>
          {/* Birth Details Tab */}
          <TabPanel>
            <Box
              bg={useColorModeValue('white', 'gray.700')}
              p={8}
              borderRadius="lg"
              boxShadow="base"
            >
              <form onSubmit={handleSubmit}>
                <Stack spacing={6}>
                  <FormControl id="name" isRequired isInvalid={!!formErrors.name}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      focusBorderColor="maroon.500"
                    />
                    <FormErrorMessage>{formErrors.name}</FormErrorMessage>
                  </FormControl>

                  <FormControl id="dateOfBirth" isRequired isInvalid={!!formErrors.dateOfBirth}>
                    <FormLabel>Date of Birth</FormLabel>
                    <Input
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      focusBorderColor="maroon.500"
                    />
                    <FormErrorMessage>{formErrors.dateOfBirth}</FormErrorMessage>
                  </FormControl>

                  <FormControl id="timeOfBirth" isRequired isInvalid={!!formErrors.timeOfBirth}>
                    <FormLabel>Time of Birth</FormLabel>
                    <Input
                      name="timeOfBirth"
                      type="time"
                      value={formData.timeOfBirth}
                      onChange={handleChange}
                      focusBorderColor="maroon.500"
                    />
                    <FormErrorMessage>{formErrors.timeOfBirth}</FormErrorMessage>
                  </FormControl>

                  <FormControl id="placeOfBirth" isRequired isInvalid={!!formErrors.placeOfBirth}>
                    <FormLabel>Place of Birth</FormLabel>
                    <Input
                      name="placeOfBirth"
                      value={formData.placeOfBirth}
                      onChange={handleChange}
                      placeholder="City, State, Country"
                      focusBorderColor="maroon.500"
                    />
                    <FormErrorMessage>{formErrors.placeOfBirth}</FormErrorMessage>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="maroon"
                    size="lg"
                    isLoading={isSubmitting}
                    loadingText={kundaliId ? "Updating..." : "Generating..."}
                  >
                    {kundaliId ? "Update Birth Chart" : "Generate Birth Chart"}
                  </Button>
                </Stack>
              </form>
            </Box>
          </TabPanel>

          {/* Visual Chart Tab */}
          {kundaliData && (
            <TabPanel>
              {isLoading ? (
                <Center py={10}>
                  <Spinner size="xl" color="maroon.500" />
                </Center>
              ) : (
                <Box
                  bg={useColorModeValue('white', 'gray.700')}
                  p={8}
                  borderRadius="lg"
                  boxShadow="base"
                >
                  <VStack spacing={6}>
                    {/* Birth Details Header */}
                    <Box textAlign="center">
                      <Heading as="h3" size="lg" mb={2} color="maroon.700">
                        {kundaliData.name}
                      </Heading>
                      <Text fontSize="md" color="gray.600">
                        {new Date(kundaliData.dateOfBirth).toLocaleDateString('hi-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}, {kundaliData.timeOfBirth}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {kundaliData.placeOfBirth}
                      </Text>
                    </Box>

                    {/* Kundali Chart */}
                    <KundaliChart kundaliData={kundaliData} />
                  </VStack>
                </Box>
              )}
            </TabPanel>
          )}

          {/* Chart Analysis Tab */}
          {kundaliData && (
            <TabPanel>
              {isLoading ? (
                <Center py={10}>
                  <Spinner size="xl" color="maroon.500" />
                </Center>
              ) : (
                <Box
                  bg={useColorModeValue('white', 'gray.700')}
                  p={8}
                  borderRadius="lg"
                  boxShadow="base"
                >
                  <Heading as="h3" size="md" mb={4} color="maroon.700">
                    Birth Chart Overview
                  </Heading>
                  <Divider mb={6} />

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
                    <Box>
                      <Text fontWeight="bold" mb={2}>Personal Information</Text>
                      <Text>Name: {kundaliData.name}</Text>
                      <Text>Date of Birth: {new Date(kundaliData.dateOfBirth).toLocaleDateString()}</Text>
                      <Text>Time of Birth: {kundaliData.timeOfBirth}</Text>
                      <Text>Place of Birth: {kundaliData.placeOfBirth}</Text>
                      {kundaliData.coordinates?.latitude && kundaliData.coordinates?.longitude && (
                        <Text>Coordinates: {kundaliData.coordinates.latitude.toFixed(4)}° N, {kundaliData.coordinates.longitude.toFixed(4)}° E</Text>
                      )}
                    </Box>

                    <Box>
                      <Text fontWeight="bold" mb={2}>Ascendant (Lagna)</Text>
                      <Text>Sign: {kundaliData.ascendant.rashiName?.english || kundaliData.ascendant.rashiName?.name || 'Unknown'} ({kundaliData.ascendant.rashiName?.name || 'Unknown'})</Text>
                      <Text>Degree: {kundaliData.ascendant.degree?.toFixed(2) || '0'}°</Text>
                      <Text>Lord: {kundaliData.ascendant.rashiName?.lord || 'Unknown'}</Text>
                    </Box>
                  </SimpleGrid>

                  <Text fontSize="lg" fontWeight="medium" mb={4} color="maroon.700">
                    Chart Interpretation
                  </Text>
                  <Text mb={4}>
                    Your birth chart shows your ascendant (rising sign) is in {kundaliData.ascendant.rashiName?.english || kundaliData.ascendant.rashiName?.name || 'Unknown'},
                    which influences your outward personality and approach to life. The lord of your ascendant
                    is {kundaliData.ascendant.rashiName?.lord || 'Unknown'}.
                  </Text>
                  <Text mb={4}>
                    The Sun in your chart is in {kundaliData.planets.find(p => p.name?.en === 'Sun')?.rashiName?.english || kundaliData.planets.find(p => p.name?.en === 'Sun')?.rashiName?.name || 'Unknown'},
                    indicating your core essence and vitality. The Moon, representing your emotions and inner self,
                    is in {kundaliData.planets.find(p => p.name?.en === 'Moon')?.rashiName?.english || kundaliData.planets.find(p => p.name?.en === 'Moon')?.rashiName?.name || 'Unknown'}.
                  </Text>
                </Box>
              )}
            </TabPanel>
          )}

          {/* Planets Tab */}
          {kundaliData && (
            <TabPanel>
              {isLoading ? (
                <Center py={10}>
                  <Spinner size="xl" color="maroon.500" />
                </Center>
              ) : (
                <Box
                  bg={useColorModeValue('white', 'gray.700')}
                  p={8}
                  borderRadius="lg"
                  boxShadow="base"
                >
                  <Heading as="h3" size="md" mb={4} color="maroon.700">
                    Planetary Positions
                  </Heading>
                  <Divider mb={6} />

                  <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
                    {kundaliData.planets.map(renderPlanetCard)}
                  </SimpleGrid>
                </Box>
              )}
            </TabPanel>
          )}

          {/* Houses Tab */}
          {kundaliData && (
            <TabPanel>
              {isLoading ? (
                <Center py={10}>
                  <Spinner size="xl" color="maroon.500" />
                </Center>
              ) : (
                <Box
                  bg={useColorModeValue('white', 'gray.700')}
                  p={8}
                  borderRadius="lg"
                  boxShadow="base"
                >
                  <Heading as="h3" size="md" mb={4} color="maroon.700">
                    Houses (Bhavas)
                  </Heading>
                  <Divider mb={6} />

                  <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
                    {kundaliData.houses.map(renderHouseCard)}
                  </SimpleGrid>
                </Box>
              )}
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default Kundali;