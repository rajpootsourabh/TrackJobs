import api, { setAccessToken, setUser, clearAuthData } from './api';

/**
 * Parse API error response into a structured error object
 * @param {Error} error - Axios error object
 * @returns {Object} - Structured error with message and field errors
 */
const parseApiError = (error) => {
  // Network error (no response from server)
  if (!error.response) {
    return {
      message: error.message === 'Network Error' 
        ? 'Unable to connect to server. Please check your internet connection.' 
        : (error.message || 'An unexpected error occurred. Please try again.'),
      errors: null,
      status: 0,
    };
  }

  const response = error.response?.data;
  
  // Handle different error response formats
  let errorMessage = 'An unexpected error occurred. Please try again.';
  
  if (typeof response === 'string') {
    errorMessage = response;
  } else if (response?.message) {
    errorMessage = response.message;
  } else if (response?.error) {
    errorMessage = response.error;
  }
  
  return {
    message: errorMessage,
    errors: response?.errors || null,
    status: error.response?.status || 500,
  };
};

/**
 * Register a new user
 * @param {Object} payload - Registration data
 * @param {string} payload.business_name - Business name
 * @param {string} payload.website_name - Website name
 * @param {string} payload.full_name - Full name
 * @param {string} payload.email - Email address
 * @param {string} payload.mobile_number - Mobile number
 * @param {string} payload.password - Password
 * @param {boolean} payload.terms_accepted - Terms acceptance
 * @returns {Promise<Object>} - Response data
 */
export const register = async (payload) => {
  try {
    const response = await api.post('/auth/register', payload);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Login user with email and password
 * @param {Object} payload - Login credentials
 * @param {string} payload.email - User email
 * @param {string} payload.password - User password
 * @returns {Promise<Object>} - Response with access_token and user data
 */
export const login = async (payload) => {
  try {
    const response = await api.post('/auth/login', payload);
    const responseData = response.data;
    
    // Handle different response formats
    // API might return: { access_token, user } or { data: { access_token, user } } or { token, user }
    const data = responseData.data || responseData;
    const token = data.access_token || data.token || data.accessToken;
    const user = data.user;
    
    // Store auth data
    if (token) {
      setAccessToken(token);
    }
    if (user) {
      setUser(user);
    }
    
    return responseData;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Request password reset email
 * @param {Object} payload - Forgot password data
 * @param {string} payload.email - User email
 * @returns {Promise<Object>} - Response data
 */
export const forgotPassword = async (payload) => {
  try {
    const response = await api.post('/auth/password/forgot', payload);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Reset password with token
 * @param {Object} payload - Reset password data
 * @param {string} payload.email - User email
 * @param {string} payload.token - Reset token from email link
 * @param {string} payload.password - New password
 * @param {string} payload.password_confirmation - Password confirmation
 * @returns {Promise<Object>} - Response data
 */
export const resetPassword = async (payload) => {
  try {
    const response = await api.post('/auth/password/reset', payload);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Logout user - clear all auth data
 */
export const logout = () => {
  clearAuthData();
  window.location.href = '/login';
};

// Legacy exports for backward compatibility
export const loginUser = async (email, password) => {
  return login({ email, password });
};

export const registerUser = async (userData) => {
  return register(userData);
};
