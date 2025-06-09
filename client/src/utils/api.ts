import axios from 'axios';

// Helper function to determine the API URL (based on LearnQuest pattern)
function getApiUrl() {
  // If a VITE_API_URL env variable is set, use it (for flexibility in deployment)
  if (import.meta.env.VITE_API_URL) {
    console.log(`Using custom backend: ${import.meta.env.VITE_API_URL}`);
    return import.meta.env.VITE_API_URL;
  }

  // In production, use the actual deployed API URL
  if (import.meta.env.PROD) {
    // Use the current origin with /api path
    const origin = window.location.origin;

    // Check if we're on Vercel deployment
    if (origin.includes('vercel.app')) {
      // For Vercel deployments, use the same origin to avoid CORS issues
      const relativeApi = `${origin}/api`;
      console.log(`Using Vercel production API path: ${relativeApi}`);
      return relativeApi;
    } else {
      // For other production environments
      const relativeApi = `${origin}/api`;
      console.log(`Using production API path: ${relativeApi}`);
      return relativeApi;
    }
  }

  // For development, use the local backend server
  const localApi = 'http://localhost:3002/api';
  console.log(`Using local development API: ${localApi}`);
  return localApi;
}

export const API_URL = getApiUrl();

// Debug logging for environment detection
console.log('🔧 JyotAIshya API Configuration:', {
  hostname: window.location.hostname,
  port: window.location.port,
  protocol: window.location.protocol,
  'import.meta.env.PROD': import.meta.env.PROD,
  'import.meta.env.DEV': import.meta.env.DEV,
  'import.meta.env.MODE': import.meta.env.MODE,
  'import.meta.env.VITE_API_URL': import.meta.env.VITE_API_URL,
  finalApiUrl: API_URL,
  environmentMode: import.meta.env.PROD ? 'production' : 'development'
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
      mode: import.meta.env.MODE,
      prod: import.meta.env.PROD,
      dev: import.meta.env.DEV,
      hostname: window.location.hostname
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