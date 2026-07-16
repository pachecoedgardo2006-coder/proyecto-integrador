import axios from 'axios';
const api = axios.create({
    baseURL: '/api'
});

// Attaches the authentication token to outgoing API requests.

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;

});


export default api;