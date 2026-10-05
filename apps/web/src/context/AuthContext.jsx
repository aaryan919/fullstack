// src/context/AuthContext.jsx
// Global auth state — user, login, logout, isLoggedIn.
// Wrap <App> with <AuthProvider> so all components can useAuth().

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../lib/api';
import { saveTokens, clearTokens, isLoggedIn as tokenIsLoggedIn, getTokenPayload } from '../lib/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true while hydrating from stored token

  // Hydrate user from stored token on mount
  useEffect(() => {
    async function hydrate() {
      if (!tokenIsLoggedIn()) {
        setLoading(false);
        return;
      }
      try {
        const { user: me } = await authApi.me();
        setUser(me);
      } catch {
        // Token invalid / expired — clear it
        clearTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    hydrate();
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password });
    saveTokens(data);
    setUser(data.user);
    return data.user;
  }, []);

  const signup = useCallback(async (name, email, password) => {
    const data = await authApi.signup({ name, email, password });
    saveTokens(data);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  // Optimistic user update (used after PUT /api/account)
  const updateUser = useCallback((updates) => {
    setUser((prev) => prev ? { ...prev, ...updates } : prev);
  }, []);

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    login,
    signup,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
