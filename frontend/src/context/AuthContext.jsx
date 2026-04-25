import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('fooddash_token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('fooddash_user');
    return raw ? JSON.parse(raw) : null;
  });

  const saveUser = useCallback((nextUser) => {
    setUser(nextUser);
    localStorage.setItem('fooddash_user', JSON.stringify(nextUser));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('fooddash_token');
    localStorage.removeItem('fooddash_user');
  }, []);

  useEffect(() => {
    if (!token) return;
    authService.getMe()
      .then((response) => {
        saveUser(response.data);
      })
      .catch(() => logout());
  }, [logout, saveUser, token]);

  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials);
    setToken(response.data.token);
    saveUser(response.data.customer);
    localStorage.setItem('fooddash_token', response.data.token);
    return response.data.customer;
  }, [saveUser]);

  const register = useCallback(async (payload) => {
    const response = await authService.register(payload);
    setToken(response.data.token);
    saveUser(response.data.customer);
    localStorage.setItem('fooddash_token', response.data.token);
    return response.data.customer;
  }, [saveUser]);

  const value = useMemo(
    () => ({ token, user, login, register, logout, saveUser }),
    [login, logout, register, saveUser, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
