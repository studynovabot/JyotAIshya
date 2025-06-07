import axios from 'axios';

// API base URL from environment variables
export const API_URL = import.meta.env.VITE_API_URL;

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
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
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

export default api;