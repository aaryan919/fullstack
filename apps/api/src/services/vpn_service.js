// src/services/vpn_service.js
// Wraps the 3X-UI panel REST API.
// Docs: https://github.com/MHSanaei/3x-ui (API section)
// Auth is session-cookie based (not Bearer token).
'use strict';

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// ── Session state (one login per process lifetime, refreshed on 401) ─────
let _sessionCookie = null;
let _panelBase = null;
let _csrfToken = null;

function panelBase() {
  return process.env.PANEL_BASE_URL || 'http://localhost:2087';
}

/**
 * Login to 3X-UI panel and cache the session cookie.
 * Called automatically before any API request.
 */
async function loginPanel() {
  _panelBase = panelBase();

  // Step 1: GET the root page to obtain a session cookie + CSRF token
  const pageRes = await axios.get(_panelBase + '/', {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });

  const initialCookie = (pageRes.headers['set-cookie'] || [])
    .map((c) => c.split(';')[0])
    .join('; ');

  const csrfMatch = pageRes.data.match(/name="csrf-token"\s+content="([^"]+)"/);
  const csrfToken = csrfMatch ? csrfMatch[1] : null;
  if (!initialCookie || !csrfToken) {
    throw new Error('3X-UI: could not obtain session cookie or CSRF token from root page.');
  }

  // Step 2: POST credentials, including the session cookie and CSRF token
  const res = await axios.post(
    `${_panelBase}/login`,
    new URLSearchParams({
      username: process.env.PANEL_USERNAME,
      password: process.env.PANEL_PASSWORD,
      twoFactorCode: '',
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': _panelBase,
        'Referer': `${_panelBase}/login`,
        'User-Agent': 'Mozilla/5.0',
        'X-CSRF-Token': csrfToken,
        'X-Requested-With': 'XMLHttpRequest',
        'Cookie': initialCookie,
      },
    }
  );

  const setCookie = res.headers['set-cookie'];
  if (!setCookie) throw new Error('3X-UI login failed — no session cookie returned.');

  // Extract just the session cookie value (may be a refreshed one)
  _sessionCookie = setCookie.map((c) => c.split(';')[0]).join('; ');
  _csrfToken = csrfToken;
  return _sessionCookie;
}

/**
 * Make an authenticated request to the 3X-UI panel.
 * Auto-retries once on 401 (re-login).
 */
