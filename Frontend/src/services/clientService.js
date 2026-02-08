import api, { getUser, getVendorId } from './api';

/**
 * Client Service
 * Handles all client-related API operations
 * Endpoint: /vendors/{vendor_id}/clients
 */

// Check if we're in development mode
const isDev = import.meta.env.DEV;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Parse API error response into a structured error object
 * @param {Error} error - Axios error object
 * @returns {Object} - Structured error with message and field errors
 */
const parseApiError = (error) => {
  if (isDev) {
    console.error('[ClientService] API Error:', error.response?.data || error.message);
  }
  
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
  let errorMessage = 'An unexpected error occurred. Please try again.';

  if (typeof response === 'string') {
    errorMessage = response;
  } else if (response?.message) {
    errorMessage = response.message;
  } else if (response?.error) {
    errorMessage = response.error;
  }

  // Log validation errors in dev mode
  if (isDev && response?.errors) {
    console.log('[ClientService] Validation errors:', response.errors);
  }

  return {
    message: errorMessage,
    errors: response?.errors || null,
    status: error.response?.status || 500,
  };
};

/**
 * Build the base URL for client endpoints
 * @param {string} vendorId - Vendor ID
 * @returns {string} - Base URL for client operations
 */
const getClientBaseUrl = (vendorId) => {
  if (!vendorId) {
    throw new Error('Vendor ID is required for client operations');
  }
  return `/vendors/${vendorId}/clients`;
};

// ============================================
// DATA TRANSFORMERS
// ============================================

/**
 * Helper to convert empty strings to null
 * @param {string} value - Value to check
 * @returns {string|null} - Original value or null if empty
 */
const emptyToNull = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  return value.trim() || null;
};

/**
 * Transform frontend form data to API request format
 * @param {Object} formData - Frontend form data
 * @returns {Object} - API-ready request payload
 */
export const transformClientToApiFormat = (formData) => {
  // Build payload, only including non-null values
  const payload = {
    // Basic Business Information (required)
    business_name: emptyToNull(formData.businessName),
    business_type: emptyToNull(formData.businessType),
    
    // Primary Contact Information (required)
    contact_person_name: emptyToNull(formData.contactPersonName),
    email: emptyToNull(formData.emailAddress),
    mobile_number: emptyToNull(formData.mobileNumber),
    
    // Business Address (required)
    address_line_1: emptyToNull(formData.addressLine1),
    
    // Status
    status: formData.clientStatus?.toLowerCase() || 'active',
  };

  // Add optional fields only if they have values
  if (emptyToNull(formData.industry)) {
    payload.industry = emptyToNull(formData.industry);
  }
  if (emptyToNull(formData.businessRegistrationNumber)) {
    payload.business_registration_number = emptyToNull(formData.businessRegistrationNumber);
  }
  if (emptyToNull(formData.designationRole)) {
    payload.designation_role = emptyToNull(formData.designationRole);
  }
  if (emptyToNull(formData.alternateMobileNumber)) {
    payload.alternate_mobile_number = emptyToNull(formData.alternateMobileNumber);
  }
  if (emptyToNull(formData.addressLine2)) {
    payload.address_line_2 = emptyToNull(formData.addressLine2);
  }
  if (emptyToNull(formData.city)) {
    payload.city = emptyToNull(formData.city);
  }
  if (emptyToNull(formData.state)) {
    payload.state = emptyToNull(formData.state);
  }
  if (emptyToNull(formData.country)) {
    payload.country = emptyToNull(formData.country);
  }
  if (emptyToNull(formData.pinZipcode)) {
    payload.pin_zipcode = emptyToNull(formData.pinZipcode);
  }
  if (emptyToNull(formData.billingName)) {
    payload.billing_name = emptyToNull(formData.billingName);
  }
  if (formData.sameAsBillingAddress) {
    payload.same_as_billing_address = true;
  }
  if (emptyToNull(formData.paymentTerm)) {
    payload.payment_term = emptyToNull(formData.paymentTerm);
  }
  if (emptyToNull(formData.preferredCurrency)) {
    payload.preferred_currency = emptyToNull(formData.preferredCurrency);
  }
  if (formData.taxPercentage) {
    payload.tax_percentage = parseFloat(formData.taxPercentage);
  }
  if (emptyToNull(formData.websiteUrl)) {
    payload.website_url = emptyToNull(formData.websiteUrl);
  }
  if (emptyToNull(formData.clientCategory)) {
    payload.client_category = emptyToNull(formData.clientCategory);
  }
  if (emptyToNull(formData.notesRemark)) {
    payload.notes_remark = emptyToNull(formData.notesRemark);
  }

  return payload;
};

