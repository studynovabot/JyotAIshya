import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  useColorModeValue,
  Alert,
  AlertIcon,
  Spinner,
  Center,
  Divider,
  Card,
  CardHeader,
  CardBody,
  Progress,
  Flex,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { FaExclamationTriangle, FaShieldAlt, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';

interface DoshaFormData {
  name: string;
  gender: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
}

interface DoshaResult {
  mangalDosha: {
    exists: boolean;
    intensity: number;
    remedies: string[];
    description: string;
  };
  kaalSarpaDosha: {
    exists: boolean;
    type: string;
    intensity: number;
    remedies: string[];
    description: string;
  };
  pitruDosha: {
    exists: boolean;
    intensity: number;
    remedies: string[];
    description: string;
  };
  otherDoshas: {
    name: string;
    exists: boolean;
    intensity: number;
    remedies: string[];
    description: string;
  }[];
}

const Doshas = () => {
  const [formData, setFormData] = useState<DoshaFormData>({
    name: '',
    gender: 'male',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
  });
  
  const [result, setResult] = useState<DoshaResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bgColor = useColorModeValue('white', 'gray.700');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.dateOfBirth || !formData.placeOfBirth.trim()) {
      setError('Please fill all required fields');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:3000/api/kundali/doshas', formData);
      
      if (response.data.success) {
        setResult(response.data.data);
      } else {
        setError(response.data.message || 'Failed to analyze doshas');
      }
    } catch (err: any) {
      console.error('Error analyzing doshas:', err);
      setError(err.response?.data?.message || 'Error processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 75) return 'red';
    if (intensity >= 50) return 'orange';
    if (intensity >= 25) return 'yellow';
    return 'green';
  };

  const getIntensityText = (intensity: number) => {
    if (intensity >= 75) return 'Severe';
    if (intensity >= 50) return 'Moderate';
    if (intensity >= 25) return 'Mild';
    return 'Minimal';
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" size="xl" mb={2} color="maroon.700">
        Dosha Analysis
      </Heading>
      <Text color="gray.600" mb={8}>
        Check for astrological doshas (afflictions) in your birth chart and learn about remedies
      </Text>

      {error && (
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <Box
        bg={useColorModeValue('white', 'gray.700')}
        p={8}
        borderRadius="lg"
        boxShadow="base"
        mb={8}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={6}>
            <FormControl id="name" isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                focusBorderColor="maroon.500"
              />
            </FormControl>

            <FormControl id="gender" isRequired>
              <FormLabel>Gender</FormLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                focusBorderColor="maroon.500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Select>
            </FormControl>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl id="dateOfBirth" isRequired>
                <FormLabel>Date of Birth</FormLabel>
                <Input
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  focusBorderColor="maroon.500"
                />
              </FormControl>

              <FormControl id="timeOfBirth">
                <FormLabel>Time of Birth (if known)</FormLabel>
                <Input
                  name="timeOfBirth"
                  type="time"
                  value={formData.timeOfBirth}
                  onChange={handleChange}
                  focusBorderColor="maroon.500"
                />
              </FormControl>
            </SimpleGrid>

            <FormControl id="placeOfBirth" isRequired>
              <FormLabel>Place of Birth</FormLabel>
              <Input
                name="placeOfBirth"
                value={formData.placeOfBirth}
                onChange={handleChange}
                placeholder="City, State, Country"
                focusBorderColor="maroon.500"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="maroon"
              size="lg"
              isLoading={isLoading}
              loadingText="Analyzing doshas..."
            >
              Check for Doshas
            </Button>
          </Stack>
        </form>
      </Box>

      {isLoading ? (
        <Center py={10}>
          <Spinner size="xl" color="maroon.500" />
        </Center>
      ) : result ? (
        <Box
          bg={bgColor}
          p={8}
          borderRadius="lg"
          boxShadow="base"
        >
          <Heading as="h2" size="lg" mb={4} color="maroon.700">
            Dosha Analysis Results
          </Heading>
          <Divider mb={6} />

          <Alert status="info" mb={6} borderRadius="md">
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">Important Note</Text>
              <Text fontSize="sm">
                Doshas are traditional Vedic astrological concepts. This analysis is for informational purposes only.
                Consult with a qualified astrologer for personalized guidance.
              </Text>
            </Box>
          </Alert>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={8}>
            {/* Mangal Dosha */}
            <Card variant="outline">
              <CardHeader bg={result.mangalDosha.exists ? 'red.50' : 'green.50'} borderTopRadius="md">
                <Flex align="center">
                  <Icon 
                    as={result.mangalDosha.exists ? FaExclamationTriangle : FaShieldAlt} 
                    color={result.mangalDosha.exists ? 'red.500' : 'green.500'} 
                    mr={2} 
                  />
                  <Heading size="md" color={result.mangalDosha.exists ? 'red.700' : 'green.700'}>
                    Mangal Dosha (Mars Affliction)
                  </Heading>
                </Flex>
              </CardHeader>
              <CardBody>
                <Text mb={4}>
                  {result.mangalDosha.exists 
                    ? result.mangalDosha.description 
                    : "No Mangal Dosha found in your birth chart. This is considered auspicious for marriage and partnerships."}
                </Text>

                {result.mangalDosha.exists && (
                  <>
                    <Box mb={4}>
                      <Text fontWeight="medium" mb={1}>Intensity:</Text>
                      <Flex align="center">
                        <Progress 
                          value={result.mangalDosha.intensity} 
                          colorScheme={getIntensityColor(result.mangalDosha.intensity)} 
                          size="sm" 
                          borderRadius="md" 
                          flex="1" 
                          mr={2}
                        />
                        <Text fontSize="sm" fontWeight="medium" color={`${getIntensityColor(result.mangalDosha.intensity)}.500`}>
                          {getIntensityText(result.mangalDosha.intensity)}
                        </Text>
                      </Flex>
                    </Box>

                    <Box>
                      <Text fontWeight="medium" mb={2}>Recommended Remedies:</Text>
                      <Stack spacing={1}>
                        {result.mangalDosha.remedies.map((remedy, index) => (
                          <Text key={index} fontSize="sm">• {remedy}</Text>
                        ))}
                      </Stack>
                    </Box>
                  </>
                )}
              </CardBody>
            </Card>

            {/* Kaal Sarpa Dosha */}
            <Card variant="outline">
              <CardHeader bg={result.kaalSarpaDosha.exists ? 'red.50' : 'green.50'} borderTopRadius="md">
                <Flex align="center">
                  <Icon 
                    as={result.kaalSarpaDosha.exists ? FaExclamationTriangle : FaShieldAlt} 
                    color={result.kaalSarpaDosha.exists ? 'red.500' : 'green.500'} 
                    mr={2} 
                  />
                  <Heading size="md" color={result.kaalSarpaDosha.exists ? 'red.700' : 'green.700'}>
                    Kaal Sarpa Dosha
                  </Heading>
                </Flex>
              </CardHeader>
              <CardBody>
                <Text mb={4}>
                  {result.kaalSarpaDosha.exists 
                    ? `${result.kaalSarpaDosha.description} (Type: ${result.kaalSarpaDosha.type})` 
                    : "No Kaal Sarpa Dosha found in your birth chart. This is favorable for smooth progression in life."}
                </Text>

                {result.kaalSarpaDosha.exists && (
                  <>
                    <Box mb={4}>
                      <Text fontWeight="medium" mb={1}>Intensity:</Text>
                      <Flex align="center">
                        <Progress 
                          value={result.kaalSarpaDosha.intensity} 
                          colorScheme={getIntensityColor(result.kaalSarpaDosha.intensity)} 
                          size="sm" 
                          borderRadius="md" 
                          flex="1" 
                          mr={2}
                        />
                        <Text fontSize="sm" fontWeight="medium" color={`${getIntensityColor(result.kaalSarpaDosha.intensity)}.500`}>
                          {getIntensityText(result.kaalSarpaDosha.intensity)}
                        </Text>
                      </Flex>
                    </Box>

                    <Box>
                      <Text fontWeight="medium" mb={2}>Recommended Remedies:</Text>
                      <Stack spacing={1}>
                        {result.kaalSarpaDosha.remedies.map((remedy, index) => (
                          <Text key={index} fontSize="sm">• {remedy}</Text>
                        ))}
                      </Stack>
                    </Box>
                  </>
                )}
              </CardBody>
            </Card>

            {/* Pitru Dosha */}
            <Card variant="outline">
              <CardHeader bg={result.pitruDosha.exists ? 'red.50' : 'green.50'} borderTopRadius="md">
                <Flex align="center">
                  <Icon 
                    as={result.pitruDosha.exists ? FaExclamationTriangle : FaShieldAlt} 
                    color={result.pitruDosha.exists ? 'red.500' : 'green.500'} 
                    mr={2} 
                  />
                  <Heading size="md" color={result.pitruDosha.exists ? 'red.700' : 'green.700'}>
                    Pitru Dosha (Ancestral Affliction)
                  </Heading>
                </Flex>
              </CardHeader>
              <CardBody>
                <Text mb={4}>
                  {result.pitruDosha.exists 
                    ? result.pitruDosha.description 
                    : "No Pitru Dosha found in your birth chart. This indicates good ancestral blessings."}
                </Text>

                {result.pitruDosha.exists && (
                  <>
                    <Box mb={4}>
                      <Text fontWeight="medium" mb={1}>Intensity:</Text>
                      <Flex align="center">
                        <Progress 
                          value={result.pitruDosha.intensity} 
                          colorScheme={getIntensityColor(result.pitruDosha.intensity)} 
                          size="sm" 
                          borderRadius="md" 
                          flex="1" 
                          mr={2}
                        />
                        <Text fontSize="sm" fontWeight="medium" color={`${getIntensityColor(result.pitruDosha.intensity)}.500`}>
                          {getIntensityText(result.pitruDosha.intensity)}
                        </Text>
                      </Flex>
                    </Box>

                    <Box>
                      <Text fontWeight="medium" mb={2}>Recommended Remedies:</Text>
                      <Stack spacing={1}>
                        {result.pitruDosha.remedies.map((remedy, index) => (
                          <Text key={index} fontSize="sm">• {remedy}</Text>
                        ))}
                      </Stack>
                    </Box>
                  </>
                )}
              </CardBody>
            </Card>

            {/* Other Doshas */}
            {result.otherDoshas.length > 0 && (
              <Card variant="outline">
                <CardHeader bg="blue.50" borderTopRadius="md">
                  <Flex align="center">
                    <Icon as={FaInfoCircle} color="blue.500" mr={2} />
                    <Heading size="md" color="blue.700">
                      Other Potential Doshas
                    </Heading>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Accordion allowMultiple>
                    {result.otherDoshas.map((dosha, index) => (
                      <AccordionItem key={index} border="none">
                        <AccordionButton px={0} _hover={{ bg: 'transparent' }}>
                          <Box flex="1" textAlign="left" fontWeight="medium">
                            {dosha.name} {dosha.exists ? '(Present)' : '(Not Present)'}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4} px={0}>
                          <Text mb={4}>{dosha.description}</Text>
                          
                          {dosha.exists && (
                            <>
                              <Box mb={4}>
                                <Text fontWeight="medium" mb={1}>Intensity:</Text>
                                <Flex align="center">
                                  <Progress 
                                    value={dosha.intensity} 
                                    colorScheme={getIntensityColor(dosha.intensity)} 
                                    size="sm" 
                                    borderRadius="md" 
                                    flex="1" 
                                    mr={2}
                                  />
                                  <Text fontSize="sm" fontWeight="medium" color={`${getIntensityColor(dosha.intensity)}.500`}>
                                    {getIntensityText(dosha.intensity)}
                                  </Text>
                                </Flex>
                              </Box>

                              <Box>
                                <Text fontWeight="medium" mb={2}>Recommended Remedies:</Text>
                                <Stack spacing={1}>
                                  {dosha.remedies.map((remedy, idx) => (
                                    <Text key={idx} fontSize="sm">• {remedy}</Text>
                                  ))}
                                </Stack>
                              </Box>
                            </>
                          )}
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardBody>
              </Card>
            )}
          </SimpleGrid>

          <Box p={4} bg="yellow.50" borderRadius="md">
            <Flex align="center" mb={2}>
              <Icon as={FaExclamationTriangle} color="yellow.500" mr={2} />
              <Text fontWeight="bold" color="yellow.700">Disclaimer</Text>
            </Flex>
            <Text fontSize="sm">
              This dosha analysis is based on traditional Vedic astrological principles and is provided for 
              informational purposes only. It should not be considered as medical, legal, or psychological advice. 
              For serious concerns, please consult with a qualified professional astrologer, counselor, or healthcare provider.
            </Text>
          </Box>
        </Box>
      ) : null}
    </Container>
  );
};

export default Doshas;