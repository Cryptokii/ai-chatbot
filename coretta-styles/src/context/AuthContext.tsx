import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/auth.service';

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing auth state on mount
    const storedUser = AuthService.getCurrentUser();
    if (storedUser) {
      const isAdmin = storedUser.isAdmin || localStorage.getItem('isAdmin') === 'true';
      setUser({ ...storedUser, isAdmin });
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token: string, userData: User) => {
    const isAdmin = userData.isAdmin || localStorage.getItem('isAdmin') === 'true';
    const userWithAdmin = { ...userData, isAdmin };
    setUser(userWithAdmin);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userWithAdmin));
  };

  const logout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
