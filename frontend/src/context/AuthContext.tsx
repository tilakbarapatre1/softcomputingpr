import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  loginAsDemo: (role: 'ADMIN' | 'INVENTORY_MANAGER' | 'STAFF') => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If no user is logged in, auto-login with Admin demo user for seamless instant demo experience
    if (!token) {
      loginAsDemo('ADMIN').catch(() => {});
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const data = await authApi.login(email, pass);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.access_token);
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const loginAsDemo = async (role: 'ADMIN' | 'INVENTORY_MANAGER' | 'STAFF') => {
    const credentials = {
      ADMIN: { email: 'admin@smartinventory.ai', pass: 'admin123' },
      INVENTORY_MANAGER: { email: 'manager@smartinventory.ai', pass: 'manager123' },
      STAFF: { email: 'staff@smartinventory.ai', pass: 'staff123' }
    };
    const cred = credentials[role];
    await login(cred.email, cred.pass);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loginAsDemo, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
