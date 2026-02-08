import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// ============================================
// TOKEN & USER MANAGEMENT
// ============================================
const TOKEN_KEY = 'access_token';
const USER_KEY = 'user';

// Check if we're in development mode
const isDev = import.meta.env.DEV;

/**
 * Get access token from localStorage
 * @returns {string|null} JWT token or null
 */
export const getAccessToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (isDev && token) {
    console.log('[API] Token found:', token.substring(0, 50) + '...');
  }
  return token;
};

export const setAccessToken = (token) => {
  if (isDev) console.log('[API] Setting access token');
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeAccessToken = () => {
  if (isDev) console.log('[API] Removing access token');
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Get user data from localStorage
 * @returns {Object|null} User object or null
 */
export const getUser = () => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (e) {
    console.error('[API] Error parsing user data:', e);
    return null;
  }
};

export const setUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const removeUser = () => localStorage.removeItem(USER_KEY);

export const clearAuthData = () => {
  removeAccessToken();
  removeUser();
};

export const isAuthenticated = () => !!getAccessToken();

/**
 * Get vendor ID from authenticated user
 * @returns {string|number|null} Vendor ID
 */
export const getVendorId = () => {
  const user = getUser();
  const vendorId = user?.vendor_id || user?.vendorId || null;
  if (isDev) console.log('[API] Vendor ID:', vendorId);
  return vendorId;
};

// ============================================
// AXIOS INSTANCE CONFIGURATION
// ============================================

// Create axios instance with production API URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
  withCredentials: false, // Don't send cookies for CORS requests
});

// Log base URL in development
if (isDev) {
  console.log('[API] Base URL:', API_BASE_URL);
}

// ============================================
// REQUEST INTERCEPTOR
// ============================================
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = getAccessToken();
    
    // Attach Authorization header if token exists
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Development logging
    if (isDev) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      console.log('[API Request Headers]', {
        'Content-Type': config.headers['Content-Type'],
        'Accept': config.headers['Accept'],
        'Authorization': config.headers['Authorization'] 
          ? `Bearer ${config.headers['Authorization'].substring(7, 50)}...` 
          : 'NOT SET',
      });
      if (config.data) {
        console.log('[API Request Body]', config.data);
      }
    }
    
    return config;
  },
  (error) => {
    if (isDev) console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
api.interceptors.response.use(
  (response) => {
    if (isDev) {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    if (isDev) {
      console.error('[API Response Error]', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
      });
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      const errorCode = error.response?.data?.error_code || error.response?.data?.code;
      
      // Only clear auth and redirect if it's a token issue
      if (errorCode === 'AUTH_TOKEN_MISSING' || errorCode === 'AUTH_TOKEN_INVALID' || errorCode === 'TOKEN_EXPIRED') {
        clearAuthData();
        
        // Only redirect if not already on auth pages
        const currentPath = window.location.pathname;
        const authPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
        if (!authPaths.some(path => currentPath.startsWith(path))) {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API endpoints (placeholder)
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

// Clients API endpoints (placeholder)
export const clientsAPI = {
  getAll: () => api.get('/clients'),
  getById: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
};

// Quotes API endpoints (placeholder)
export const quotesAPI = {
  getAll: () => api.get('/quotes'),
  getById: (id) => api.get(`/quotes/${id}`),
  create: (data) => api.post('/quotes', data),
  update: (id, data) => api.put(`/quotes/${id}`, data),
  delete: (id) => api.delete(`/quotes/${id}`),
  send: (id) => api.post(`/quotes/${id}/send`),
};

// Jobs API endpoints (placeholder)
export const jobsAPI = {
  getAll: () => api.get('/jobs'),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  updateStatus: (id, status) => api.patch(`/jobs/${id}/status`, { status }),
};

// Schedule API endpoints (placeholder)
export const scheduleAPI = {
  getAll: () => api.get('/schedules'),
  getById: (id) => api.get(`/schedules/${id}`),
  create: (data) => api.post('/schedules', data),
  update: (id, data) => api.put(`/schedules/${id}`, data),
  delete: (id) => api.delete(`/schedules/${id}`),
};

// Dashboard API endpoints (placeholder)
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentActivity: () => api.get('/dashboard/activity'),
};

export default api;
