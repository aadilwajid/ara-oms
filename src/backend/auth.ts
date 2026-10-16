// Authentication Service
// Handles user authentication and session management

import { db } from './database';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  token?: string;
  error?: string;
}

class AuthService {
  private currentSession: AuthUser | null = null;

  constructor() {
    this.loadSession();
  }

  private loadSession(): void {
    const session = localStorage.getItem('auth_session');
    if (session) {
      this.currentSession = JSON.parse(session);
    }
  }

  private saveSession(user: AuthUser): void {
    this.currentSession = user;
    localStorage.setItem('auth_session', JSON.stringify(user));
    localStorage.setItem('auth_token', this.generateToken(user));
  }

  private generateToken(user: AuthUser): string {
    // Simple token generation (in real app, use JWT)
    return btoa(`${user.id}:${user.email}:${Date.now()}`);
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const users = await db.getAll<AuthUser & { password: string }>('users');
      const user = users.find(u => u.email === credentials.email);

      if (!user) {
        return { success: false, error: 'User not found' };
      }

      if (user.password !== credentials.password) {
        return { success: false, error: 'Invalid password' };
      }

      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      this.saveSession(authUser);

      // Log activity
      const logs = await db.getAll<any>('activity_logs');
      logs.unshift({
        id: Date.now().toString(),
        action: 'User Login',
        details: `${authUser.name} logged in`,
        timestamp: new Date().toISOString(),
        user: authUser.name,
      });
      localStorage.setItem('db_activity_logs', JSON.stringify(logs.slice(0, 100)));

      return {
        success: true,
        user: authUser,
        token: localStorage.getItem('auth_token') || '',
      };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  }

  async logout(): Promise<void> {
    this.currentSession = null;
    localStorage.removeItem('auth_session');
    localStorage.removeItem('auth_token');
  }

  getCurrentUser(): AuthUser | null {
    return this.currentSession;
  }

  isAuthenticated(): boolean {
    return this.currentSession !== null;
  }

  async register(userData: AuthUser & { password: string }): Promise<AuthResponse> {
    try {
      const users = await db.getAll<AuthUser & { password: string }>('users');
      
      // Check if email already exists
      if (users.find(u => u.email === userData.email)) {
        return { success: false, error: 'Email already registered' };
      }

      const newUser = {
        ...userData,
        id: Date.now().toString(),
      };

      await db.create('users', newUser);

      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  }

  async initializeDefaultUsers(): Promise<void> {
    const users = await db.getAll<any>('users');
    if (users.length === 0) {
      // Create default admin user
      await this.register({
        id: '',
        email: 'admin@storeos.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
      });

      // Create default manager
      await this.register({
        id: '',
        email: 'manager@storeos.com',
        password: 'manager123',
        name: 'Manager User',
        role: 'manager',
      });

      // Create default staff
      await this.register({
        id: '',
        email: 'staff@storeos.com',
        password: 'staff123',
        name: 'Staff User',
        role: 'staff',
      });
    }
  }
}

export const authService = new AuthService();
