import axios from 'axios';
import { Platform } from 'react-native';
import { storage } from './storage';

const BASE_URL = __DEV__
  ? Platform.OS === 'web'
    ? 'http://localhost:3000'
    : 'http://192.168.0.141:3000'
  : 'https://your-production-url.com';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await storage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await storage.getItem('refreshToken');
        const response = await axios.post(`${BASE_URL}/api/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data.data;
        await storage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch {
        await storage.removeItem('accessToken');
        await storage.removeItem('refreshToken');
      }
    }

    return Promise.reject(error);
  },
);
