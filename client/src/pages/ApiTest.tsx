import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Alert,
  AlertIcon,
  Code,
  Divider,
  Badge,
  useColorModeValue,
  Spinner,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
} from '@chakra-ui/react';
import { api, fetchAPI, API_URL } from '../utils/api';

interface ApiTestResult {
  endpoint: string;
  method: string;
  status: 'pending' | 'success' | 'error';
  response?: any;
  error?: string;
  duration?: number;
}

const ApiTest: React.FC = () => {
  const [testResults, setTestResults] = useState<ApiTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [environmentInfo, setEnvironmentInfo] = useState<any>({});

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    // Gather environment information
    setEnvironmentInfo({
      hostname: window.location.hostname,
      port: window.location.port,
      protocol: window.location.protocol,
      apiUrl: API_URL,
      isDev: import.meta.env.DEV,
      mode: import.meta.env.MODE,
      viteApiUrl: import.meta.env.VITE_API_URL,
    });
  }, []);

  const testEndpoints = [
    { endpoint: '/health', method: 'GET', description: 'Health Check' },
    { endpoint: '/', method: 'GET', description: 'API Info' },
    { endpoint: '/kundali/generate', method: 'POST', description: 'Kundali Generation', data: {
      name: 'Test User',
      birthDate: '1990-05-15',
      birthTime: '14:30',
      birthPlace: 'Delhi'
    }},
    { endpoint: '/horoscope/daily?rashi=mesh', method: 'GET', description: 'Daily Horoscope' },
    { endpoint: '/astro/coordinates?place=Delhi', method: 'GET', description: 'Coordinates Lookup' },
  ];

  const runSingleTest = async (test: typeof testEndpoints[0]): Promise<ApiTestResult> => {
    const startTime = Date.now();
    
    try {
      let response;
      
      if (test.method === 'GET') {
        response = await api.get(test.endpoint);
      } else if (test.method === 'POST') {
        response = await api.post(test.endpoint, test.data);
      }
      
      const duration = Date.now() - startTime;
      
      return {
        endpoint: test.endpoint,
        method: test.method,
        status: 'success',
        response: response.data,
        duration,
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      return {
        endpoint: test.endpoint,
        method: test.method,
        status: 'error',
        error: error.message || 'Unknown error',
        duration,
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    for (const test of testEndpoints) {
      // Add pending result
      setTestResults(prev => [...prev, {
        endpoint: test.endpoint,
        method: test.method,
        status: 'pending'
      }]);

      // Run the test
      const result = await runSingleTest(test);
      
      // Update with actual result
      setTestResults(prev => 
        prev.map(item => 
          item.endpoint === test.endpoint && item.method === test.method 
            ? result 
            : item
        )
      );

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'green';
      case 'error': return 'red';
      case 'pending': return 'yellow';
      default: return 'gray';
    }
  };

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Box textAlign="center">
          <Heading size="lg" mb={2}>API Integration Test</Heading>
          <Text color="gray.600">
            Test frontend-backend connectivity and API endpoints
          </Text>
        </Box>

        {/* Environment Information */}
        <Card bg={bgColor} borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Environment Information</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
                <Text fontWeight="bold">Hostname:</Text>
                <Code>{environmentInfo.hostname}</Code>
              </Box>
              <Box>
                <Text fontWeight="bold">Port:</Text>
                <Code>{environmentInfo.port || 'N/A'}</Code>
              </Box>
              <Box>
                <Text fontWeight="bold">API URL:</Text>
                <Code>{environmentInfo.apiUrl}</Code>
              </Box>
              <Box>
                <Text fontWeight="bold">Environment:</Text>
                <Code>{environmentInfo.isDev ? 'Development' : 'Production'}</Code>
              </Box>
              <Box>
                <Text fontWeight="bold">Mode:</Text>
                <Code>{environmentInfo.mode}</Code>
              </Box>
              <Box>
                <Text fontWeight="bold">Vite API URL:</Text>
                <Code>{environmentInfo.viteApiUrl || 'N/A'}</Code>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Test Controls */}
        <HStack justify="center">
          <Button
            colorScheme="blue"
            onClick={runAllTests}
            isLoading={isRunning}
            loadingText="Running Tests..."
            size="lg"
          >
            Run API Tests
          </Button>
        </HStack>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card bg={bgColor} borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Test Results</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {testResults.map((result, index) => (
                  <Box key={index} p={4} border="1px" borderColor={borderColor} borderRadius="md">
                    <HStack justify="space-between" mb={2}>
                      <HStack>
                        <Badge colorScheme={getStatusColor(result.status)}>
                          {result.status.toUpperCase()}
                        </Badge>
                        <Text fontWeight="bold">{result.method}</Text>
                        <Code>{result.endpoint}</Code>
                      </HStack>
                      {result.duration && (
                        <Text fontSize="sm" color="gray.500">
                          {result.duration}ms
                        </Text>
                      )}
                      {result.status === 'pending' && <Spinner size="sm" />}
                    </HStack>

                    {result.status === 'success' && result.response && (
                      <Box>
                        <Text fontSize="sm" fontWeight="bold" mb={1}>Response:</Text>
                        <Code display="block" p={2} fontSize="xs" whiteSpace="pre-wrap">
                          {JSON.stringify(result.response, null, 2)}
                        </Code>
                      </Box>
                    )}

                    {result.status === 'error' && result.error && (
                      <Alert status="error" size="sm">
                        <AlertIcon />
                        <Text fontSize="sm">{result.error}</Text>
                      </Alert>
                    )}
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Summary */}
        {testResults.length > 0 && !isRunning && (
          <Alert 
            status={testResults.every(r => r.status === 'success') ? 'success' : 'warning'}
          >
            <AlertIcon />
            <Text>
              {testResults.filter(r => r.status === 'success').length} of {testResults.length} tests passed
            </Text>
          </Alert>
        )}
      </VStack>
    </Container>
  );
};

export default ApiTest;
