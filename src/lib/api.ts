import axios from 'axios';
import { auth } from './firebase';

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const sanitizedApiUrl = rawApiUrl.replace(/\/$/, '');
const API_URL = sanitizedApiUrl.endsWith('/api')
  ? sanitizedApiUrl
  : `${sanitizedApiUrl}/api`;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const user = auth?.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
