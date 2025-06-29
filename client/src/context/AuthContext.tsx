import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import api, { retryableRequest } from '../utils/api';

// Define the User type
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// Define the AuthContext type
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUserData(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Fetch user data with token
  const fetchUserData = async (authToken: string) => {
    try {
      setIsLoading(true);
      // Temporarily set the token in localStorage for the API call
      localStorage.setItem('token', authToken);

      // Try the consolidated auth endpoint first with retry mechanism
      try {
        const response = await retryableRequest(
          () => api.get('/auth?action=profile'),
          2, // max 2 retries
          1000 // 1 second delay between retries
        );

        if (response.data.success) {
          setUser(response.data.data);
          setIsLoading(false);
          return;
        }
      } catch (authEndpointError) {
        console.log('Trying alternative endpoints for user data...');
        
        // Try the users endpoint (for server deployment)
        try {
          const response = await retryableRequest(
            () => api.get('/users/me'),
            2,
            1000
          );

          if (response.data.success) {
            setUser(response.data.data);
            setIsLoading(false);
            return;
          }
        } catch (userEndpointError) {
          // If users endpoint fails, try the old auth endpoint again
          try {
            const response = await api.get('/auth?action=profile');

            if (response.data.success) {
              setUser(response.data.data);
              setIsLoading(false);
              return;
            } else {
              // If the token is invalid, clear it
              localStorage.removeItem('token');
              setToken(null);
            }
          } catch (finalError) {
            // All attempts failed
            localStorage.removeItem('token');
            setToken(null);
            setError('Unable to authenticate. Please login again.');
          }
        }
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      localStorage.removeItem('token');
      setToken(null);
      setError('Session expired. Please login again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Try the consolidated auth endpoint first
      try {
        const response = await retryableRequest(
          () => api.post('/auth?action=login', { email, password }),
          2,
          1000
        );

        if (response.data.success) {
          const { user: userData, token: authToken } = response.data.data;
          setUser(userData);
          setToken(authToken);
          localStorage.setItem('token', authToken);
          return;
        }
      } catch (authEndpointError: any) {
        console.log('Trying alternative endpoints...');
        
        // If error is client-side (like validation), don't try other endpoints
        if (authEndpointError.response && authEndpointError.response.status < 500) {
          throw authEndpointError;
        }
        
        // Try the users endpoint (for server deployment)
        try {
          const response = await retryableRequest(
            () => api.post('/users/login', { email, password }),
            2,
            1000
          );

          if (response.data.success) {
            const { user: userData, token: authToken } = response.data.data;
            setUser(userData);
            setToken(authToken);
            localStorage.setItem('token', authToken);
            return;
          }
        } catch (userEndpointError: any) {
          // If error is client-side (like validation), don't try other endpoints
          if (userEndpointError.response && userEndpointError.response.status < 500) {
            throw userEndpointError;
          }
          
          // If users endpoint fails, try the old auth endpoint
          try {
            const response = await api.post('/auth?action=login', {
              email,
              password
            });

            if (response.data.success) {
              const { user: userData, token: authToken } = response.data.data;
              setUser(userData);
              setToken(authToken);
              localStorage.setItem('token', authToken);
              return;
            } else {
              setError(response.data.message || 'Login failed');
            }
          } catch (finalError: any) {
            throw finalError;
          }
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Handle timeout specifically
      if (err.code === 'ECONNABORTED') {
        setError('The server is taking too long to respond. Please try again later.');
      } else {
        setError(err.message || err.response?.data?.message || 'Invalid email or password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Try the consolidated auth endpoint first
      try {
        const response = await retryableRequest(
          () => api.post('/auth?action=register', { name, email, password }),
          2,
          1000
        );

        if (response.data.success) {
          const { user: userData, token: authToken } = response.data.data;
          setUser(userData);
          setToken(authToken);
          localStorage.setItem('token', authToken);
          return;
        }
      } catch (authEndpointError: any) {
        console.log('Trying alternative endpoints...');
        
        // If error is client-side (like validation), don't try other endpoints
        if (authEndpointError.response && authEndpointError.response.status < 500) {
          throw authEndpointError;
        }
        
        // Try the users endpoint (for server deployment)
        try {
          const response = await retryableRequest(
            () => api.post('/users/register', { name, email, password }),
            2,
            1000
          );

          if (response.data.success) {
            const { user: userData, token: authToken } = response.data.data;
            setUser(userData);
            setToken(authToken);
            localStorage.setItem('token', authToken);
            return;
          }
        } catch (userEndpointError: any) {
          // If error is client-side (like validation), don't try other endpoints
          if (userEndpointError.response && userEndpointError.response.status < 500) {
            throw userEndpointError;
          }
          
          // If users endpoint fails, try the old auth endpoint
          try {
            const response = await api.post('/auth?action=register', {
              name,
              email,
              password
            });

            if (response.data.success) {
              const { user: userData, token: authToken } = response.data.data;
              setUser(userData);
              setToken(authToken);
              localStorage.setItem('token', authToken);
              return;
            } else {
              setError(response.data.message || 'Registration failed');
            }
          } catch (finalError: any) {
            throw finalError;
          }
        }
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      
      // Handle timeout specifically
      if (err.code === 'ECONNABORTED') {
        setError('The server is taking too long to respond. Please try again later.');
      } else {
        setError(err.message || err.response?.data?.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  // Context value
  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};