import {
  Box,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Heading,
  Link,
  Icon,
  Flex,
  Text,
  Divider,
  useColorModeValue
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaUser, 
  FaStar, 
  FaHeart, 
  FaCalendarAlt, 
  FaExclamationTriangle,
  FaChartPie
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const NavItem = ({ to, icon, label, isActive }: NavItemProps) => {
  const activeBg = useColorModeValue('maroon.50', 'maroon.900');
  const hoverBg = useColorModeValue('maroon.50', 'maroon.800');
  const activeColor = 'maroon.700';
  const color = useColorModeValue('gray.700', 'gray.200');

  return (
    <Link
      as={RouterLink}
      to={to}
      textDecoration="none"
      _hover={{ textDecoration: 'none' }}
      width="100%"
    >
      <Flex
        align="center"
        p={3}
        borderRadius="md"
        role="group"
        cursor="pointer"
        bg={isActive ? activeBg : 'transparent'}
        color={isActive ? activeColor : color}
        _hover={{ bg: hoverBg, color: activeColor }}
        fontWeight={isActive ? 'bold' : 'normal'}
      >
        <Icon
          as={icon}
          mr={4}
          fontSize="18px"
          color={isActive ? activeColor : color}
          _groupHover={{ color: activeColor }}
        />
        <Text>{label}</Text>
      </Flex>
    </Link>
  );
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const navItems = [
    { to: '/', icon: FaHome, label: 'Home' },
    { to: '/kundali', icon: FaChartPie, label: 'Birth Chart' },
    { to: '/horoscope', icon: FaStar, label: 'Horoscope' },
    { to: '/compatibility', icon: FaHeart, label: 'Compatibility' },
    { to: '/muhurta', icon: FaCalendarAlt, label: 'Muhurta' },
    { to: '/doshas', icon: FaExclamationTriangle, label: 'Doshas' },
  ];

  const authItems = [
    { to: '/dashboard', icon: FaUser, label: 'Dashboard' },
  ];

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent bg={useColorModeValue('white', 'gray.800')}>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          <Heading size="md" color="maroon.700">JyotAIshya</Heading>
        </DrawerHeader>
        <DrawerBody>
          <VStack spacing={1} align="stretch" mt={4}>
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.to}
              />
            ))}

            {isAuthenticated && (
              <>
                <Divider my={4} />
                <Text fontWeight="bold" mb={2} color="gray.500" fontSize="sm" px={3}>
                  ACCOUNT
                </Text>
                {authItems.map((item) => (
                  <NavItem
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    isActive={location.pathname === item.to}
                  />
                ))}
              </>
            )}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default Sidebar;