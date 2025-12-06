import { create } from 'zustand';
import type { User, RegisterRequest } from '../types/auth.types';
import { generateMockUser } from '../utils/mockData';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    // Mock authentication - simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simple validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Generate mock user and token
    const user = generateMockUser();
    user.email = email;
    const token = 'mock-token-' + Math.random().toString(36).substr(2, 9);

    // Store in localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));

    set({ user, token, isAuthenticated: true });
  },

  register: async (data: RegisterRequest) => {
    // Mock registration - simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simple validation
    if (!data.email || !data.password) {
      throw new Error('Email and password are required');
    }

    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (data.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Generate mock user and token
    const user = generateMockUser();
    user.email = data.email;
    const token = 'mock-token-' + Math.random().toString(36).substr(2, 9);

    // Store in localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));

    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');

    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: () => {
    // Check if user is authenticated on app load
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true });
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    } else {
      // For development: Auto-authenticate with a mock user
      // This allows testing without backend authentication
      const mockUser = generateMockUser();
      mockUser.email = 'demo@researchgennie.com';
      mockUser.name = 'Demo User';
      const mockToken = 'mock-token-auto-' + Math.random().toString(36).substr(2, 9);

      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      set({ user: mockUser, token: mockToken, isAuthenticated: true });
    }
  },
}));
