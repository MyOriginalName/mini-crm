import axios from 'axios';
import '../css/app.css';
import './app.jsx';
// Import the localStorage utility for getting the auth token
import { getStorageItem } from './utils/localStorage';

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;

// Add CSRF token to all requests
const csrfToken = document.head.querySelector('meta[name="csrf-token"]');
if (csrfToken) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

// Load and apply auth token if it exists
const authToken = getStorageItem('token');
if (authToken) {
    const cleanToken = authToken.toString().replace(/^Bearer\s+/i, '');
    const authHeader = `Bearer ${cleanToken}`;
    window.axios.defaults.headers.common['Authorization'] = authHeader;
    console.log('Auth token applied to global axios');
}
