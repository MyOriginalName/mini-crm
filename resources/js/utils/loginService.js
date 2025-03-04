/**
 * Service to handle authentication-related functionality
 */
import axios from 'axios';
import { setStorageItem, removeStorageItem, getStorageItem } from './localStorage';
import customAxios from './axios';

// Import the axios instance without any customization to avoid circular dependency
const baseAxios = axios.create({
  baseURL: window.location.origin,
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * Get the stored authentication token
 */
export const getAuthToken = () => {
  const token = getStorageItem('token');
  if (!token) {
    console.warn('No token found in storage');
    return null;
  }
  return token;
};

/**
 * Initialize authentication session with Sanctum
 */
export const initSanctumAuth = async () => {
  try {
    // Save original baseURL to restore later
    const originalBaseURL = baseAxios.defaults.baseURL;
    
    // Temporarily set baseURL to root for Sanctum endpoints
    baseAxios.defaults.baseURL = window.location.origin;
    
    // Get CSRF cookie at domain root
    const response = await baseAxios.get('/sanctum/csrf-cookie');
    console.log('CSRF cookie response:', response.status);
    
    // Get XSRF token from cookie and set for both axios instances
    const cookies = document.cookie.split(';');
    const xsrfToken = cookies.find(cookie => cookie.trim().startsWith('XSRF-TOKEN='));
    
    if (xsrfToken) {
      const token = decodeURIComponent(xsrfToken.split('=')[1]);
      baseAxios.defaults.headers.common['X-XSRF-TOKEN'] = token;
      customAxios.defaults.headers.common['X-XSRF-TOKEN'] = token;
      console.log('CSRF token initialized for both instances');
    }
    
    // Restore the original baseURL after getting CSRF cookie
    baseAxios.defaults.baseURL = originalBaseURL;
    return true;
  } catch (error) {
    console.error('Failed to initialize Sanctum authentication:', error);
    return false;
  }
};

// Removed extractToken function as token handling is done directly in login()

/**
 * Login user and get token
 */
export async function login(credentials) {
  try {
    await initSanctumAuth();
    
    // Attempt login with correct API endpoint
    const response = await baseAxios.post('/api/v1/login', credentials);
    console.log('Login response:', {
      status: response.status,
      hasToken: !!response.data?.token
    });
    
    // Handle token from API response
    const token = response.data?.token;
    if (!token) {
      console.error('Login response:', response.data);
      throw new Error('No token received from login');
    }

    // Store raw token and set auth header
    console.log('Received token from API');
    setStorageItem('token', token);
    customAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    console.log('Login successful, token stored and applied');
    return token;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

/**
 * Logout user and clean up
 */
export async function logout() {
  try {
    await customAxios.post('/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    removeStorageItem('token');
  }
}