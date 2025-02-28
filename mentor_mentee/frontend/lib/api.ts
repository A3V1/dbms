import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login/', { email, password });
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me/');
    return response.data;
  },
};

export default api;

// Export other utilities as named exports
export const fetchProtectedData = async (url: string, method: 'GET' | 'POST' = 'GET', data?: any) => {
  try {
    const response = await api({
      url,
      method,
      data
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}; 