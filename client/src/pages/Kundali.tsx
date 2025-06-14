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
  HStack,
  IconButton,
  Badge,
  Tooltip,
} from '@chakra-ui/react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api, { fetchAPI } from '../utils/api';
import ProKeralaChart from '../components/ProKeralaChart';
import CitySelector, { City } from '../components/CitySelector';
import NorthIndianChart from '../components/NorthIndianChart';
import { convertKundaliToChartData } from '../utils/chartDataConverter';
import { calculateNorthIndianChart, convertToUIFormat, BirthDetails } from '../services/groqAstrology';

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
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [formData, setFormData] = useState<KundaliFormData>({
    name: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
  });
  
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingChart, setIsGeneratingChart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kundaliData, setKundaliData] = useState<KundaliResponse | null>(null);
  const [groqChartData, setGroqChartData] = useState<any>(null);
  const bgColor = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    if (kundaliId) {
      fetchKundaliData(kundaliId);
    }
  }, [kundaliId, token]);

  const fetchKundaliData = async (id: string) => {
    try {
      setIsLoading(true);
      console.log(`🔍 Fetching kundali data for ID: ${id}`);

      let response;
      try {
        // Try the kundali-standalone endpoint first
        response = await api.get(`/kundali-standalone?id=${id}`);
        console.log('✅ Successfully fetched from kundali-standalone endpoint');
      } catch (standaloneError) {
        console.log('❌ kundali-standalone endpoint failed, trying kundali endpoint...');
        // Fallback to the regular kundali endpoint
        response = await api.get(`/kundali?action=crud&id=${id}`);
        console.log('✅ Successfully fetched from kundali endpoint');
      }

      if (response.data.success) {
        console.log(`✅ Successfully fetched kundali data for: ${response.data.data.name}`);
        setKundaliData(response.data.data);
        setFormData({
          name: response.data.data.name,
          dateOfBirth: response.data.data.dateOfBirth.split('T')[0],
          timeOfBirth: response.data.data.timeOfBirth,
          placeOfBirth: response.data.data.placeOfBirth,
        });
      } else {
        console.error('❌ Failed to fetch kundali data:', response.data.message);
        setError('Failed to fetch birth chart data');
      }
    } catch (err: any) {
      console.error('❌ Error fetching kundali:', err);
      setError('Error loading birth chart. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = t('error.required');
    }
    
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = t('error.required');
    }
    
    if (!formData.timeOfBirth) {
      errors.timeOfBirth = t('error.required');
    }
    
    if (!formData.placeOfBirth.trim()) {
      errors.placeOfBirth = t('error.required');
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateGroqChart = async () => {
    if (!formData.name || !formData.dateOfBirth || !formData.timeOfBirth || !formData.placeOfBirth) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all birth details to generate the chart.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsGeneratingChart(true);
      setError(null);

      const birthDetails: BirthDetails = {
        name: formData.name,
        dateOfBirth: formData.dateOfBirth,
        timeOfBirth: formData.timeOfBirth,
        placeOfBirth: formData.placeOfBirth,
        latitude: selectedCity?.latitude,
        longitude: selectedCity?.longitude,
      };

      console.log('🔮 Generating chart with Groq API...', birthDetails);
      
      const chartData = await calculateNorthIndianChart(birthDetails);
      const uiData = convertToUIFormat(chartData);
      
      setGroqChartData(uiData);
      
      toast({
        title: 'Chart Generated Successfully!',
        description: 'Your North Indian Kundali has been calculated using advanced astrological algorithms.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

    } catch (error) {
      console.error('Error generating chart:', error);
      setError('Failed to generate chart. Please try again.');
      toast({
        title: 'Chart Generation Failed',
        description: 'There was an error generating your chart. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsGeneratingChart(false);
    }
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
        ? `/kundali?action=crud&id=${kundaliId}`
        : '/kundali-standalone?action=generate';

      const method = kundaliId ? 'PUT' : 'POST';

      // Map form data to backend expected format
      const requestData = {
        name: formData.name,
        dateOfBirth: formData.dateOfBirth,
        timeOfBirth: formData.timeOfBirth,
        placeOfBirth: formData.placeOfBirth,
        // Include the old field names for backward compatibility
        birthDate: formData.dateOfBirth,
        birthTime: formData.timeOfBirth,
        birthPlace: formData.placeOfBirth
      };

      let response;

      try {
        // Try axios first with the primary endpoint
        console.log('Attempting axios request with primary endpoint...');

        response = await api({
          method: method.toLowerCase(),
          url: endpoint,
          data: requestData
        });
        console.log('Axios request successful');
      } catch (axiosError: any) {
        console.error('Primary endpoint request failed:', axiosError);

        try {
          // If primary endpoint fails, try the alternative endpoint
          const alternativeEndpoint = endpoint.includes('kundali-standalone') 
            ? '/kundali?action=generate' 
            : '/kundali-simple?action=generate';
          
          console.log(`Trying alternative endpoint: ${alternativeEndpoint}`);
          
          response = await api({
            method: method.toLowerCase(),
            url: alternativeEndpoint,
            data: requestData
          });
          console.log('Alternative endpoint request successful');
        } catch (alternativeError: any) {
          console.error('Alternative endpoint request failed:', alternativeError);
          
          try {
            // If axios fails, try fetch as a last resort
            console.log('Attempting fetch request...');
            const fetchResponse = await fetchAPI(endpoint, {
              method,
              body: JSON.stringify(requestData),
            });

            response = { data: fetchResponse };
            console.log('Fetch request successful');
          } catch (fetchError: any) {
            console.error('All request methods failed:', fetchError);
            throw fetchError;
          }
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
        <Text fontSize="sm">House: {typeof planet.rashi === 'number' ? planet.rashi + 1 : 'Unknown'}</Text>
        <Text fontSize="sm">Nakshatra: {planet.nakshatraName?.name || 'Unknown'}</Text>
        <Text fontSize="sm">Degree: {(typeof planet.degree === 'number' ? planet.degree.toFixed(2) : '0')}°</Text>
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
        <Text fontSize="sm">Degree: {(typeof house.degree === 'number' ? house.degree.toFixed(2) : '0')}°</Text>
      </CardBody>
    </Card>
  );

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setFormData(prev => ({
      ...prev,
      placeOfBirth: language === 'hi' ? city.nameHindi : city.name,
      latitude: city.latitude,
      longitude: city.longitude
    }));
    // Clear place of birth error if it exists
    if (formErrors.placeOfBirth) {
      setFormErrors(prev => ({ ...prev, placeOfBirth: '' }));
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      {/* Header with Language Toggle */}
      <Flex justify="space-between" align="center" mb={6}>
        <VStack align="start" spacing={2}>
          <Heading as="h1" size="xl" color="maroon.700">
            {t('kundali.title')}
          </Heading>
          <Text color="gray.600">
            {t('kundali.subtitle')}
          </Text>
        </VStack>
        
        <Tooltip label={t('language.switch')} placement="left">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            colorScheme="maroon"
          >
            {language === 'en' ? 'हिंदी' : 'English'}
          </Button>
        </Tooltip>
      </Flex>

      {error && (
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <Tabs colorScheme="maroon" variant="enclosed" isLazy>
        <TabList>
          <Tab>{t('tab.birthDetails')}</Tab>
          <Tab>North Indian Chart</Tab>
          {kundaliData && <Tab>{t('tab.visualChart')}</Tab>}
          {kundaliData && <Tab>{t('tab.chartAnalysis')}</Tab>}
          {kundaliData && <Tab>{t('tab.planets')}</Tab>}
          {kundaliData && <Tab>{t('tab.houses')}</Tab>}
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
                    <FormLabel>{t('kundali.name')}</FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('kundali.name.placeholder')}
                      focusBorderColor="maroon.500"
                    />
                    <FormErrorMessage>{formErrors.name}</FormErrorMessage>
                  </FormControl>

                  <FormControl id="dateOfBirth" isRequired isInvalid={!!formErrors.dateOfBirth}>
                    <FormLabel>{t('kundali.dateOfBirth')}</FormLabel>
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
                    <FormLabel>{t('kundali.timeOfBirth')}</FormLabel>
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
                    <FormLabel>{t('kundali.placeOfBirth')}</FormLabel>
                    <CitySelector
                      value={formData.placeOfBirth}
                      onChange={handleCitySelect}
                      placeholder={t('kundali.placeOfBirth.placeholder')}
                      isInvalid={!!formErrors.placeOfBirth}
                    />
                    <FormErrorMessage>{formErrors.placeOfBirth}</FormErrorMessage>
                  </FormControl>

                  <HStack spacing={4}>
                    <Button
                      type="submit"
                      colorScheme="maroon"
                      size="lg"
                      isLoading={isSubmitting}
                      loadingText={kundaliId ? t('kundali.updating') : t('kundali.loading')}
                    >
                      {kundaliId ? t('kundali.update') : t('kundali.generate')}
                    </Button>
                    
                    <Button
                      type="button"
                      colorScheme="purple"
                      size="lg"
                      isLoading={isGeneratingChart}
                      loadingText="Generating AI Chart..."
                      onClick={generateGroqChart}
                    >
                      🔮 Generate AI Chart
                    </Button>
                  </HStack>
                </Stack>
              </form>
            </Box>
          </TabPanel>

          {/* North Indian Chart Tab */}
          <TabPanel>
            <Box
              bg={useColorModeValue('white', 'gray.700')}
              p={8}
              borderRadius="lg"
              boxShadow="base"
            >
              <VStack spacing={6}>
                <Heading as="h3" size="lg" mb={4} color="maroon.700">
                  North Indian Vedic Birth Chart
                </Heading>
                
                {groqChartData || kundaliData ? (
                  <VStack spacing={4}>
                    <Box textAlign="center">
                      <Text fontSize="lg" fontWeight="bold" color="maroon.700">
                        {formData.name || kundaliData?.name || 'Birth Chart'}
                      </Text>
                      <Text fontSize="md" color="gray.600">
                        {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString('hi-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }) : kundaliData?.dateOfBirth ? new Date(kundaliData.dateOfBirth).toLocaleDateString('hi-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }) : 'Unknown Date'}, {formData.timeOfBirth || kundaliData?.timeOfBirth || 'Unknown Time'}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {formData.placeOfBirth || kundaliData?.placeOfBirth || 'Unknown Place'}
                      </Text>
                      {groqChartData && (
                        <Text fontSize="xs" color="purple.600" fontWeight="bold" mt={2}>
                          ✨ Generated using AI-powered Vedic calculations
                        </Text>
                      )}
                    </Box>
                    
                    <NorthIndianChart 
                      data={groqChartData || convertKundaliToChartData(kundaliData)} 
                      size={500}
                      showTooltips={true}
                    />
                    
                    <Text fontSize="sm" color="gray.600" textAlign="center" maxW="600px">
                      This is your traditional North Indian Vedic birth chart (Kundali). 
                      Each house represents different aspects of life, and the planets shown 
                      indicate their positions at the time of your birth.
                      {groqChartData && (
                        <Text as="span" color="purple.600" fontWeight="bold">
                          {' '}This chart was calculated using advanced AI algorithms with precise astronomical data.
                        </Text>
                      )}
                    </Text>
                  </VStack>
                ) : (
                  <VStack spacing={4}>
                    <Text fontSize="lg" color="gray.600" textAlign="center">
                      Fill in your birth details in the first tab and click "Generate AI Chart" to see your North Indian Kundali
                    </Text>
                    
                    <Text fontSize="sm" color="gray.500" textAlign="center" maxW="600px">
                      Your personalized North Indian Vedic birth chart will appear here once generated using our AI-powered astrological calculations.
                    </Text>
                  </VStack>
                )}
              </VStack>
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
                        {kundaliData.dateOfBirth ? new Date(kundaliData.dateOfBirth).toLocaleDateString('hi-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }) : 'Unknown Date'}, {kundaliData.timeOfBirth || 'Unknown Time'}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {kundaliData.placeOfBirth}
                      </Text>
                    </Box>

                    {/* Kundali Chart */}
                    <ProKeralaChart kundaliData={kundaliData} />
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
                      <Text>Date of Birth: {kundaliData.dateOfBirth ? new Date(kundaliData.dateOfBirth).toLocaleDateString() : 'Unknown'}</Text>
                      <Text>Time of Birth: {kundaliData.timeOfBirth}</Text>
                      <Text>Place of Birth: {kundaliData.placeOfBirth}</Text>
                      {kundaliData.coordinates?.latitude && kundaliData.coordinates?.longitude && (
                        <Text>Coordinates: {(typeof kundaliData.coordinates.latitude === 'number' ? kundaliData.coordinates.latitude.toFixed(4) : '0')}° N, {(typeof kundaliData.coordinates.longitude === 'number' ? kundaliData.coordinates.longitude.toFixed(4) : '0')}° E</Text>
                      )}
                    </Box>

                    <Box>
                      <Text fontWeight="bold" mb={2}>Ascendant (Lagna)</Text>
                      <Text>Sign: {kundaliData.ascendant.rashiName?.english || kundaliData.ascendant.rashiName?.name || 'Unknown'} ({kundaliData.ascendant.rashiName?.name || 'Unknown'})</Text>
                      <Text>Degree: {(typeof kundaliData.ascendant.degree === 'number' ? kundaliData.ascendant.degree.toFixed(2) : '0')}°</Text>
                      <Text>Lord: {kundaliData.ascendant.rashiName?.lord || 'Unknown'}</Text>
                    </Box>
                  </SimpleGrid>

                  <Text fontSize="lg" fontWeight="medium" mb={4} color="maroon.700">
                    Chart Interpretation
                  </Text>
                  <Text mb={4}>
                    Your birth chart shows your ascendant (rising sign) is in {kundaliData.ascendant?.rashiName?.english || kundaliData.ascendant?.rashiName?.name || 'Unknown'},
                    which influences your outward personality and approach to life. The lord of your ascendant
                    is {kundaliData.ascendant?.rashiName?.lord || 'Unknown'}.
                  </Text>
                  <Text mb={4}>
                    The Sun in your chart is in {kundaliData.planets?.find(p => p.name?.en === 'Sun')?.rashiName?.english || kundaliData.planets?.find(p => p.name?.en === 'Sun')?.rashiName?.name || 'Unknown'},
                    indicating your core essence and vitality. The Moon, representing your emotions and inner self,
                    is in {kundaliData.planets?.find(p => p.name?.en === 'Moon')?.rashiName?.english || kundaliData.planets?.find(p => p.name?.en === 'Moon')?.rashiName?.name || 'Unknown'}.
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
                    {kundaliData.planets?.map(renderPlanetCard) || []}
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
                    {kundaliData.houses?.map(renderHouseCard) || []}
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