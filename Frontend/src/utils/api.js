import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a response interceptor to handle 401 errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // We removed the automatic redirect to /candidate/login here
        // to allow public pages to render and let route guards handle
        // redirection when necessary.
        return Promise.reject(error);
    }
);

export default api;
