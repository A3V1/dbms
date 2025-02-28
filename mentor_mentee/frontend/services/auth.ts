import api from '@/lib/api';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/users/login/', { email, password });
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await api.post('/api/users/register/', userData);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  }
}; 