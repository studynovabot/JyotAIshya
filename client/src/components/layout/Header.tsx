import { 
  Box, 
  Flex, 
  Heading, 
  IconButton, 
  Button, 
  useColorModeValue,
  HStack,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar
} from '@chakra-ui/react';
import { HamburgerIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box
      as="header"
      bg={useColorModeValue('saffron.100', 'saffron.900')}
      px={4}
      py={2}
      boxShadow="md"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <IconButton
            icon={<HamburgerIcon />}
            variant="outline"
            onClick={toggleSidebar}
            aria-label="Open Menu"
            mr={4}
          />
          <Heading 
            as={RouterLink} 
            to="/" 
            size="lg" 
            color="maroon.700"
            fontFamily="'Poppins', sans-serif"
            fontWeight="bold"
          >
            JyotAIshya
          </Heading>
        </Flex>

        <HStack spacing={4}>
          {isAuthenticated ? (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                variant="ghost"
              >
                <Flex alignItems="center">
                  <Avatar size="sm" name={user?.name} mr={2} />
                  {user?.name}
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/dashboard">Dashboard</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <>
              <Button as={RouterLink} to="/login" variant="outline" colorScheme="maroon">
                Login
              </Button>
              <Button as={RouterLink} to="/register" colorScheme="maroon">
                Register
              </Button>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;