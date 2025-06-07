import { Alert, AlertIcon, AlertTitle, AlertDescription, Box, Button } from '@chakra-ui/react';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

const ErrorDisplay = ({ 
  title = 'Error', 
  message, 
  onRetry 
}: ErrorDisplayProps) => {
  return (
    <Alert
      status="error"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      borderRadius="md"
      py={6}
      my={4}
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        {title}
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        {message}
      </AlertDescription>
      {onRetry && (
        <Box mt={4}>
          <Button colorScheme="red" onClick={onRetry}>
            Try Again
          </Button>
        </Box>
      )}
    </Alert>
  );
};

export default ErrorDisplay;