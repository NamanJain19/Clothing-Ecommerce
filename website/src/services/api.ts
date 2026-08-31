/**
 * Centralized API client for Monolith Luxury E-Commerce Website
 */

export const API_BASE_URL: string =
  (import.meta as any).env?.VITE_API_URL || 'http://localhost:3011/api';

const TOKEN_KEY = 'luxury_token';

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    console.warn('Failed to read auth token from localStorage:', e);
    return null;
  }
};

export const setToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    console.warn('Failed to save auth token to localStorage:', e);
  }
};

export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.warn('Failed to remove auth token from localStorage:', e);
  }
};

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  user?: any;
  token?: string;
  data?: T;
  product?: any;
  products?: any[];
  cart?: any;
  error?: string;
  errors?: Record<string, string>;
}

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  const token = getToken();
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    let json: any = {};
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        json = await response.json();
      } catch (err) {
        console.warn('Failed to parse JSON response:', err);
      }
    }

    if (!response.ok) {
      const errorMessage =
        json.message ||
        json.error ||
        `Request failed with status ${response.status} (${response.statusText})`;
      
      // Auto clear token on 401 Unauthorized for protected endpoints
      if (response.status === 401 && endpoint !== '/auth/login') {
        removeToken();
      }

      throw new ApiError(errorMessage, response.status, json);
    }

    return json as ApiResponse<T>;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network or other fetch errors
    throw new ApiError(
      error.message || 'Unable to connect to server. Please ensure the backend is running.',
      0
    );
  }
};
