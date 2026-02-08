import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  searchClients,
} from '../services/clientService';

/**
 * Custom hook for managing clients list with pagination, search, and filtering
 * @param {Object} initialOptions - Initial query options
 * @returns {Object} - Client state and methods
 */
export const useClients = (initialOptions = {}) => {
  // State
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: initialOptions.limit || 10,
  });

  // Query options state
  const [queryOptions, setQueryOptions] = useState({
    page: 1,
    limit: initialOptions.limit || 10,
    search: '',
    status: '',
    category: '',
    sortBy: '',
    sortOrder: 'asc',
    ...initialOptions,
  });

  // Ref to track if component is mounted
  const isMounted = useRef(true);

  // Fetch clients
  const fetchClients = useCallback(async (options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const mergedOptions = { ...queryOptions, ...options };
      const response = await getClients(mergedOptions);

      if (isMounted.current) {
        setClients(response.clients);
        setPagination(response.pagination);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err.message || 'Failed to fetch clients');
        setClients([]);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [queryOptions]);

  // Initial fetch
  useEffect(() => {
    isMounted.current = true;
    fetchClients();

    return () => {
      isMounted.current = false;
    };
  }, []);

  // Refetch when query options change
  useEffect(() => {
    fetchClients(queryOptions);
  }, [queryOptions]);

  // Search handler with debounce
  const handleSearch = useCallback((searchTerm) => {
    setQueryOptions((prev) => ({
      ...prev,
      search: searchTerm,
      page: 1, // Reset to first page on search
    }));
  }, []);

  // Page change handler
  const handlePageChange = useCallback((page) => {
    setQueryOptions((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  // Filter handlers
  const handleFilterChange = useCallback((filterName, value) => {
    setQueryOptions((prev) => ({
      ...prev,
      [filterName]: value,
      page: 1, // Reset to first page on filter change
    }));
  }, []);

  // Sort handler
  const handleSort = useCallback((sortBy, sortOrder = 'asc') => {
    setQueryOptions((prev) => ({
      ...prev,
      sortBy,
      sortOrder,
    }));
  }, []);

  // Refresh clients
  const refresh = useCallback(() => {
    fetchClients(queryOptions);
  }, [fetchClients, queryOptions]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setQueryOptions({
      page: 1,
      limit: initialOptions.limit || 10,
      search: '',
      status: '',
      category: '',
      sortBy: '',
      sortOrder: 'asc',
    });
  }, [initialOptions.limit]);

  return {
    // Data
    clients,
    loading,
    error,
    pagination,
    queryOptions,
    
    // Methods
    fetchClients,
    handleSearch,
    handlePageChange,
    handleFilterChange,
    handleSort,
    refresh,
    resetFilters,
    setQueryOptions,
  };
};

/**
 * Custom hook for managing a single client (fetch, create, update, delete)
 * @param {string|number} clientId - Client ID (optional, for edit mode)
 * @returns {Object} - Client state and methods
 */
export const useClient = (clientId = null) => {
  // State
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Ref to track if component is mounted
  const isMounted = useRef(true);

  // Fetch client by ID
  const fetchClient = useCallback(async (id) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getClientById(id);
      if (isMounted.current) {
        setClient(data);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err.message || 'Failed to fetch client');
        setClient(null);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  // Fetch on mount if clientId provided
  useEffect(() => {
    isMounted.current = true;

    if (clientId) {
      fetchClient(clientId);
    }

    return () => {
      isMounted.current = false;
    };
  }, [clientId, fetchClient]);

  // Create client
  const create = useCallback(async (formData) => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await createClient(formData);
      if (isMounted.current) {
        setClient(response.client);
        setSuccess(response.message);
      }
      return response;
    } catch (err) {
      if (isMounted.current) {
        setError(err.message || 'Failed to create client');
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setSaving(false);
      }
    }
  }, []);

  // Update client
  const update = useCallback(async (id, formData) => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await updateClient(id, formData);
      if (isMounted.current) {
        setClient(response.client);
        setSuccess(response.message);
      }
      return response;
    } catch (err) {
      if (isMounted.current) {
        setError(err.message || 'Failed to update client');
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setSaving(false);
      }
    }
  }, []);

  // Delete client
  const remove = useCallback(async (id) => {
    setDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await deleteClient(id);
      if (isMounted.current) {
        setClient(null);
        setSuccess(response.message);
      }
      return response;
    } catch (err) {
      if (isMounted.current) {
        setError(err.message || 'Failed to delete client');
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setDeleting(false);
      }
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear success
  const clearSuccess = useCallback(() => {
    setSuccess(null);
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setClient(null);
    setError(null);
    setSuccess(null);
    setLoading(false);
    setSaving(false);
    setDeleting(false);
  }, []);

  return {
    // Data
    client,
    loading,
    saving,
    deleting,
    error,
    success,
    
    // Methods
    fetchClient,
    create,
    update,
    remove,
    clearError,
    clearSuccess,
    reset,
    setClient,
  };
};

/**
 * Custom hook for client search with debounce
 * @param {number} debounceMs - Debounce delay in milliseconds
 * @returns {Object} - Search state and methods
 */
export const useClientSearch = (debounceMs = 300) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  
  const debounceRef = useRef(null);

  // Search with debounce
  const search = useCallback((searchQuery) => {
    setQuery(searchQuery);

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // If empty query, clear results
    if (!searchQuery.trim()) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);

    // Debounce the search
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchClients(searchQuery);
        setResults(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Search failed');
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, debounceMs);
  }, [debounceMs]);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    query,
    results,
    searching,
    error,
    search,
    clearSearch,
  };
};

export default {
  useClients,
  useClient,
  useClientSearch,
};
