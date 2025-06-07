import { Box, Container, Text, Flex, Link, Icon, VStack, HStack, Divider } from '@chakra-ui/react';
import { FaHeart, FaTwitter, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box as="footer" bg="saffron.100" py={8} mt="auto">
      <Container maxW="container.xl">
        <Flex 
          direction={{ base: 'column', md: 'row' }} 
          justify="space-between" 
          align={{ base: 'center', md: 'flex-start' }}
          mb={8}
        >
          <VStack align="flex-start" mb={{ base: 6, md: 0 }}>
            <Text fontSize="xl" fontWeight="bold" color="maroon.700" mb={2}>
              JyotAIshya
            </Text>
            <Text color="gray.600" maxW="300px">
              Vedic Astrology for the modern age, combining ancient wisdom with modern technology.
            </Text>
          </VStack>

          <VStack align="flex-start" mb={{ base: 6, md: 0 }}>
            <Text fontSize="lg" fontWeight="bold" color="maroon.700" mb={2}>
              Quick Links
            </Text>
            <Link href="/" color="gray.600" _hover={{ color: 'maroon.500' }}>Home</Link>
            <Link href="/kundali" color="gray.600" _hover={{ color: 'maroon.500' }}>Birth Chart</Link>
            <Link href="/horoscope" color="gray.600" _hover={{ color: 'maroon.500' }}>Horoscope</Link>
            <Link href="/compatibility" color="gray.600" _hover={{ color: 'maroon.500' }}>Compatibility</Link>
          </VStack>

          <VStack align="flex-start" mb={{ base: 6, md: 0 }}>
            <Text fontSize="lg" fontWeight="bold" color="maroon.700" mb={2}>
              Resources
            </Text>
            <Link href="#" color="gray.600" _hover={{ color: 'maroon.500' }}>Blog</Link>
            <Link href="#" color="gray.600" _hover={{ color: 'maroon.500' }}>Learn Astrology</Link>
            <Link href="#" color="gray.600" _hover={{ color: 'maroon.500' }}>FAQ</Link>
            <Link href="#" color="gray.600" _hover={{ color: 'maroon.500' }}>Contact Us</Link>
          </VStack>

          <VStack align="flex-start">
            <Text fontSize="lg" fontWeight="bold" color="maroon.700" mb={2}>
              Connect With Us
            </Text>
            <HStack spacing={4}>
              <Link href="#" aria-label="Twitter">
                <Icon as={FaTwitter} boxSize={5} color="gray.600" _hover={{ color: 'maroon.500' }} />
              </Link>
              <Link href="#" aria-label="Facebook">
                <Icon as={FaFacebook} boxSize={5} color="gray.600" _hover={{ color: 'maroon.500' }} />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Icon as={FaInstagram} boxSize={5} color="gray.600" _hover={{ color: 'maroon.500' }} />
              </Link>
              <Link href="#" aria-label="YouTube">
                <Icon as={FaYoutube} boxSize={5} color="gray.600" _hover={{ color: 'maroon.500' }} />
              </Link>
            </HStack>
          </VStack>
        </Flex>

        <Divider borderColor="gray.300" />

        <Flex 
          direction={{ base: 'column', sm: 'row' }} 
          justify="space-between" 
          align="center"
          pt={4}
        >
          <Text color="gray.600" fontSize="sm" mb={{ base: 2, sm: 0 }}>
            © {currentYear} JyotAIshya. All rights reserved.
          </Text>
          <Text color="gray.600" fontSize="sm">
            Made with <Icon as={FaHeart} color="maroon.500" mx={1} /> for astrology enthusiasts
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;