/**
 * Transform API response to frontend format
 * @param {Object} apiData - API response data
 * @returns {Object} - Frontend-ready client object
 */
export const transformClientFromApiFormat = (apiData) => {
  return {
    id: apiData.id,
    // Basic Business Information
    businessName: apiData.business_name || '',
    businessType: apiData.business_type || '',
    industry: apiData.industry || '',
    businessRegistrationNumber: apiData.business_registration_number || '',
    
    // Primary Contact Information
    contactPersonName: apiData.contact_person_name || '',
    contactPerson: apiData.contact_person_name || '', // Alias for list view
    designationRole: apiData.designation_role || '',
    email: apiData.email || '',
    emailAddress: apiData.email || '', // Alias
    mobileNumber: apiData.mobile_number || '',
    phone: apiData.mobile_number || '', // Alias for list view
    alternateMobileNumber: apiData.alternate_mobile_number || '',
    
    // Business Address
    addressLine1: apiData.address_line_1 || '',
    addressLine2: apiData.address_line_2 || '',
    address: `${apiData.address_line_1 || ''} ${apiData.address_line_2 || ''}`.trim(), // Combined
    city: apiData.city || '',
    state: apiData.state || '',
    country: apiData.country || '',
    pinZipcode: apiData.pin_zipcode || '',
    
    // Billing & Financial Details
    billingName: apiData.billing_name || '',
    sameAsBillingAddress: apiData.same_as_billing_address || false,
    paymentTerm: apiData.payment_term || '',
    preferredCurrency: apiData.preferred_currency || '',
    taxPercentage: apiData.tax_percentage || '',
    
    // Additional Business Details
    websiteUrl: apiData.website_url || '',
    clientCategory: apiData.client_category || '',
    category: apiData.client_category || 'Regular', // Alias for list view
    notesRemark: apiData.notes_remark || '',
    
    // Status & Meta
    status: apiData.status || 'active',
    clientStatus: apiData.status ? apiData.status.charAt(0).toUpperCase() + apiData.status.slice(1) : 'Active',
    
    // For compatibility with list view
    name: apiData.contact_person_name || apiData.business_name || '',
    company: apiData.business_name || '',
    
    // Timestamps
    createdAt: apiData.created_at || null,
    updatedAt: apiData.updated_at || null,
  };
};

/**
 * Transform array of clients from API format
 * @param {Array} clients - Array of API client objects
 * @returns {Array} - Array of frontend-ready client objects
 */
export const transformClientsFromApiFormat = (clients) => {
  if (!Array.isArray(clients)) return [];
  return clients.map(transformClientFromApiFormat);
};

// ============================================
// API METHODS
// ============================================

/**
 * Fetch all clients for a vendor
 * @param {Object} options - Query options
 * @param {number} options.page - Page number for pagination
 * @param {number} options.limit - Items per page
 * @param {string} options.search - Search query
 * @param {string} options.status - Filter by status
 * @param {string} options.category - Filter by category
 * @param {string} options.sortBy - Sort field
 * @param {string} options.sortOrder - Sort order (asc/desc)
 * @returns {Promise<Object>} - Paginated clients response
 */
