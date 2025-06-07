import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';

// Pages
import Home from './pages/Home';
import Kundali from './pages/Kundali';
import Horoscope from './pages/Horoscope';
import Compatibility from './pages/Compatibility';
import Muhurta from './pages/Muhurta';
import Doshas from './pages/Doshas';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Context
import { AuthProvider } from './context/AuthContext';

// Custom theme with Vedic/Hindu aesthetic
const theme = extendTheme({
  colors: {
    saffron: {
      50: '#fff9e6',
      100: '#ffecb3',
      200: '#ffe080',
      300: '#ffd34d',
      400: '#ffc61a',
      500: '#e6ac00',
      600: '#b38600',
      700: '#805f00',
      800: '#4d3900',
      900: '#1a1300',
    },
    maroon: {
      50: '#ffe6e6',
      100: '#ffb3b3',
      200: '#ff8080',
      300: '#ff4d4d',
      400: '#ff1a1a',
      500: '#e60000',
      600: '#b30000',
      700: '#800000',
      800: '#4d0000',
      900: '#1a0000',
    },
    ochre: {
      50: '#fff8e6',
      100: '#ffeab3',
      200: '#ffdc80',
      300: '#ffce4d',
      400: '#ffc01a',
      500: '#e6a800',
      600: '#b38300',
      700: '#805e00',
      800: '#4d3800',
      900: '#1a1300',
    },
  },
  fonts: {
    heading: '"Poppins", sans-serif',
    body: '"Poppins", sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: '#FFF9E6',
        color: '#333',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'maroon.500',
          color: 'white',
          _hover: {
            bg: 'maroon.600',
          },
        },
        outline: {
          borderColor: 'maroon.500',
          color: 'maroon.500',
          _hover: {
            bg: 'maroon.50',
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        color: 'maroon.700',
        fontWeight: 'bold',
      },
    },
  },
});

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <div className="app">
            <Header toggleSidebar={toggleSidebar} />
            <div className="content-container">
              <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/kundali" element={<Kundali />} />
                  <Route path="/horoscope" element={<Horoscope />} />
                  <Route path="/compatibility" element={<Compatibility />} />
                  <Route path="/muhurta" element={<Muhurta />} />
                  <Route path="/doshas" element={<Doshas />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;