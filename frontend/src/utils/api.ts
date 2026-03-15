// API utility functions
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Villages API
export const villagesAPI = {
  getAll: (params?: { district?: string; state?: string; limit?: number; offset?: number }) =>
    api.get('/villages', { params }),
  getById: (id: number) => api.get(`/villages/${id}`),
  create: (data: any) => api.post('/villages', data),
  getSchemes: (id: number) => api.get(`/villages/${id}/schemes`)
};

// Farmers API
export const farmersAPI = {
  getAll: (params?: { village_id?: number; limit?: number; offset?: number }) =>
    api.get('/farmers', { params }),
  getById: (id: number) => api.get(`/farmers/${id}`),
  create: (data: any) => api.post('/farmers', data),
  getSchemes: (id: number) => api.get(`/farmers/${id}/schemes`),
  matchSchemes: (profile: any) => api.post('/farmers/match-schemes', profile),
  verifyLand: (id: string, data: any) => api.post(`/farmers/${id}/land-details`, data)
};

// Schemes API
export const schemesAPI = {
  getAll: () => api.get('/schemes'),
  getById: (id: number) => api.get(`/schemes/${id}`)
};

// Chatbot API
export const chatbotAPI = {
  chat: (data: { message: string; language?: string; farmer_id?: number; village_id?: number }) =>
    api.post('/chatbot/chat', data),
  verifyDocument: (formData: FormData) =>
    api.post('/chatbot/verify-document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats')
};

// Auth API
export const authAPI = {
  register: (data: { email: string; username: string; password: string; full_name?: string; role?: string }) =>
    api.post('/auth/register', data),
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  getMe: () => api.get('/auth/me')
};

export default api;
