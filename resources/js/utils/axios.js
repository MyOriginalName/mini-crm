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
            
            // Add CSRF token for Laravel Sanctum
            const csrf = document.cookie
                .split(';')
                .find(cookie => cookie.trim().startsWith('XSRF-TOKEN='));
                
            if (csrf) {
                config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrf.split('=')[1]);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;