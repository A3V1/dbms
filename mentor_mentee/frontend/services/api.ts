import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8000/api';

// Types
export interface LoginData {
  official_mail_id: string;
  password: string;
}

export interface User {
  unique_user_no: number;
  name: string;
  official_mail_id: string;
  phone_number: string;
  prn_id_no: string;
  role: 'admin' | 'mentor' | 'mentee';
  profile_picture?: string;
  created_at: string;
  calendar_id?: string;
}

export interface Mentor {
  mentor_id: number;
  user: User;
  room_no?: string;
  timetable?: string;
  department?: string;
  academic_background?: string;
  post_in_hand?: string;
}

export interface Mentee {
  mentee_id: number;
  user: User;
  mentor_id: number;
  course: string;
  year: number;
  attendance?: number;
  academic?: string;
  upcoming_event?: string;
  alternate_contact?: string;
}

export interface Achievement {
  achievement_id: number;
  mentor_id: number;
  mentee_id: number;
  title: string;
  description?: string;
  date_awarded?: string;
  badge_icon?: string;
}

export interface Communication {
  comm_id: number;
  sender_id: number;
  receiver_id: number;
  message_content?: string;
  message_status?: 'sent' | 'delivered' | 'read';
  attached_file?: string;
  timestamp: string;
  type: 'one-to-one' | 'broadcast' | 'feedback' | 'meeting_req';
}

export interface EmergencyAlert {
  alert_id: number;
  comm_id: number;
  alert_reason?: string;
  alert_status?: 'pending' | 'resolved';
}

export interface Meeting {
  meeting_id: number;
  mentor_id: number;
  mentee_id: number;
  meeting_date?: string;
  meeting_time?: string;
  meeting_mode?: 'offline' | 'online';
  meeting_status?: 'scheduled' | 'completed' | 'cancelled';
  meeting_agenda?: string;
  notes?: string;
}

export interface ActivityLog {
  activity_id: number;
  user_id: number;
  in_time: string;
  out_time?: string;
  activity_done?: string;
  ip_address?: string;
  last_login?: string;
}

export interface AdminDashboardData {
  stats: {
    total_users: number;
    total_mentors: number;
    total_mentees: number;
    total_meetings: number;
    total_achievements: number;
    total_messages: number;
  };
  recent_users: User[];
  recent_activities: ActivityLog[];
}

