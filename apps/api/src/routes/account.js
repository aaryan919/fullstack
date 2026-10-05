// src/routes/account.js
// GET /api/account   — feeds AccountPage
// PUT /api/account   — update profile name
'use strict';

const router = require('express').Router();
const pool   = require('../db');
const { requireAuth } = require('../middleware/auth');

// ── GET /api/account ─────────────────────────────────────────────────────

router.get('/', requireAuth, async (req, res) => {
  try {
    // User info
    const { rows: userRows } = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (!userRows.length) return res.status(404).json({ error: 'User not found.' });
    const user = userRows[0];

    // Active subscription + plan
    const { rows: subRows } = await pool.query(
      `SELECT s.id, s.plan_id, s.status, s.started_at, s.expires_at,
              p.name AS plan_name, p.price, p.cycle, p.devices, p.data_cap_gb,
              p.features, p.popular
       FROM subscriptions s
       JOIN plans p ON p.id = s.plan_id
       WHERE s.user_id = $1 AND s.status = 'active'
       ORDER BY s.id DESC LIMIT 1`,
      [req.user.id]
    );

    const sub = subRows[0] || null;

    // Active VPN client
    let vpnInfo = null;
    if (sub) {
      const { rows: vpnRows } = await pool.query(
        `SELECT data_used_bytes, data_cap_bytes, expires_at, status
         FROM vpn_clients
         WHERE user_id = $1 AND subscription_id = $2
         ORDER BY id DESC LIMIT 1`,
        [req.user.id, sub.id]
      );
      if (vpnRows.length) {
        const v = vpnRows[0];
        vpnInfo = {
          data_used_gb: parseFloat((v.data_used_bytes / (1024 ** 3)).toFixed(2)),
          data_cap_gb:  v.data_cap_bytes
            ? parseFloat((v.data_cap_bytes / (1024 ** 3)).toFixed(2))
            : null,
          expires_at: v.expires_at,
          status:     v.status,
        };
      }
    }

    // Format joined date like mock: "January 2025"
    const joined = user.created_at
      ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : null;

    return res.json({
      id:    user.id,
      name:  user.name,
      email: user.email,
      joined,
      active_plan: sub
        ? {
            id:          sub.plan_id,
            name:        sub.plan_name,
            price:       sub.price,
            cycle:       sub.cycle,
            devices:     sub.devices,
            data_cap_gb: sub.data_cap_gb,
            features:    Array.isArray(sub.features) ? sub.features : JSON.parse(sub.features || '[]'),
            popular:     sub.popular,
            expires_at:  sub.expires_at,
          }
        : null,
      vpn: vpnInfo,
    });
  } catch (err) {
    console.error('[account/get]', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// ── PUT /api/account ─────────────────────────────────────────────────────

router.put('/', requireAuth, async (req, res) => {
  const { name } = req.body || {};
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters.' });
  }

  try {
    const { rows } = await pool.query(
      'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, email',
      [name.trim(), req.user.id]
    );
    return res.json({ user: rows[0] });
  } catch (err) {
    console.error('[account/put]', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
