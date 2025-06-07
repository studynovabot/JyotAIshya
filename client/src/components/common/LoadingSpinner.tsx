import { Spinner, Center, Text, VStack } from '@chakra-ui/react';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  fullPage?: boolean;
}

const LoadingSpinner = ({ 
  size = 'xl', 
  message = 'Loading...', 
  fullPage = false 
}: LoadingSpinnerProps) => {
  const content = (
    <VStack spacing={4}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="maroon.500"
        size={size}
      />
      {message && <Text color="maroon.700">{message}</Text>}
    </VStack>
  );

  if (fullPage) {
    return (
      <Center height="100vh" width="100%">
        {content}
      </Center>
    );
  }

  return (
    <Center py={10} width="100%">
      {content}
    </Center>
  );
};

export default LoadingSpinner;