// API client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('token') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication API
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      // For development/testing - mock authentication
      console.log('Using mock authentication');
      
      // Mock authentication based on test credentials
      if (
        (email === 'bobjohnson@college.edu' && password === 'admin123') ||
        (email === 'johndoe@college.edu' && password === 'mentor123') ||
        (email === 'alicesmith@college.edu' && password === 'mentee123')
      ) {
        // Determine role based on email
        let role = 'mentee';
        if (email === 'bobjohnson@college.edu') role = 'admin';
        if (email === 'johndoe@college.edu') role = 'mentor';
        
        // Create mock user data
        const mockUser: User = {
          unique_user_no: email === 'bobjohnson@college.edu' ? 1003 : 
                          email === 'johndoe@college.edu' ? 1001 : 1002,
          name: email === 'bobjohnson@college.edu' ? 'Bob Johnson' : 
                email === 'johndoe@college.edu' ? 'John Doe' : 'Alice Smith',
          official_mail_id: email,
          phone_number: '9876543210',
          prn_id_no: 'PRN1001',
          role: role as 'admin' | 'mentor' | 'mentee',
          created_at: new Date().toISOString(),
        };
        
        // Create mock token
        const mockToken = 'mock_jwt_token_' + Math.random().toString(36).substring(2);
        
        // Store token
        Cookies.set('token', mockToken, { secure: true, sameSite: 'strict' });
        localStorage.setItem('token', mockToken);
        
        // Store role for middleware
        localStorage.setItem('last_login_role', role);
        
        return { token: mockToken, user: mockUser };
      }
      
      // If credentials don't match mock data
      throw new Error('Invalid credentials');

      /* Once backend is fixed, use this code instead
      const response = await apiClient.post('/auth/login/', { 
        official_mail_id: email, 
        password 
      });
      const { token, user } = response.data;
      
      // Store token in both cookie (for security) and localStorage (for easier access)
      Cookies.set('token', token, { secure: true, sameSite: 'strict' });
      localStorage.setItem('token', token);
      
      return { token, user };
      */
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      // For development/testing - skip API call
      console.log('Using mock logout');
      
      // Just remove tokens
      Cookies.remove('token');
      localStorage.removeItem('token');
      
      return { success: true };
      
      /* Once backend is fixed, use this code instead
      await apiClient.post('/auth/logout/');
      Cookies.remove('token');
      localStorage.removeItem('token');
      */
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear tokens even if logout API fails
      Cookies.remove('token');
      localStorage.removeItem('token');
      throw error;
    }
  },

  verifyToken: async () => {
    try {
      // For development/testing - mock verification
      console.log('Using mock token verification');
      
      const token = Cookies.get('token') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found');
      }
      
      // Check if it's one of our mock tokens
      if (token.startsWith('mock_jwt_token_')) {
        // Determine user data based on stored info
        const email = localStorage.getItem('last_login_email') || 'johndoe@college.edu';
        
        let role = 'mentee';
        if (email === 'bobjohnson@college.edu') role = 'admin';
        if (email === 'johndoe@college.edu') role = 'mentor';
        
        const mockUser: User = {
          unique_user_no: email === 'bobjohnson@college.edu' ? 1003 : 
                          email === 'johndoe@college.edu' ? 1001 : 1002,
          name: email === 'bobjohnson@college.edu' ? 'Bob Johnson' : 
                email === 'johndoe@college.edu' ? 'John Doe' : 'Alice Smith',
          official_mail_id: email,
          phone_number: '9876543210',
          prn_id_no: 'PRN1001',
          role: role as 'admin' | 'mentor' | 'mentee',
          created_at: new Date().toISOString(),
        };
        
        return { user: mockUser };
      }
      
      throw new Error('Invalid token');
      
      /* Once backend is fixed, use this code instead
      const response = await apiClient.post('/auth/verify-token/');
      return response.data;
      */
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    try {
      const response = await apiClient.get('/users/profile/');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  updateProfile: async (data: Partial<User>) => {
    try {
      const response = await apiClient.patch('/users/profile/', data);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  getMentors: async () => {
    try {
      const response = await apiClient.get('/users/mentors/');
      return response.data;
    } catch (error) {
      console.error('Get mentors error:', error);
      throw error;
    }
  },

  getMentees: async () => {
    try {
      const response = await apiClient.get('/users/mentees/');
      return response.data;
    } catch (error) {
      console.error('Get mentees error:', error);
      throw error;
    }
  },

  getMenteeDetails: async (menteeId: number) => {
    try {
      const response = await apiClient.get(`/users/mentees/${menteeId}/`);
      return response.data;
    } catch (error) {
      console.error('Get mentee details error:', error);
      throw error;
    }
  },

  assignMentorToMentee: async (menteeId: number, mentorId: number) => {
    try {
      const response = await apiClient.post(`/users/mentees/${menteeId}/assign-mentor/`, {
        mentor_id: mentorId
      });
      return response.data;
    } catch (error) {
      console.error('Assign mentor error:', error);
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const response = await apiClient.get('/users/');
      return response.data;
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  },

  createUser: async (userData: Partial<User>) => {
    try {
      const response = await apiClient.post('/users/', userData);
      return response.data;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  },

  updateUser: async (userId: number, userData: Partial<User>) => {
    try {
      const response = await apiClient.patch(`/users/${userId}/`, userData);
      return response.data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  deleteUser: async (userId: number) => {
    try {
      await apiClient.delete(`/users/${userId}/`);
      return { success: true };
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  },
};

// Meeting API
export const meetingAPI = {
  getMeetings: async () => {
    try {
      const response = await apiClient.get('/meetings/');
      return response.data;
    } catch (error) {
      console.error('Get meetings error:', error);
      throw error;
    }
  },

  getMeetingsByMentor: async (mentorId: number) => {
    try {
      const response = await apiClient.get(`/meetings/mentor/${mentorId}/`);
      return response.data;
    } catch (error) {
      console.error('Get mentor meetings error:', error);
      throw error;
    }
  },

  getMeetingsByMentee: async (menteeId: number) => {
    try {
      const response = await apiClient.get(`/meetings/mentee/${menteeId}/`);
      return response.data;
    } catch (error) {
      console.error('Get mentee meetings error:', error);
      throw error;
    }
  },

  createMeeting: async (data: {
    mentee_id: number;
    meeting_date: string;
    meeting_time: string;
    meeting_mode: 'offline' | 'online';
    meeting_agenda: string;
  }) => {
    try {
      const response = await apiClient.post('/meetings/', data);
      return response.data;
    } catch (error) {
      console.error('Create meeting error:', error);
      throw error;
    }
  },

  updateMeeting: async (meetingId: number, data: Partial<Meeting>) => {
    try {
      const response = await apiClient.patch(`/meetings/${meetingId}/`, data);
      return response.data;
    } catch (error) {
      console.error('Update meeting error:', error);
      throw error;
    }
  },

  deleteMeeting: async (meetingId: number) => {
    try {
      await apiClient.delete(`/meetings/${meetingId}/`);
      return { success: true };
    } catch (error) {
      console.error('Delete meeting error:', error);
      throw error;
    }
  },
};

// Message API
export const messageAPI = {
  getContacts: async () => {
    try {
      const response = await apiClient.get('/messages/contacts/');
      return response.data;
    } catch (error) {
      console.error('Get contacts error:', error);
      throw error;
    }
  },
  
  getMessages: async (userId: number) => {
    try {
      const response = await apiClient.get(`/messages/user/${userId}/`);
      return response.data;
    } catch (error) {
      console.error('Get messages error:', error);
      throw error;
    }
  },

  sendMessage: async (data: {
    receiver_id: number;
    message_content: string;
    type: 'one-to-one' | 'broadcast' | 'feedback';
    attached_file?: string;
  }) => {
    try {
      const response = await apiClient.post('/messages/', data);
      return response.data;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  },

  markAsRead: async (messageId: number) => {
    try {
      const response = await apiClient.patch(`/messages/${messageId}/read/`, {});
      return response.data;
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  },

  createEmergencyAlert: async (data: {
    message_id: number;
    alert_reason: string;
  }) => {
    try {
      const response = await apiClient.post('/messages/emergency-alert/', data);
      return response.data;
    } catch (error) {
      console.error('Create emergency alert error:', error);
      throw error;
    }
  },

  resolveEmergencyAlert: async (alertId: number) => {
    try {
      const response = await apiClient.patch(`/messages/emergency-alert/${alertId}/resolve/`, {});
      return response.data;
    } catch (error) {
      console.error('Resolve emergency alert error:', error);
      throw error;
    }
  },
};

// Achievement API
export const achievementAPI = {
  getAchievements: async () => {
    try {
      const response = await apiClient.get('/achievements/');
      return response.data;
    } catch (error) {
      console.error('Get achievements error:', error);
      throw error;
    }
  },

  getMenteeAchievements: async (menteeId: number) => {
    try {
      const response = await apiClient.get(`/achievements/mentee/${menteeId}/`);
      return response.data;
    } catch (error) {
      console.error('Get mentee achievements error:', error);
      throw error;
    }
  },

  createAchievement: async (data: {
    mentee_id: number;
    title: string;
    description?: string;
    badge_icon?: string;
  }) => {
    try {
      const response = await apiClient.post('/achievements/', data);
      return response.data;
    } catch (error) {
      console.error('Create achievement error:', error);
      throw error;
    }
  },

  deleteAchievement: async (achievementId: number) => {
    try {
      await apiClient.delete(`/achievements/${achievementId}/`);
      return { success: true };
    } catch (error) {
      console.error('Delete achievement error:', error);
      throw error;
    }
  },
};

// Admin API
export const adminAPI = {
  getDashboard: async () => {
    try {
      const response = await apiClient.get('/admin/dashboard/');
      return response.data;
    } catch (error) {
      console.error('Get admin dashboard error:', error);
      throw error;
    }
  },

  getActivityLogs: async () => {
    try {
      const response = await apiClient.get('/admin/activity-logs/');
      return response.data;
    } catch (error) {
      console.error('Get activity logs error:', error);
      throw error;
    }
  },

  sendAnnouncement: async (data: {
    title: string;
    content: string;
    roles?: ('admin' | 'mentor' | 'mentee')[];
  }) => {
    try {
      const response = await apiClient.post('/admin/announcements/', data);
      return response.data;
    } catch (error) {
      console.error('Send announcement error:', error);
      throw error;
    }
  },

  generateReport: async (reportType: string, filters?: Record<string, any>) => {
    try {
      const response = await apiClient.post('/admin/reports/', { report_type: reportType, filters });
      return response.data;
    } catch (error) {
      console.error('Generate report error:', error);
      throw error;
    }
  },
};

export default apiClient; 