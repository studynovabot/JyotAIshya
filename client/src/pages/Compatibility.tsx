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
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
  Icon,
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react';
import { FaHeart, FaComments, FaHandHoldingHeart, FaHome, FaChild } from 'react-icons/fa';
import { api } from '../utils/api';

interface CompatibilityFormData {
  person1: {
    name: string;
    gender: string;
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
  };
  person2: {
    name: string;
    gender: string;
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
  };
}

interface CompatibilityResult {
  overallScore: number;
  aspects: {
    emotional: number;
    communication: number;
    values: number;
    stability: number;
    physical: number;
    growth: number;
  };
  analysis: string;
  challenges: string;
  strengths: string;
}

const Compatibility = () => {
  const [formData, setFormData] = useState<CompatibilityFormData>({
    person1: {
      name: '',
      gender: 'male',
      dateOfBirth: '',
      timeOfBirth: '',
      placeOfBirth: '',
    },
    person2: {
      name: '',
      gender: 'female',
      dateOfBirth: '',
      timeOfBirth: '',
      placeOfBirth: '',
    },
  });
  
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bgColor = useColorModeValue('white', 'gray.700');

  const handleChange = (person: 'person1' | 'person2', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);
      
      const requestData = {
        person1: {
          name: formData.person1.name,
          birthDate: formData.person1.dateOfBirth,
          birthTime: formData.person1.timeOfBirth,
          birthPlace: formData.person1.placeOfBirth
        },
        person2: {
          name: formData.person2.name,
          birthDate: formData.person2.dateOfBirth,
          birthTime: formData.person2.timeOfBirth,
          birthPlace: formData.person2.placeOfBirth
        }
      };

      const response = await api.post('/compatibility/match', requestData);
      
      if (response.data.success) {
        setResult(response.data.data);
      } else {
        setError(response.data.message || 'Failed to calculate compatibility');
      }
    } catch (err: any) {
      console.error('Error calculating compatibility:', err);
      setError(err.response?.data?.message || 'Error processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green.500';
    if (score >= 60) return 'teal.500';
    if (score >= 40) return 'yellow.500';
    if (score >= 20) return 'orange.500';
    return 'red.500';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    if (score >= 20) return 'Challenging';
    return 'Difficult';
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" size="xl" mb={2} color="maroon.700">
        Compatibility Analysis
      </Heading>
      <Text color="gray.600" mb={8}>
        Check your astrological compatibility with your partner
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
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            {/* Person 1 */}
            <Box>
              <Heading as="h3" size="md" mb={4} color="maroon.700">
                Person 1
              </Heading>
              <Stack spacing={4}>
                <FormControl id="person1-name" isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    value={formData.person1.name}
                    onChange={(e) => handleChange('person1', 'name', e.target.value)}
                    placeholder="Enter full name"
                    focusBorderColor="maroon.500"
                  />
                </FormControl>

                <FormControl id="person1-gender" isRequired>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    value={formData.person1.gender}
                    onChange={(e) => handleChange('person1', 'gender', e.target.value)}
                    focusBorderColor="maroon.500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Select>
                </FormControl>

                <FormControl id="person1-dob" isRequired>
                  <FormLabel>Date of Birth</FormLabel>
                  <Input
                    type="date"
                    value={formData.person1.dateOfBirth}
                    onChange={(e) => handleChange('person1', 'dateOfBirth', e.target.value)}
                    focusBorderColor="maroon.500"
                  />
                </FormControl>

                <FormControl id="person1-tob">
                  <FormLabel>Time of Birth (if known)</FormLabel>
                  <Input
                    type="time"
                    value={formData.person1.timeOfBirth}
                    onChange={(e) => handleChange('person1', 'timeOfBirth', e.target.value)}
                    focusBorderColor="maroon.500"
                  />
                </FormControl>

                <FormControl id="person1-pob">
                  <FormLabel>Place of Birth</FormLabel>
                  <Input
                    value={formData.person1.placeOfBirth}
                    onChange={(e) => handleChange('person1', 'placeOfBirth', e.target.value)}
                    placeholder="City, State, Country"
                    focusBorderColor="maroon.500"
                  />
                </FormControl>
              </Stack>
            </Box>

            {/* Person 2 */}
            <Box>
              <Heading as="h3" size="md" mb={4} color="maroon.700">
                Person 2
              </Heading>
              <Stack spacing={4}>
                <FormControl id="person2-name" isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    value={formData.person2.name}
                    onChange={(e) => handleChange('person2', 'name', e.target.value)}
                    placeholder="Enter full name"
                    focusBorderColor="maroon.500"
                  />
                </FormControl>

                <FormControl id="person2-gender" isRequired>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    value={formData.person2.gender}
                    onChange={(e) => handleChange('person2', 'gender', e.target.value)}
                    focusBorderColor="maroon.500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Select>
                </FormControl>

                <FormControl id="person2-dob" isRequired>
                  <FormLabel>Date of Birth</FormLabel>
                  <Input
                    type="date"
                    value={formData.person2.dateOfBirth}
                    onChange={(e) => handleChange('person2', 'dateOfBirth', e.target.value)}
                    focusBorderColor="maroon.500"
                  />
                </FormControl>

                <FormControl id="person2-tob">
                  <FormLabel>Time of Birth (if known)</FormLabel>
                  <Input
                    type="time"
                    value={formData.person2.timeOfBirth}
                    onChange={(e) => handleChange('person2', 'timeOfBirth', e.target.value)}
                    focusBorderColor="maroon.500"
                  />
                </FormControl>

                <FormControl id="person2-pob">
                  <FormLabel>Place of Birth</FormLabel>
                  <Input
                    value={formData.person2.placeOfBirth}
                    onChange={(e) => handleChange('person2', 'placeOfBirth', e.target.value)}
                    placeholder="City, State, Country"
                    focusBorderColor="maroon.500"
                  />
                </FormControl>
              </Stack>
            </Box>
          </SimpleGrid>

          <Button
            mt={8}
            colorScheme="maroon"
            size="lg"
            width="full"
            type="submit"
            isLoading={isLoading}
            loadingText="Calculating compatibility..."
          >
            Check Compatibility
          </Button>
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
          <Heading as="h2" size="lg" mb={4} color="maroon.700" textAlign="center">
            Compatibility Results
          </Heading>
          <Divider mb={6} />

          <Box textAlign="center" mb={8}>
            <Heading as="h3" size="xl" color={getScoreColor(result.overallScore)}>
              {result.overallScore}%
            </Heading>
            <Text fontSize="lg" fontWeight="medium" color={getScoreColor(result.overallScore)}>
              {getScoreText(result.overallScore)} Compatibility
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={8}>
            <Box>
              <Heading as="h3" size="md" mb={4} color="maroon.700">
                Compatibility Aspects
              </Heading>

              <Stack spacing={4}>
                <Box>
                  <Flex align="center" mb={1}>
                    <Icon as={FaHeart} color="red.400" mr={2} />
                    <Text fontWeight="medium">Emotional Compatibility</Text>
                  </Flex>
                  <Progress value={result.aspects.emotional} colorScheme="red" borderRadius="md" mb={1} />
                  <Text fontSize="sm" textAlign="right">{result.aspects.emotional}%</Text>
                </Box>

                <Box>
                  <Flex align="center" mb={1}>
                    <Icon as={FaComments} color="blue.400" mr={2} />
                    <Text fontWeight="medium">Communication</Text>
                  </Flex>
                  <Progress value={result.aspects.communication} colorScheme="blue" borderRadius="md" mb={1} />
                  <Text fontSize="sm" textAlign="right">{result.aspects.communication}%</Text>
                </Box>

                <Box>
                  <Flex align="center" mb={1}>
                    <Icon as={FaHandHoldingHeart} color="purple.400" mr={2} />
                    <Text fontWeight="medium">Shared Values</Text>
                  </Flex>
                  <Progress value={result.aspects.values} colorScheme="purple" borderRadius="md" mb={1} />
                  <Text fontSize="sm" textAlign="right">{result.aspects.values}%</Text>
                </Box>

                <Box>
                  <Flex align="center" mb={1}>
                    <Icon as={FaHome} color="teal.400" mr={2} />
                    <Text fontWeight="medium">Stability & Security</Text>
                  </Flex>
                  <Progress value={result.aspects.stability} colorScheme="teal" borderRadius="md" mb={1} />
                  <Text fontSize="sm" textAlign="right">{result.aspects.stability}%</Text>
                </Box>

                <Box>
                  <Flex align="center" mb={1}>
                    <Icon as={FaChild} color="green.400" mr={2} />
                    <Text fontWeight="medium">Growth Potential</Text>
                  </Flex>
                  <Progress value={result.aspects.growth} colorScheme="green" borderRadius="md" mb={1} />
                  <Text fontSize="sm" textAlign="right">{result.aspects.growth}%</Text>
                </Box>
              </Stack>
            </Box>

            <Box>
              <Heading as="h3" size="md" mb={4} color="maroon.700">
                Relationship Analysis
              </Heading>
              <Text mb={4}>{result.analysis}</Text>

              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} mt={6}>
                <Card variant="outline" borderColor="green.200" bg="green.50">
                  <CardHeader pb={2}>
                    <Heading size="sm" color="green.700">Relationship Strengths</Heading>
                  </CardHeader>
                  <CardBody pt={0}>
                    <Text>{result.strengths}</Text>
                  </CardBody>
                </Card>

                <Card variant="outline" borderColor="red.200" bg="red.50">
                  <CardHeader pb={2}>
                    <Heading size="sm" color="red.700">Potential Challenges</Heading>
                  </CardHeader>
                  <CardBody pt={0}>
                    <Text>{result.challenges}</Text>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </Box>
          </SimpleGrid>
        </Box>
      ) : null}
    </Container>
  );
};

export default Compatibility;