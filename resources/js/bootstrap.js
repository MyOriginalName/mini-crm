import axios from 'axios';
import '../css/app.css';
import './app.jsx';

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