async function panelRequest(method, path, data = null) {
  if (!_sessionCookie) await loginPanel();

  async function attempt() {
    const config = {
      method,
      url: `${panelBase()}${path}`,
      headers: {
        Cookie: _sessionCookie,
        'X-CSRF-Token': _csrfToken,
        'X-Requested-With': 'XMLHttpRequest',
      },
    };
    if (data) {
      config.data = data;
      config.headers['Content-Type'] = 'application/json';
    }
    return axios(config);
  }

  try {
    return (await attempt()).data;
  } catch (err) {
    if (err.response?.status === 401) {
      // Re-login and retry once
      await loginPanel();
      return (await attempt()).data;
    }
    throw err;
  }
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Add a new client to the 3X-UI inbound.
 * @param {object} server        Server row from DB (has inbound_id)
 * @param {number} userId        ProjectVPN user ID
 * @param {string} emailTag      identifies client in 3X-UI — use the user's real email
 * @param {number|null} dataCapGB  null = unlimited
 * @param {number} durationDays
 * @param {string} [comment]     shown in panel — e.g. the user's display name
 * @returns {{ client_uuid: string, subscription_url: string }}
 */
async function addClient(server, userId, emailTag, dataCapGB, durationDays, comment = '') {
  const clientUuid = uuidv4();
  const expiryTime = Date.now() + durationDays * 24 * 60 * 60 * 1000;
  const totalGB = dataCapGB || 0; // 0 = unlimited in 3X-UI
  const totalBytes = totalGB * 1024 * 1024 * 1024;

  const payload = {
    client: {
      email: emailTag,
      subId: emailTag,
      id: clientUuid,
      password: uuidv4().slice(0, 16),
      auth: uuidv4().slice(0, 16),
      flow: '',
      security: 'auto',
      totalGB: totalBytes,
      expiryTime: expiryTime,
      reset: 0,
      limitIp: 0,
      tgId: 0,
      group: '',
      comment: comment,
      enable: true,
    },
    inboundIds: [server.inbound_id],
  };

  const result = await panelRequest('POST', '/panel/api/clients/add', payload);
  if (!result.success) {
    throw new Error(`3X-UI addClient failed: ${result.msg || JSON.stringify(result)}`);
  }

  // Build the subscription URL — 3X-UI format: /sub/<subId>
  const subscriptionUrl = `${panelBase()}/sub/${emailTag}`;

  return { client_uuid: clientUuid, subscription_url: subscriptionUrl };
}

/**
 * Update an existing client's data cap and expiry (used for renewals).
 * @param {string} clientUuid
 * @param {string} emailTag
 * @param {object} server
 * @param {number|null} dataCapGB
 * @param {number} durationDays
 * @param {string} [comment]
 */
async function updateClient(clientUuid, emailTag, server, dataCapGB, durationDays, comment = '') {
  const expiryTime = Date.now() + durationDays * 24 * 60 * 60 * 1000;
  const totalGB = dataCapGB || 0;
  const totalBytes = totalGB * 1024 * 1024 * 1024;

  const payload = {
    email: emailTag,
    subId: emailTag,
    id: clientUuid,
    password: uuidv4().slice(0, 16),
    auth: uuidv4().slice(0, 16),
    flow: '',
    security: 'auto',
    totalGB: totalBytes,
    expiryTime: expiryTime,
    reset: 0,
    limitIp: 0,
    tgId: 0,
    group: '',
    comment: comment,
    enable: true,
  };

  const result = await panelRequest('POST', `/panel/api/clients/update/${emailTag}`, payload);
  if (!result.success) {
    throw new Error(`3X-UI updateClient failed: ${result.msg || JSON.stringify(result)}`);
  }
}

/**
 * Delete (revoke) a client from 3X-UI.
 * @param {number} inboundId
 * @param {string} clientUuid
 */
async function deleteClient(inboundId, emailTag) {
  const result = await panelRequest('POST', `/panel/api/clients/del/${emailTag}`);
  if (!result.success) {
    throw new Error(`3X-UI deleteClient failed: ${result.msg || JSON.stringify(result)}`);
  }
}

/**
 * Get traffic stats for a specific client email tag.
 * @param {string} emailTag  e.g. 'user_42'
 * @returns {{ up: number, down: number, total: number, enable: boolean }}
 */
async function getClientTraffics(emailTag, inboundId) {
  const result = await panelRequest('GET', `/panel/api/inbounds/get/${inboundId}`);
  const stats = (result.obj?.clientStats || []).find((c) => c.email === emailTag);
  if (!stats) return { up: 0, down: 0, total: 0, enable: false, found: false };
  return {
    up: stats.up || 0,
    down: stats.down || 0,
    total: stats.total || 0,
    enable: stats.enable !== false,
    found: true,
  };
}

/**
 * List all inbounds on the panel — useful for confirming the correct inbound ID.
 * Also returns raw data so callers can inspect embedded clientStats if present.
 */
async function listInbounds() {
  const result = await panelRequest('GET', '/panel/api/inbounds/list');
  return result.obj || [];
}

/**
 * Debug helper: dump the full raw inbound object (including any embedded
 * client stats) for inspection.
 */
async function debugGetRawInbound(inboundId) {
  const result = await panelRequest('GET', `/panel/api/inbounds/get/${inboundId}`);
  return result.obj;
}

module.exports = { addClient, updateClient, deleteClient, getClientTraffics, loginPanel, listInbounds, debugGetRawInbound };