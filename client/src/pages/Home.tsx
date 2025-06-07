import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Icon,
  useColorModeValue,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaChartPie, FaStar, FaHeart, FaCalendarAlt } from 'react-icons/fa';

const Feature = ({ title, text, icon }: { title: string; text: string; icon: React.ReactElement }) => {
  return (
    <Stack align={'center'} textAlign={'center'}>
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'maroon.500'}
        mb={4}
      >
        {icon}
      </Flex>
      <Text fontWeight={600} fontSize={'xl'} mb={2}>{title}</Text>
      <Text color={'gray.600'}>{text}</Text>
    </Stack>
  );
};

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box 
        bg={useColorModeValue('saffron.50', 'gray.900')} 
        py={{ base: 10, md: 20 }}
        position="relative"
        overflow="hidden"
      >
        <Container maxW={'container.xl'}>
          <Stack
            align={'center'}
            spacing={{ base: 8, md: 10 }}
            py={{ base: 10, md: 20 }}
            direction={{ base: 'column', md: 'row' }}
          >
            <Stack flex={1} spacing={{ base: 5, md: 10 }}>
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
              >
                <Text
                  as={'span'}
                  position={'relative'}
                  color={'maroon.700'}
                >
                  Discover Your Cosmic Blueprint
                </Text>
                <br />
                <Text as={'span'} color={'maroon.500'}>
                  with JyotAIshya
                </Text>
              </Heading>
              <Text color={'gray.600'} fontSize={'xl'}>
                Explore the ancient wisdom of Vedic Astrology with modern technology.
                Uncover insights about your life path, relationships, and optimal timing
                for important decisions.
              </Text>
              <Stack
                spacing={{ base: 4, sm: 6 }}
                direction={{ base: 'column', sm: 'row' }}
              >
                <Button
                  as={RouterLink}
                  to="/kundali"
                  rounded={'full'}
                  size={'lg'}
                  fontWeight={'normal'}
                  px={6}
                  colorScheme={'maroon'}
                  bg={'maroon.500'}
                  _hover={{ bg: 'maroon.600' }}
                >
                  Get Your Birth Chart
                </Button>
                <Button
                  as={RouterLink}
                  to="/horoscope"
                  rounded={'full'}
                  size={'lg'}
                  fontWeight={'normal'}
                  px={6}
                  variant="outline"
                  colorScheme={'maroon'}
                >
                  Daily Horoscope
                </Button>
              </Stack>
            </Stack>
            <Flex
              flex={1}
              justify={'center'}
              align={'center'}
              position={'relative'}
              w={'full'}
            >
              <Box
                position={'relative'}
                height={'400px'}
                width={'full'}
                overflow={'hidden'}
                borderRadius={'xl'}
              >
                <Image
                  alt={'Hero Image'}
                  fit={'cover'}
                  align={'center'}
                  w={'100%'}
                  h={'100%'}
                  src={'https://images.unsplash.com/photo-1518558997970-4ddc236affcd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'}
                />
              </Box>
            </Flex>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20}>
        <Container maxW={'container.xl'}>
          <VStack spacing={8} mb={16}>
            <Heading
              fontWeight={600}
              fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
              lineHeight={'110%'}
              color={'maroon.700'}
              textAlign="center"
            >
              Explore Vedic Astrology <br />
              <Text as={'span'} color={'maroon.500'}>
                With Our Powerful Tools
              </Text>
            </Heading>
            <Text color={'gray.600'} fontSize={'xl'} textAlign="center" maxW={'3xl'}>
              JyotAIshya combines ancient Vedic wisdom with modern technology to provide
              accurate and insightful astrological guidance for your life journey.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
            <Feature
              icon={<Icon as={FaChartPie} w={10} h={10} />}
              title={'Birth Chart Analysis'}
              text={'Get a detailed analysis of your birth chart (Kundali) with planetary positions and house interpretations.'}
            />
            <Feature
              icon={<Icon as={FaStar} w={10} h={10} />}
              title={'Daily Horoscope'}
              text={'Receive personalized daily, weekly, and monthly horoscope predictions based on your birth details.'}
            />
            <Feature
              icon={<Icon as={FaHeart} w={10} h={10} />}
              title={'Compatibility Matching'}
              text={'Check your compatibility with partners through traditional Vedic compatibility metrics.'}
            />
            <Feature
              icon={<Icon as={FaCalendarAlt} w={10} h={10} />}
              title={'Muhurta (Timing)'}
              text={'Find auspicious times for important events like marriage, travel, or starting new ventures.'}
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box bg={'saffron.100'} py={16}>
        <Container maxW={'container.xl'}>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={10}
            align={'center'}
            justify={'center'}
          >
            <Stack flex={1} spacing={6}>
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: '2xl', sm: '3xl', lg: '4xl' }}
                color={'maroon.700'}
              >
                Start Your Astrological Journey Today
              </Heading>
              <Text color={'gray.600'} fontSize={'lg'}>
                Create an account to save your birth chart, track your horoscope, and access
                premium features for deeper astrological insights.
              </Text>
              <HStack spacing={4}>
                <Button
                  as={RouterLink}
                  to="/register"
                  rounded={'full'}
                  px={6}
                  py={6}
                  colorScheme={'maroon'}
                  bg={'maroon.500'}
                  _hover={{ bg: 'maroon.600' }}
                  size="lg"
                >
                  Sign Up - It's Free
                </Button>
                <Button
                  as={RouterLink}
                  to="/login"
                  rounded={'full'}
                  px={6}
                  py={6}
                  variant="outline"
                  colorScheme={'maroon'}
                  size="lg"
                >
                  Login
                </Button>
              </HStack>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;