import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to track start time
api.interceptors.request.use((config) => {
    config.metadata = { startTime: new Date() };
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add a response interceptor to handle 401 errors globally and log performance
api.interceptors.response.use(
    (response) => {
        const startTime = response.config.metadata.startTime;
        const endTime = new Date();
        const duration = endTime - startTime;
        
        if (duration > 1000) {
            console.warn(`[API PERF WARNING] ${response.config.method.toUpperCase()} ${response.config.url} took ${duration}ms`);
        } else {
            console.log(`[API PERF] ${response.config.method.toUpperCase()} ${response.config.url} - ${duration}ms`);
        }
        
        return response;
    },
    (error) => {
        if (error.config?.metadata?.startTime) {
            const duration = new Date() - error.config.metadata.startTime;
            console.error(`[API ERROR] ${error.config.method.toUpperCase()} ${error.config.url} failed after ${duration}ms`);
        }
        return Promise.reject(error);
    }
);

export default api;
