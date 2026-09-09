import type { User, LoginCredentials, SignupData } from '@/types';
import { users, adminUser } from '@/data/users';
import { fetchApi } from './apiClient';

const allUsers = [...users, adminUser];
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const authService = {
  async login({ email, password, rememberMe }: LoginCredentials): Promise<User> {
    try {
      const data = await fetchApi<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (data.token) {
        if (rememberMe) {
          localStorage.setItem('bitehub_token', data.token);
        } else {
          sessionStorage.setItem('bitehub_token', data.token);
        }
      }

      return data.user;
    } catch (err: any) {
      // Fallback to local mock auth if backend is unreachable
      if (err.message?.includes('Failed to fetch') || err.message?.includes('HTTP Error 404')) {
        await delay(500);
        const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) throw new Error('No account found with this email address.');
        if (user.password !== password) throw new Error('Incorrect password. Please try again.');
        return { ...user };
      }
      throw err;
    }
  },

  async signup(data: SignupData): Promise<User> {
    try {
      const res = await fetchApi<{ user: User; token: string }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
        }),
      });

      if (res.token) {
        localStorage.setItem('bitehub_token', res.token);
      }

      return res.user;
    } catch (err: any) {
      // Fallback to local mock auth if backend is unreachable
      if (err.message?.includes('Failed to fetch') || err.message?.includes('HTTP Error 404')) {
        await delay(500);
        const existing = allUsers.find(u => u.email.toLowerCase() === data.email.toLowerCase());
        if (existing) throw new Error('An account with this email already exists.');
        if (data.password !== data.confirmPassword) throw new Error('Passwords do not match.');
        if (data.password.length < 6) throw new Error('Password must be at least 6 characters.');

        const newUser: User = {
          id: `USR${String(allUsers.length + 1).padStart(3, '0')}`,
          name: data.name,
          email: data.email,
          phone: data.phone,
          avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(data.email)}`,
          role: 'USER',
          password: data.password,
          addresses: [],
          favoriteRestaurants: [],
          favoriteDishes: [],
          createdAt: new Date().toISOString(),
        };
        allUsers.push(newUser);
        return { ...newUser };
      }
      throw err;
    }
  },

  logout(): void {
    localStorage.removeItem('bitehub_token');
    sessionStorage.removeItem('bitehub_token');
    localStorage.removeItem('biteai_user');
    sessionStorage.removeItem('biteai_user');
  },

  getCurrentUser(): User | null {
    const stored = localStorage.getItem('biteai_user') || sessionStorage.getItem('biteai_user');
    if (!stored) return null;
    try { return JSON.parse(stored); } catch { return null; }
  },
};
