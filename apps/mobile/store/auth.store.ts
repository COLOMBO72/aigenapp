import { create } from 'zustand';
import { api } from '../services/api';
import { storage } from '../services/storage';

interface User {
  id: string;
  email: string;
  username: string;
  plan: 'FREE' | 'PREMIUM';
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    try {
      console.log('Trying to login with:', email);
      const response = await api.post('/api/auth/login', { email, password });
      console.log('Login response:', response.data);
      const { accessToken, refreshToken, user } = response.data.data;

      await storage.setItem('accessToken', accessToken);
      await storage.setItem('refreshToken', refreshToken);

      set({ user, isAuthenticated: true });
    } catch (error: any) {
      console.log('Login error:', JSON.stringify(error?.response?.data));
      console.log('Login error message:', error?.message);
      throw error;
    }
  },

  register: async (email, username, password) => {
    const response = await api.post('/api/auth/register', {
      email,
      username,
      password,
    });
    const { accessToken, refreshToken, user } = response.data.data;

    await storage.setItem('accessToken', accessToken);
    await storage.setItem('refreshToken', refreshToken);

    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    const refreshToken = await storage.getItem('refreshToken');
    if (refreshToken) {
      await api.post('/api/auth/logout', { refreshToken }).catch(() => {});
    }
    await storage.removeItem('accessToken');
    await storage.removeItem('refreshToken');
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      const token = await storage.getItem('accessToken');
      if (!token) {
        set({ isLoading: false, isAuthenticated: false });
        return;
      }

      const response = await api.get('/api/auth/me');
      set({
        isLoading: false,
        isAuthenticated: true,
        user: response.data.data,
      });
    } catch {
      set({ isLoading: false, isAuthenticated: false });
    }
  },
  deleteAccount: async () => {
    await api.delete('/api/auth/account');
    await storage.removeItem('accessToken');
    await storage.removeItem('refreshToken');
    set({ user: null, isAuthenticated: false });
  },
}));
