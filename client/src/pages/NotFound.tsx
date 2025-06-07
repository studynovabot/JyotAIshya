import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={8} textAlign="center">
        <Heading
          as="h1"
          size="2xl"
          color="maroon.700"
          fontWeight="bold"
        >
          404 - Page Not Found
        </Heading>
        
        <Text fontSize="xl" color="gray.600">
          Oops! The cosmic energies couldn't locate the page you're looking for.
        </Text>
        
        <Box maxW="400px" mx="auto">
          <Image
            src="https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
            alt="Starry sky"
            borderRadius="lg"
            opacity={0.8}
          />
        </Box>
        
        <Text fontSize="lg">
          Perhaps the stars have aligned differently, or Mercury is in retrograde.
        </Text>
        
        <Button
          as={RouterLink}
          to="/"
          size="lg"
          colorScheme="maroon"
          px={8}
          mt={4}
        >
          Return to Home
        </Button>
      </VStack>
    </Container>
  );
};

export default NotFound;