import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../api/axios';
import type { AuthContextType } from './AuthTypes';
import type { User } from '../utils/types';
import { showToast } from '../utils/toast';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [wasLoggedOut, setWasLoggedOut] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');
    if (storedToken) {
      const payload = JSON.parse(atob(storedToken.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      if (isExpired) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        delete api.defaults.headers.common.Authorization;
        setUser(null);
        setWasLoggedOut(true);
        showToast('Sesja wygasła. Zaloguj się ponownie.');
        return;
      }
      api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const login = ({ token, user }: { token: string; user: User }) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setUser(user);
    setWasLoggedOut(false);
    navigate('/');
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    delete api.defaults.headers.common.Authorization;
    setUser(null);
    setWasLoggedOut(true);
    navigate('/auth');
    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.has_admin_privileges ?? false,
        login,
        logout,
        wasLoggedOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
