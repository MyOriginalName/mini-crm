import axios from 'axios';
import { getStorageItem } from './localStorage';

// Create axios instance with default configuration for Sanctum
const axiosInstance = axios.create({
    baseURL: `${window.location.origin}/api/v1`,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to always include the latest token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getStorageItem('token');
        if (token) {
            // Ensure proper token format
            // Use token directly - it's already cleaned when stored
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log('Using token for request');
            
            // Add CSRF token for Laravel Sanctum
            const csrf = document.cookie
                .split(';')
                .find(cookie => cookie.trim().startsWith('XSRF-TOKEN='));
                
            if (csrf) {
                config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrf.split('=')[1]);
            }
            
            // Log auth header for debugging
            console.log('Authorization header set for request');
            
            // Debug authorization header
            console.log('Request details:', {
                url: config.url,
                authHeader: config.headers['Authorization'].substring(0, 20) + '...',
                method: config.method
            });
        } else {
            console.warn('No token found for request:', config.url);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response received:', {
            url: response.config.url,
            status: response.status,
            hasToken: !!getStorageItem('token')
        });
        return response;
    },
    (error) => {
        console.error('Response error:', {
            url: error.config?.url,
            status: error.response?.status,
            hasToken: !!getStorageItem('token')
        });
        return Promise.reject(error);
    }
);

export default axiosInstance;