import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import api from '../utils/api';

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

      // Try the users endpoint first (for server deployment)
      try {
        const response = await api.get('/users/me');

        if (response.data.success) {
          setUser(response.data.data);
          return;
        }
      } catch (userEndpointError) {
        console.log('Trying alternative auth endpoint for user data...');
        // If users endpoint fails, try the auth endpoint (for Vercel serverless)
        const response = await api.get('/auth/me');

        if (response.data.success) {
          setUser(response.data.data);
          return;
        } else {
          // If the token is invalid, clear it
          localStorage.removeItem('token');
          setToken(null);
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

      // Try the users endpoint first (for server deployment)
      try {
        const response = await api.post('/users/login', {
          email,
          password
        });

        if (response.data.success) {
          const { user: userData, token: authToken } = response.data.data;
          setUser(userData);
          setToken(authToken);
          localStorage.setItem('token', authToken);
          return;
        }
      } catch (userEndpointError) {
        console.log('Trying alternative auth endpoint...');
        // If users endpoint fails, try the auth endpoint (for Vercel serverless)
        const response = await api.post('/auth/login', {
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
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Try the users endpoint first (for server deployment)
      try {
        const response = await api.post('/users/register', {
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
        }
      } catch (userEndpointError) {
        console.log('Trying alternative auth endpoint...');
        // If users endpoint fails, try the auth endpoint (for Vercel serverless)
        const response = await api.post('/auth/register', {
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
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || err.response?.data?.message || 'Registration failed');
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