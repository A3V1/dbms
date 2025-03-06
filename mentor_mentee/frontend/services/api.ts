import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    throw error;
  }
);

// Auth endpoints
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login/', { 
        email, 
        password,
      });
      return response.data;
    } catch (error: any) {
      console.error('Login API Error:', {
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },
  register: async (userData: any) => {
    const response = await api.post('/api/auth/register/', userData);
    return response.data;
  },
  verifyToken: async () => {
    const response = await api.post('/api/auth/verify/');
    return response.data;
  },
  logout: () => {
    Cookies.remove('token');
  },
};

// User endpoints
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/api/users/profile/');
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await api.patch('/api/users/profile/', data);
    return response.data;
  },
};

// Mentor endpoints
export const mentorAPI = {
  getMentees: async () => {
    const response = await api.get('/api/mentor/mentees/');
    return response.data;
  },
  addFeedback: async (menteeId: number, feedback: string) => {
    const response = await api.post(`/api/mentor/feedback/${menteeId}/`, { feedback });
    return response.data;
  },
};

// Mentee endpoints
export const menteeAPI = {
  getMentor: async () => {
    const response = await api.get('/api/mentee/mentor/');
    return response.data;
  },
  requestMeeting: async (data: any) => {
    const response = await api.post('/api/mentee/request-meeting/', data);
    return response.data;
  },
};

export default api; 