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

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  department: string;
  isActive: boolean;
  avatarUrl?: string;
  phoneNumber?: string;
  hireDate?: string;
  createdAt?: string;
  updatedAt?: string;
  role: string;
  profile?: string;
  // Computed properties for compatibility
  phone?: string;
  startDate?: string;
  salary?: number;
  address?: string;
  notes?: string;
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  department: string;
  isActive?: boolean;
  avatarUrl?: string;
  phoneNumber?: string;
  hireDate?: string;
  profile?: string;
  password?: string;
  // Additional fields from form
  phone?: string;
  startDate?: string;
  salary?: number;
  address?: string;
  notes?: string;
}

export interface UpdateEmployeeRequest {
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  department: string;
  isActive?: boolean;
  avatarUrl?: string;
  phoneNumber?: string;
  hireDate?: string;
  profile?: string;
  // Additional fields from form
  phone?: string;
  startDate?: string;
  salary?: number;
  address?: string;
  notes?: string;
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

// Employee API calls
export const employeeApi = {
  getAllEmployees: async (): Promise<Employee[]> => {
    const response = await api.get('/employees');
    return response.data;
  },

  getEmployeeById: async (id: number): Promise<Employee> => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  createEmployee: async (data: CreateEmployeeRequest): Promise<Employee> => {
    const response = await api.post('/employees', data);
    return response.data;
  },

  updateEmployee: async (id: number, data: UpdateEmployeeRequest): Promise<Employee> => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  deleteEmployee: async (id: number): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },

  searchEmployees: async (searchTerm: string): Promise<Employee[]> => {
    const response = await api.get(`/employees?search=${encodeURIComponent(searchTerm)}`);
    return response.data;
  },

  getEmployeesByDepartment: async (department: string): Promise<Employee[]> => {
    const response = await api.get(`/employees?department=${encodeURIComponent(department)}`);
    return response.data;
  },

  getEmployeesByStatus: async (isActive: boolean): Promise<Employee[]> => {
    const response = await api.get(`/employees?isActive=${isActive}`);
    return response.data;
  },

  getAllDepartments: async (): Promise<string[]> => {
    const response = await api.get('/employees/departments');
    return response.data;
  },
};

// Export individual employee functions for convenience
export const fetchEmployees = employeeApi.getAllEmployees;
export const fetchEmployeeById = employeeApi.getEmployeeById;
export const createEmployee = employeeApi.createEmployee;
export const updateEmployee = employeeApi.updateEmployee;
export const deleteEmployee = employeeApi.deleteEmployee;
export const searchEmployees = employeeApi.searchEmployees;
export const fetchDepartments = employeeApi.getAllDepartments;

export default api;
