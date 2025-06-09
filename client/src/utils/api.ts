import axios from 'axios';

// API base URL configuration for different environments
// Proper environment detection for Vercel deployment

// Check if we're running in development (localhost)
const isLocalDevelopment = window.location.hostname === 'localhost' ||
                          window.location.hostname === '127.0.0.1';

// Check if we're on Vercel deployment
const isVercelDeployment = window.location.hostname.includes('vercel.app');

// Check if we're running on Vite dev server
const isViteDevServer = window.location.port === '5173' && isLocalDevelopment;

// Determine if we're in development mode
const isDevelopment = import.meta.env.DEV && isLocalDevelopment;

// API URL configuration:
// 1. Local development (localhost:5173): Use local backend on port 3002
// 2. Vercel deployment: Use the same Vercel domain with /api path
// 3. Other production: Use environment variable or fallback

export const API_URL = (() => {
  if (isViteDevServer || isDevelopment) {
    // Local development - use local backend
    return 'http://localhost:3002/api';
  } else if (isVercelDeployment) {
    // Vercel deployment - use same domain with /api path
    return `https://${window.location.hostname}/api`;
  } else {
    // Other production environments
    return import.meta.env.VITE_API_URL || '/api';
  }
})();

// Debug logging for environment detection
console.log('🔧 API Configuration Debug:', {
  hostname: window.location.hostname,
  port: window.location.port,
  protocol: window.location.protocol,
  isLocalDevelopment,
  isVercelDeployment,
  isViteDevServer,
  isDevelopment,
  'import.meta.env.DEV': import.meta.env.DEV,
  'import.meta.env.MODE': import.meta.env.MODE,
  'import.meta.env.VITE_API_URL': import.meta.env.VITE_API_URL,
  finalApiUrl: API_URL,
  environmentMode: isDevelopment ? 'development' : 'production'
});

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Add a request interceptor to include auth token when available
api.interceptors.request.use(
  (config) => {
    console.log('Making API request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`
    });

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    console.log('API response received:', {
      status: response.status,
      url: response.config.url,
      method: response.config.method?.toUpperCase()
    });
    return response;
  },
  (error) => {
    console.error('API Error Details:', {
      message: error.message,
      code: error.code,
      response: error.response?.status,
      config: {
        method: error.config?.method,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      }
    });

    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        originalError: error
      });
    }

    // Handle specific HTTP status codes
    switch (error.response.status) {
      case 401:
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject({
          message: 'Your session has expired. Please log in again.',
          originalError: error.response.data
        });
      
      case 403:
        return Promise.reject({
          message: 'You do not have permission to access this resource.',
          originalError: error.response.data
        });
        
      case 404:
        return Promise.reject({
          message: 'The requested resource was not found.',
          originalError: error.response.data
        });
        
      case 500:
        return Promise.reject({
          message: 'Server error. Please try again later.',
          originalError: error.response.data
        });
        
      default:
        return Promise.reject({
          message: error.response.data?.message || 'An error occurred.',
          originalError: error.response.data
        });
    }
  }
);

// Alternative fetch-based API for cases where axios is blocked
export const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_URL}${endpoint}`;
  console.log('🌐 Fetch API request:', {
    url,
    method: options.method || 'GET',
    environment: {
      isDevelopment,
      isViteDevServer,
      isVercelDeployment,
      isLocalDevelopment
    }
  });

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('Fetch API response:', { status: response.status, url });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch API error:', error);
    throw error;
  }
};



export { api };
export default api;