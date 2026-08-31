import { apiRequest, setToken, removeToken, ApiResponse } from './api';

export interface User {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone?: string;
  avatar?: string;
  googleId?: string;
  role: 'customer' | 'admin' | 'manager' | 'staff';
  isActive?: boolean;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  tier?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  avatar?: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse extends ApiResponse {
  user?: User;
  token?: string;
}

/**
 * Format raw user object from backend to frontend friendly shape
 */
export const formatUser = (user: any): User => {
  if (!user) return user;
  const firstName = user.firstName || user.name?.split(' ')?.[0] || 'Client';
  const nameParts = (user.name || user.fullName || '').split(' ');
  const lastName = user.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');
  const fullName = `${firstName} ${lastName}`.trim() || user.name || user.fullName || user.email;
  const avatar = user.avatar || user.picture || user.photoURL || '';

  return {
    ...user,
    id: user._id || user.id,
    firstName,
    lastName,
    fullName,
    avatar,
    googleId: user.googleId || user.google_id,
    tier: user.tier || (user.role === 'customer' ? 'Private Client // Tier I' : 'Staff Concierge'),
  };
};

export const authService = {
  /**
   * Login user with credentials via POST /api/auth/login
   */
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    const res = await apiRequest<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (!res.token || !res.user) {
      throw new Error(res.message || 'Login failed: Invalid server response');
    }

    setToken(res.token);
    const formattedUser = formatUser(res.user);
    return { user: formattedUser, token: res.token };
  },

  /**
   * Register new user via POST /api/auth/register
   */
  register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
    const res = await apiRequest<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!res.token || !res.user) {
      throw new Error(res.message || 'Registration failed: Invalid server response');
    }

    setToken(res.token);
    const formattedUser = formatUser(res.user);
    return { user: formattedUser, token: res.token };
  },

  /**
   * Login with Firebase Google ID Token via POST /api/auth/google
   */
  loginWithGoogle: async (googleData: {
    idToken: string;
    email?: string | null;
    displayName?: string | null;
    photoURL?: string | null;
  }): Promise<{ user: User; token: string }> => {
    const res = await apiRequest<any>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({
        idToken: googleData.idToken,
        email: googleData.email,
        name: googleData.displayName,
        avatar: googleData.photoURL,
      }),
    });

    if (!res.token || !res.user) {
      throw new Error(res.message || 'Google authentication failed');
    }

    setToken(res.token);
    const formattedUser = formatUser(res.user);
    return { user: formattedUser, token: res.token };
  },

  /**
   * Get current authenticated user profile via GET /api/auth/me
   */
  getMe: async (): Promise<User> => {
    const res = await apiRequest<any>('/auth/me', {
      method: 'GET',
    });

    if (!res.user) {
      throw new Error('Failed to retrieve user profile');
    }

    return formatUser(res.user);
  },

  /**
   * Update profile via PUT /api/auth/profile
   */
  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const res = await apiRequest<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (!res.user) {
      throw new Error(res.message || 'Failed to update profile');
    }

    return formatUser(res.user);
  },

  /**
   * Change password via PUT /api/auth/change-password
   */
  changePassword: async (data: ChangePasswordData): Promise<void> => {
    const res = await apiRequest<any>('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (!res.success) {
      throw new Error(res.message || 'Failed to change password');
    }
  },

  /**
   * Delete customer account via DELETE /api/auth/account
   */
  deleteAccount: async (): Promise<void> => {
    try {
      await apiRequest('/auth/account', {
        method: 'DELETE',
      });
    } finally {
      removeToken();
    }
  },

  /**
   * Request password reset link via POST /api/auth/forgot-password
   */
  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    const res = await apiRequest<any>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim() }),
    });

    return {
      success: Boolean(res.success),
      message: res.message || 'If an account exists for this email, a reset link has been sent.',
    };
  },

  /**
   * Verify password reset token via GET /api/auth/reset-password/verify?token=...
   */
  verifyResetToken: async (token: string): Promise<{ valid: boolean; email?: string; message?: string }> => {
    try {
      const res = await apiRequest<any>(`/auth/reset-password/verify?token=${encodeURIComponent(token.trim())}`, {
        method: 'GET',
      });

      return {
        valid: Boolean((res as any).valid),
        email: (res as any).email,
        message: res.message,
      };
    } catch (err: any) {
      return {
        valid: false,
        message: err.message || 'Invalid or expired password reset link.',
      };
    }
  },

  /**
   * Reset password with token via POST /api/auth/reset-password
   */
  resetPassword: async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    const res = await apiRequest<any>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token: token.trim(),
        newPassword,
      }),
    });

    if (!res.success) {
      throw new Error(res.message || 'Failed to reset password');
    }

    return {
      success: true,
      message: res.message || 'Password has been reset successfully.',
    };
  },

  /**
   * Logout user via POST /api/auth/logout
   */
  logout: async (): Promise<void> => {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (e) {
      console.warn('Backend logout call warning:', e);
    } finally {
      removeToken();
    }
  },
};
