import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/auth';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

class AuthService {
  private static setToken(token: string) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  static async login(email: string, password: string) {
    try {
      // For demo purposes
      const user = {
        id: '1',
        email,
        name: 'Demo User',
        role: 'user'
      };
      const token = 'user-token-' + Date.now();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { token, user };
    } catch (error) {
      throw AuthService.handleError(error);
    }
  }

  static async adminLogin(email: string, password: string) {
    // For demo purposes, hardcoding admin credentials
    const adminCredentials = {
      email: 'admin@corettastyles.com',
      password: 'admin123'
    };

    if (email === adminCredentials.email && password === adminCredentials.password) {
      const adminUser = {
        id: 'admin-1',
        email: adminCredentials.email,
        name: 'Admin User',
        role: 'admin',
        isAdmin: true
      };

      const token = 'admin-token-' + Date.now();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(adminUser));
      localStorage.setItem('isAdmin', 'true');

      return { token, user: adminUser };
    } else {
      throw new Error('Invalid admin credentials');
    }
  }

  static async register(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/register`, { name, email, password });
      const { token, user } = response.data;
      this.setToken(token);
      return { token, user };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async requestPasswordReset(email: string): Promise<ResetPasswordResponse> {
    try {
      const response = await axios.post<ResetPasswordResponse>(`${API_URL}/reset-password-request`, { email });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async resetPassword(token: string, newPassword: string): Promise<ResetPasswordResponse> {
    try {
      const response = await axios.post<ResetPasswordResponse>(`${API_URL}/reset-password`, { token, newPassword });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async socialLogin(provider: 'google' | 'facebook', accessToken: string): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/social-login/${provider}`, { accessToken });
      const { token, user } = response.data;
      this.setToken(token);
      return { token, user };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    delete axios.defaults.headers.common['Authorization'];
  }

  static getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }

  static isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  private static handleError(error: unknown): Error {
    return new Error(
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
  }
}

export default AuthService;