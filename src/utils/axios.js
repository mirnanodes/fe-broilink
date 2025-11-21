import axios from 'axios';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api' || 'http://localhost:8000/api',
  timeout: import.meta.env.VITE_API_TIMEOUT || 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // CRITICAL: Enables cookies for CSRF
});

// Request interceptor - adds Bearer token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles 401 unauthorized globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stored auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userRole');
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// CSRF Cookie Fetcher
// MUST be called BEFORE login to get CSRF token
export const getCsrfCookie = async () => {
  try {
    await axios.get((import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000') + '/sanctum/csrf-cookie', {
      withCredentials: true
    });
  } catch (error) {
    console.error('Failed to fetch CSRF cookie:', error);
    throw error;
  }
};

export default axiosInstance;
