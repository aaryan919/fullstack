// src/lib/api.js
// Central API client for all backend requests.
// Automatically attaches the Bearer token and handles 401 token refresh.

import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from './auth';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8443';

// ── Low-level fetch wrapper ───────────────────────────────────────────────

async function request(path, options = {}, retry = true) {
  const token = getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  // Attempt token refresh on 401
  if (res.status === 401 && retry) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        saveTokens(data);
        return request(path, options, false); // retry once with new token
      }
    }
    // Refresh failed — clear tokens and throw so AuthContext can redirect
    clearTokens();
    throw Object.assign(new Error('Session expired. Please log in again.'), { status: 401 });
  }

  if (!res.ok) {
    let errMsg = `Request failed: ${res.status}`;
    try {
      const body = await res.json();
      errMsg = body.error || errMsg;
    } catch { /* ignore */ }
    throw Object.assign(new Error(errMsg), { status: res.status });
  }

  return res.json();
}

// ── Auth ─────────────────────────────────────────────────────────────────

export const authApi = {
  signup: (data) =>
    request('/api/auth/signup', { method: 'POST', body: data }),

  login: (data) =>
    request('/api/auth/login', { method: 'POST', body: data }),

  me: () => request('/api/auth/me'),
};

// ── Public ────────────────────────────────────────────────────────────────

export const getPlans = () => request('/api/plans');

export const getServers = () => request('/api/servers');

// ── Payments ──────────────────────────────────────────────────────────────

export const paymentsApi = {
  createOrder: (plan_id) =>
    request('/api/payments/create-order', { method: 'POST', body: { plan_id } }),

  verify: (payload) =>
    request('/api/payments/verify', { method: 'POST', body: payload }),
};

// ── VPN ───────────────────────────────────────────────────────────────────

export const vpnApi = {
  status: () => request('/api/vpn/status'),
  config: () => request('/api/vpn/config'),
  renew: (plan_id) =>
    request('/api/vpn/renew', { method: 'POST', body: { plan_id } }),
  reconnect: () => request('/api/vpn/reconnect', { method: 'POST' }),
};

// ── Account ───────────────────────────────────────────────────────────────

// ── Account ───────────────────────────────────────────────────────────────

export const accountApi = {
  get: () => request('/api/account'),
  update: (data) => request('/api/account', { method: 'PUT', body: data }),
};

// ── Admin ─────────────────────────────────────────────────────────────────

export const adminApi = {
  getStats: () => request('/api/admin/stats'),
  getUsers: () => request('/api/admin/users'),
  getPayments: () => request('/api/admin/payments'),
  getActivity: (params) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/admin/activity?${qs}`);
  },
};