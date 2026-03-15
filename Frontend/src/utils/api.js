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
        if (error.response?.status === 401) {
            // Check if we are already on the login page to avoid loops
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/candidate/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
