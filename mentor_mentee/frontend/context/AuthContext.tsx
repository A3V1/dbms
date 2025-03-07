"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, type User } from '@/services/api';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Safely access localStorage (only in browser environment)
const getLocalStorage = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

const setLocalStorage = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

const removeLocalStorage = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = Cookies.get('token') || getLocalStorage('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const data = await authAPI.verifyToken();
        setUser(data.user);
        
        // Auto-redirect to appropriate dashboard if on login page
        if (typeof window !== 'undefined' && window.location.pathname === '/login') {
          router.push(`/dashboard/${data.user.role}`);
        }
      } catch (err) {
        console.error('Auth verification error:', err);
        // Clear invalid tokens
        Cookies.remove('token');
        removeLocalStorage('token');
        
        // Only redirect to login if not already there
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      const { user: userData } = await authAPI.login(email, password);
      setUser(userData);
      
      // Redirect based on user role
      switch (userData.role) {
        case 'admin':
          router.push('/dashboard/admin');
          break;
        case 'mentor':
          router.push('/dashboard/mentor');
          break;
        case 'mentee':
          router.push('/dashboard/mentee');
          break;
        default:
          throw new Error('Invalid user role');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.detail || 
                          err.message ||
                          'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authAPI.logout();
      setUser(null);
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Still clear local state even if logout API fails
      Cookies.remove('token');
      removeLocalStorage('token');
      removeLocalStorage('last_login_email');
      removeLocalStorage('last_login_role');
      setUser(null);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 