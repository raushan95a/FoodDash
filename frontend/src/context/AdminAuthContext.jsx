import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as adminService from '../services/adminService.js';

const AdminAuthContext = createContext(null);

function readStoredAdmin() {
  const raw = localStorage.getItem('fooddash_admin');
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem('fooddash_admin');
    return null;
  }
}

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(readStoredAdmin);
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('fooddash_admin_token'));
  const [checkingAdminSession, setCheckingAdminSession] = useState(Boolean(adminToken));

  const clearAdminSession = useCallback(() => {
    localStorage.removeItem('fooddash_admin_token');
    localStorage.removeItem('fooddash_admin');
    setAdminToken(null);
    setAdmin(null);
  }, []);

  useEffect(() => {
    if (!adminToken) {
      setCheckingAdminSession(false);
      return undefined;
    }

    let cancelled = false;

    async function verifyStoredSession() {
      setCheckingAdminSession(true);
      try {
        const response = await adminService.getAdminMe();
        if (cancelled) return;

        localStorage.setItem('fooddash_admin', JSON.stringify(response.data.admin));
        setAdmin(response.data.admin);
      } catch {
        if (!cancelled) clearAdminSession();
      } finally {
        if (!cancelled) setCheckingAdminSession(false);
      }
    }

    verifyStoredSession();

    return () => {
      cancelled = true;
    };
  }, [adminToken, clearAdminSession]);

  const login = useCallback(async (credentials) => {
    const response = await adminService.adminLogin(credentials);
    localStorage.setItem('fooddash_admin_token', response.data.token);
    localStorage.setItem('fooddash_admin', JSON.stringify(response.data.admin));
    setAdminToken(response.data.token);
    setAdmin(response.data.admin);
    return response.data.admin;
  }, []);

  const logout = useCallback(() => {
    clearAdminSession();
  }, [clearAdminSession]);

  const value = useMemo(
    () => ({ admin, adminToken, checkingAdminSession, login, logout }),
    [admin, adminToken, checkingAdminSession, login, logout]
  );
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
