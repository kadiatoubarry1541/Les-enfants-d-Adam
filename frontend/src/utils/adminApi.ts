// API utilities for admin operations
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  const sessionData = localStorage.getItem('session_user');
  if (!sessionData) return null;
  
  try {
    const parsed = JSON.parse(sessionData);
    return parsed.token || null;
  } catch {
    return null;
  }
};

// Helper function for authenticated requests
const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Non authentifié');
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };
  
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
    throw new Error(error.message || `Erreur ${response.status}`);
  }
  
  return response.json();
};

// Get all users with optional filters
export const getAllUsers = async (filters?: {
  search?: string;
  role?: string;
  type?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}) => {
  const params = new URLSearchParams();
  
  if (filters?.search) params.append('search', filters.search);
  if (filters?.role) params.append('role', filters.role);
  if (filters?.type) params.append('type', filters.type);
  if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
  if (filters?.limit) params.append('limit', String(filters.limit));
  if (filters?.offset) params.append('offset', String(filters.offset));
  
  const queryString = params.toString();
  const url = `/api/admin/users${queryString ? `?${queryString}` : ''}`;
  
  return authenticatedFetch(url);
};

// Get a specific user by NumeroH
export const getUserByNumeroH = async (numeroH: string) => {
  return authenticatedFetch(`/api/admin/users/${encodeURIComponent(numeroH)}`);
};

// Update a user
export const updateUser = async (numeroH: string, updates: any) => {
  return authenticatedFetch(`/api/admin/users/${encodeURIComponent(numeroH)}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
};

// Toggle user active status
export const toggleUserStatus = async (numeroH: string) => {
  return authenticatedFetch(`/api/admin/users/${encodeURIComponent(numeroH)}/toggle-status`, {
    method: 'PATCH',
  });
};

// Change user role
export const changeUserRole = async (numeroH: string, role: 'user' | 'admin' | 'super-admin') => {
  return authenticatedFetch(`/api/admin/users/${encodeURIComponent(numeroH)}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
};

// Delete a user
export const deleteUser = async (numeroH: string) => {
  return authenticatedFetch(`/api/admin/users/${encodeURIComponent(numeroH)}`, {
    method: 'DELETE',
  });
};

// Get platform statistics
export const getStats = async () => {
  return authenticatedFetch('/api/admin/stats');
};

// Get all families
export const getAllFamilies = async () => {
  return authenticatedFetch('/api/admin/families');
};

// Search users
export const searchUsers = async (filters: {
  q?: string;
  type?: string;
  role?: string;
  generation?: string;
  pays?: string;
  ethnie?: string;
}) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  
  const queryString = params.toString();
  const url = `/api/admin/search${queryString ? `?${queryString}` : ''}`;
  
  return authenticatedFetch(url);
};

































