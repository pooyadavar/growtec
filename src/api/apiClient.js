import axios from 'axios';
import { getAccessToken } from '../utils/authStorage';

// const API_BASE_URL = 'http://192.168.31.62:8000/api/v1';
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response);
    return Promise.reject(error);
  }
);

export default apiClient;
