import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LoginRequest {
  email: string;
  password: string;
}


export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Auth API calls
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },


  getUserInfo: async (): Promise<User> => {
    const response = await api.get('/test/user-info');
    return response.data;
  },

  getProtectedMessage: async (): Promise<string> => {
    const response = await api.get('/test/protected');
    return response.data;
  },

  checkPermissions: async (): Promise<any> => {
    const response = await api.get('/roles/check-permissions');
    return response.data;
  },

  getAdminData: async (): Promise<any> => {
    const response = await api.get('/roles/admin');
    return response.data;
  },

  getEmployerData: async (): Promise<any> => {
    const response = await api.get('/roles/employer');
    return response.data;
  },

  getManagerData: async (): Promise<any> => {
    const response = await api.get('/roles/manager');
    return response.data;
  },
};

export default api;
