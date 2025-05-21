import axios from 'axios';
import { useToastOnce } from '../hooks/useToastOnce';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('Error in response interceptor:', error);
    useToastOnce(
      error.response?.data?.message ||
        'Wystąpił błąd. Spróbuj ponownie później.',
    );
  },
);
