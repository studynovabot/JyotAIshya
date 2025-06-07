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
  Badge,
  Flex,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { FaCalendarAlt, FaClock, FaStar, FaExclamationTriangle } from 'react-icons/fa';
import { api } from '../utils/api';

interface MuhurtaFormData {
  eventType: string;
  startDate: string;
  endDate: string;
  location: string;
}

interface AuspiciousTime {
  date: string;
  startTime: string;
  endTime: string;
  score: number;
  nakshatra: string;
  tithi: string;
  yoga: string;
  karana: string;
  notes: string;
}

const eventTypes = [
  'marriage',
  'housewarming',
  'travel',
  'business',
  'medical',
  'education',
  'religious',
  'other'
];

const Muhurta = () => {
  const [formData, setFormData] = useState<MuhurtaFormData>({
    eventType: '',
    startDate: '',
    endDate: '',
    location: '',
  });
  
  const [auspiciousTimes, setAuspiciousTimes] = useState<AuspiciousTime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.eventType) {
      setError('Please select an event type');
      return;
    }
    
    if (!formData.startDate || !formData.endDate) {
      setError('Please select both start and end dates');
      return;
    }
    
    if (!formData.location) {
      setError('Please enter a location');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.post('/muhurta/calculate', {
        date: formData.startDate,
        activity: formData.eventType
      });
      
      if (response.data.success) {
        setAuspiciousTimes(response.data.data);
      } else {
        setError(response.data.message || 'Failed to find auspicious times');
      }
    } catch (err: any) {
      console.error('Error finding muhurta:', err);
      setError(err.response?.data?.message || 'Error processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) {
      return <Badge colorScheme="green">Excellent</Badge>;
    } else if (score >= 60) {
      return <Badge colorScheme="teal">Good</Badge>;
    } else if (score >= 40) {
      return <Badge colorScheme="yellow">Average</Badge>;
    } else {
      return <Badge colorScheme="orange">Fair</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" size="xl" mb={2} color="maroon.700">
        Muhurta (Auspicious Timing)
      </Heading>
      <Text color="gray.600" mb={8}>
        Find the most auspicious times for important events based on Vedic astrology
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
            <FormControl id="eventType" isRequired>
              <FormLabel>Event Type</FormLabel>
              <Select
                name="eventType"
                placeholder="Select event type"
                value={formData.eventType}
                onChange={handleChange}
                focusBorderColor="maroon.500"
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </Select>
            </FormControl>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl id="startDate" isRequired>
                <FormLabel>Start Date</FormLabel>
                <Input
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  focusBorderColor="maroon.500"
                />
              </FormControl>

              <FormControl id="endDate" isRequired>
                <FormLabel>End Date</FormLabel>
                <Input
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  focusBorderColor="maroon.500"
                />
              </FormControl>
            </SimpleGrid>

            <FormControl id="location" isRequired>
              <FormLabel>Location</FormLabel>
              <Input
                name="location"
                value={formData.location}
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
              loadingText="Finding auspicious times..."
            >
              Find Auspicious Times
            </Button>
          </Stack>
        </form>
      </Box>

      {isLoading ? (
        <Center py={10}>
          <Spinner size="xl" color="maroon.500" />
        </Center>
      ) : auspiciousTimes.length > 0 ? (
        <Box
          bg={useColorModeValue('white', 'gray.700')}
          p={8}
          borderRadius="lg"
          boxShadow="base"
        >
          <Heading as="h2" size="lg" mb={4} color="maroon.700">
            Auspicious Times for {formData.eventType.charAt(0).toUpperCase() + formData.eventType.slice(1)}
          </Heading>
          <Divider mb={6} />

          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Time</Th>
                  <Th>Quality</Th>
                  <Th>Nakshatra</Th>
                  <Th>Tithi</Th>
                  <Th>Notes</Th>
                </Tr>
              </Thead>
              <Tbody>
                {auspiciousTimes.map((time, index) => (
                  <Tr key={index}>
                    <Td>{formatDate(time.date)}</Td>
                    <Td>{time.startTime} - {time.endTime}</Td>
                    <Td>{getScoreBadge(time.score)}</Td>
                    <Td>{time.nakshatra}</Td>
                    <Td>{time.tithi}</Td>
                    <Td>{time.notes}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          <Box mt={8} p={4} bg="yellow.50" borderRadius="md">
            <Flex align="center" mb={2}>
              <Icon as={FaExclamationTriangle} color="yellow.500" mr={2} />
              <Text fontWeight="bold" color="yellow.700">Important Note</Text>
            </Flex>
            <Text fontSize="sm">
              These timings are calculated based on Vedic astrological principles. While they represent 
              traditionally auspicious times, personal circumstances and modern considerations should 
              also be taken into account when planning your event.
            </Text>
          </Box>
        </Box>
      ) : null}
    </Container>
  );
};

export default Muhurta;