export const getClients = async (options = {}) => {
  try {
    const vendorId = getVendorId();
    const baseUrl = getClientBaseUrl(vendorId);

    // Build query params
    const params = new URLSearchParams();
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);
    if (options.search) params.append('search', options.search);
    if (options.status) params.append('status', options.status);
    if (options.category) params.append('category', options.category);
    if (options.sortBy) params.append('sort_by', options.sortBy);
    if (options.sortOrder) params.append('sort_order', options.sortOrder);

    const queryString = params.toString();
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    const response = await api.get(url);
    const data = response.data;

    // Handle different API response formats
    const clientsData = data.data || data.clients || data;
    const clients = Array.isArray(clientsData) ? clientsData : [];

    return {
      clients: transformClientsFromApiFormat(clients),
      pagination: {
        currentPage: data.current_page || data.page || 1,
        totalPages: data.total_pages || data.last_page || Math.ceil((data.total || clients.length) / (options.limit || 10)),
        totalItems: data.total || data.total_count || clients.length,
        perPage: data.per_page || options.limit || 10,
      },
    };
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Fetch a single client by ID
 * @param {string|number} clientId - Client ID
 * @returns {Promise<Object>} - Client data
 */
export const getClientById = async (clientId) => {
  try {
    const vendorId = getVendorId();
    const baseUrl = getClientBaseUrl(vendorId);

    const response = await api.get(`${baseUrl}/${clientId}`);
    const data = response.data.data || response.data;

    return transformClientFromApiFormat(data);
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Create a new client
 * @param {Object} formData - Client form data
 * @returns {Promise<Object>} - Created client data
 */
export const createClient = async (formData) => {
  try {
    const vendorId = getVendorId();
    
    if (!vendorId) {
      throw new Error('Vendor ID not found. Please log in again.');
    }
    
    const baseUrl = getClientBaseUrl(vendorId);
    const payload = transformClientToApiFormat(formData);
    
    if (isDev) {
      console.log('[ClientService] Creating client...');
      console.log('[ClientService] URL:', baseUrl);
      console.log('[ClientService] Payload:', payload);
    }

    const response = await api.post(baseUrl, payload);
    const data = response.data.data || response.data;

    if (isDev) {
      console.log('[ClientService] Client created successfully:', data);
    }

    return {
      success: true,
      message: response.data.message || 'Client created successfully',
      client: transformClientFromApiFormat(data),
    };
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Update an existing client
 * @param {string|number} clientId - Client ID
 * @param {Object} formData - Updated client form data
 * @returns {Promise<Object>} - Updated client data
 */
export const updateClient = async (clientId, formData) => {
  try {
    const vendorId = getVendorId();
    const baseUrl = getClientBaseUrl(vendorId);

    const payload = transformClientToApiFormat(formData);
    const response = await api.put(`${baseUrl}/${clientId}`, payload);
    const data = response.data.data || response.data;

    return {
      success: true,
      message: response.data.message || 'Client updated successfully',
      client: transformClientFromApiFormat(data),
    };
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Delete a client
 * @param {string|number} clientId - Client ID
 * @returns {Promise<Object>} - Deletion response
 */
export const deleteClient = async (clientId) => {
  try {
    const vendorId = getVendorId();
    const baseUrl = getClientBaseUrl(vendorId);

    const response = await api.delete(`${baseUrl}/${clientId}`);

    return {
      success: true,
      message: response.data.message || 'Client deleted successfully',
    };
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Upload client logo
 * @param {string|number} clientId - Client ID
 * @param {File} file - Logo file to upload
 * @returns {Promise<Object>} - Upload response with logo URL
 */
export const uploadClientLogo = async (clientId, file) => {
  try {
    const vendorId = getVendorId();
    const baseUrl = getClientBaseUrl(vendorId);

    const formData = new FormData();
    formData.append('logo', file);

    const response = await api.post(`${baseUrl}/${clientId}/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      logoUrl: response.data.logo_url || response.data.url,
      message: response.data.message || 'Logo uploaded successfully',
    };
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Search clients
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Matching clients
 */
export const searchClients = async (query) => {
  try {
    const vendorId = getVendorId();
    const baseUrl = getClientBaseUrl(vendorId);

    const response = await api.get(`${baseUrl}/search`, {
      params: { q: query },
    });

    const clients = response.data.data || response.data || [];
    return transformClientsFromApiFormat(clients);
  } catch (error) {
    throw parseApiError(error);
  }
};

// Default export as object for convenience
export default {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  uploadClientLogo,
  searchClients,
  getVendorId,
  transformClientToApiFormat,
  transformClientFromApiFormat,
};
