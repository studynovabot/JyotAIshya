import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Link,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import { FaChartPie, FaStar, FaHeart, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface Kundali {
  id: string;
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  createdAt: string;
}

const Dashboard = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [kundalis, setKundalis] = useState<Kundali[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bgColor = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchKundalis();
    }
  }, [isAuthenticated, token]);

  const fetchKundalis = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:3000/api/users/me/kundalis', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setKundalis(response.data.data);
      } else {
        setError('Failed to fetch birth charts');
      }
    } catch (err) {
      console.error('Error fetching kundalis:', err);
      setError('Error loading your birth charts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" size="xl" mb={2} color="maroon.700">
        Welcome, {user?.name}
      </Heading>
      <Text color="gray.600" mb={8}>
        Manage your astrological profiles and insights
      </Text>

      <Tabs colorScheme="maroon" variant="enclosed" mb={8}>
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Birth Charts</Tab>
          <Tab>Readings</Tab>
          <Tab>Settings</Tab>
        </TabList>

        <TabPanels>
          {/* Overview Panel */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
              <Stat
                px={4}
                py={5}
                bg={bgColor}
                shadow="base"
                rounded="lg"
                borderLeft="4px solid"
                borderColor="maroon.500"
              >
                <StatLabel fontWeight="medium" isTruncated>
                  Birth Charts
                </StatLabel>
                <StatNumber fontSize="3xl" fontWeight="medium">
                  {kundalis.length}
                </StatNumber>
                <StatHelpText>
                  Saved profiles
                </StatHelpText>
              </Stat>

              <Stat
                px={4}
                py={5}
                bg={bgColor}
                shadow="base"
                rounded="lg"
                borderLeft="4px solid"
                borderColor="saffron.500"
              >
                <StatLabel fontWeight="medium" isTruncated>
                  Horoscope Readings
                </StatLabel>
                <StatNumber fontSize="3xl" fontWeight="medium">
                  0
                </StatNumber>
                <StatHelpText>
                  Last 30 days
                </StatHelpText>
              </Stat>

              <Stat
                px={4}
                py={5}
                bg={bgColor}
                shadow="base"
                rounded="lg"
                borderLeft="4px solid"
                borderColor="ochre.500"
              >
                <StatLabel fontWeight="medium" isTruncated>
                  Compatibility Checks
                </StatLabel>
                <StatNumber fontSize="3xl" fontWeight="medium">
                  0
                </StatNumber>
                <StatHelpText>
                  Total matches
                </StatHelpText>
              </Stat>
            </SimpleGrid>

            <Heading as="h3" size="md" mb={4} color="maroon.700">
              Quick Actions
            </Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6} mb={8}>
              <Card align="center" variant="outline">
                <CardBody>
                  <Icon as={FaChartPie} boxSize={10} color="maroon.500" mb={4} />
                  <Heading size="md" mb={2}>Birth Chart</Heading>
                  <Text textAlign="center">Create or view your detailed birth chart</Text>
                </CardBody>
                <CardFooter pt={0}>
                  <Button as={RouterLink} to="/kundali" colorScheme="maroon" variant="outline">
                    Go to Birth Chart
                  </Button>
                </CardFooter>
              </Card>

              <Card align="center" variant="outline">
                <CardBody>
                  <Icon as={FaStar} boxSize={10} color="saffron.500" mb={4} />
                  <Heading size="md" mb={2}>Horoscope</Heading>
                  <Text textAlign="center">Check your daily, weekly, or monthly horoscope</Text>
                </CardBody>
                <CardFooter pt={0}>
                  <Button as={RouterLink} to="/horoscope" colorScheme="maroon" variant="outline">
                    View Horoscope
                  </Button>
                </CardFooter>
              </Card>

              <Card align="center" variant="outline">
                <CardBody>
                  <Icon as={FaHeart} boxSize={10} color="red.400" mb={4} />
                  <Heading size="md" mb={2}>Compatibility</Heading>
                  <Text textAlign="center">Check compatibility with your partner</Text>
                </CardBody>
                <CardFooter pt={0}>
                  <Button as={RouterLink} to="/compatibility" colorScheme="maroon" variant="outline">
                    Check Match
                  </Button>
                </CardFooter>
              </Card>

              <Card align="center" variant="outline">
                <CardBody>
                  <Icon as={FaCalendarAlt} boxSize={10} color="ochre.500" mb={4} />
                  <Heading size="md" mb={2}>Muhurta</Heading>
                  <Text textAlign="center">Find auspicious times for important events</Text>
                </CardBody>
                <CardFooter pt={0}>
                  <Button as={RouterLink} to="/muhurta" colorScheme="maroon" variant="outline">
                    Find Timing
                  </Button>
                </CardFooter>
              </Card>
            </SimpleGrid>
          </TabPanel>

          {/* Birth Charts Panel */}
          <TabPanel>
            <Flex justify="space-between" align="center" mb={6}>
              <Heading as="h3" size="md" color="maroon.700">
                Your Birth Charts
              </Heading>
              <Button 
                as={RouterLink} 
                to="/kundali" 
                colorScheme="maroon" 
                leftIcon={<FaPlus />}
              >
                New Birth Chart
              </Button>
            </Flex>

            {isLoading ? (
              <Center py={10}>
                <Spinner size="xl" color="maroon.500" />
              </Center>
            ) : error ? (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            ) : kundalis.length === 0 ? (
              <Box textAlign="center" py={10} px={6}>
                <Text fontSize="lg" mb={4}>
                  You haven't created any birth charts yet.
                </Text>
                <Button 
                  as={RouterLink} 
                  to="/kundali" 
                  colorScheme="maroon" 
                  leftIcon={<FaPlus />}
                >
                  Create Your First Birth Chart
                </Button>
              </Box>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {kundalis.map((kundali) => (
                  <Card key={kundali.id} variant="outline">
                    <CardHeader pb={0}>
                      <Heading size="md" color="maroon.700">{kundali.name}</Heading>
                    </CardHeader>
                    <CardBody>
                      <Text>Born on: {formatDate(kundali.dateOfBirth)}</Text>
                      <Text>Time: {kundali.timeOfBirth}</Text>
                      <Text>Place: {kundali.placeOfBirth}</Text>
                      <Text fontSize="sm" color="gray.500" mt={2}>
                        Created: {formatDate(kundali.createdAt)}
                      </Text>
                    </CardBody>
                    <CardFooter pt={0}>
                      <Button 
                        as={RouterLink} 
                        to={`/kundali?id=${kundali.id}`} 
                        colorScheme="maroon" 
                        variant="outline"
                        size="sm"
                      >
                        View Chart
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </TabPanel>

          {/* Readings Panel */}
          <TabPanel>
            <Box textAlign="center" py={10} px={6}>
              <Text fontSize="lg" mb={4}>
                Your past readings and interpretations will appear here.
              </Text>
              <Text color="gray.600" mb={6}>
                Get a reading by visiting the Horoscope or Birth Chart sections.
              </Text>
              <Flex justify="center" gap={4}>
                <Button as={RouterLink} to="/horoscope" colorScheme="maroon">
                  Get Horoscope Reading
                </Button>
                <Button as={RouterLink} to="/kundali" colorScheme="maroon" variant="outline">
                  Birth Chart Reading
                </Button>
              </Flex>
            </Box>
          </TabPanel>

          {/* Settings Panel */}
          <TabPanel>
            <Box bg={bgColor} p={6} rounded="md" shadow="md">
              <Heading as="h3" size="md" mb={4} color="maroon.700">
                Account Settings
              </Heading>
              <Divider mb={6} />
              <Text mb={4}>
                Account management features will be available in future updates.
              </Text>
              <Text color="gray.600" mb={6}>
                You'll be able to update your profile, change password, and manage notification preferences.
              </Text>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default Dashboard;