// src/routes/admin.js
// Admin-only endpoints for dashboard stats and user management.
'use strict';

const router = require('express').Router();
const pool = require('../db');
const { requireAdmin } = require('../middleware/auth');
const vpnSvc = require('../services/vpn_service');

// All routes require admin
router.use(requireAdmin);

// ── GET /api/admin/stats ──────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const usersCountRes = await pool.query('SELECT COUNT(*) FROM users');
    const activeSubsRes = await pool.query("SELECT COUNT(*) FROM subscriptions WHERE status = 'active'");
    const totalDataRes = await pool.query('SELECT SUM(data_used_bytes) FROM vpn_clients');

    // In a real app, revenue might be more complex, but we can sum payments.
    const revenueRes = await pool.query("SELECT SUM(amount) FROM payments WHERE status = 'captured'");

    res.json({
      totalUsers: parseInt(usersCountRes.rows[0].count, 10),
      activeSubscriptions: parseInt(activeSubsRes.rows[0].count, 10),
      totalDataBytes: totalDataRes.rows[0].sum || 0,
      totalRevenue: revenueRes.rows[0].sum || 0
    });
  } catch (err) {
    console.error('[admin/stats]', err.message);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// ── GET /api/admin/users ──────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.is_admin,
        u.created_at,
        p.name AS plan_name,
        vc.status AS vpn_status,
        vc.data_used_bytes,
        vc.data_cap_bytes
      FROM users u
      LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
      LEFT JOIN plans p ON p.id = s.plan_id
      LEFT JOIN vpn_clients vc ON vc.user_id = u.id
      ORDER BY u.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('[admin/users]', err.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ── GET /api/admin/payments ───────────────────────────────────────────────
router.get('/payments', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        pay.id,
        pay.razorpay_order_id,
        pay.razorpay_payment_id,
        pay.amount,
        pay.status,
        pay.created_at,
        u.email
      FROM payments pay
      JOIN users u ON u.id = pay.user_id
      ORDER BY pay.created_at DESC
      LIMIT 100
    `);
    res.json(rows);
  } catch (err) {
    console.error('[admin/payments]', err.message);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});
// ── GET /api/admin/activity?since=<ISO timestamp>&until=<ISO timestamp> ────
// ── GET /api/admin/activity?since=X&until=Y&user_id=optional ───────────────
router.get('/activity', async (req, res) => {
  const { since, until, user_id } = req.query;
  if (!since || !until) {
    return res.status(400).json({ error: 'since and until query params are required.' });
  }
  try {
    const params = [since, until];
    let userFilter = '';
    if (user_id) {
      params.push(user_id);
      userFilter = `AND ul.user_id = $${params.length}`;
    }
    const { rows } = await pool.query(`
      SELECT
        ul.recorded_at,
        ul.last_online,
        ul.up_bytes_delta + ul.down_bytes_delta AS bytes_moved,
        u.id AS user_id,
        u.email,
        u.name
      FROM usage_logs ul
      JOIN users u ON u.id = ul.user_id
      WHERE ul.recorded_at BETWEEN $1 AND $2
      ${userFilter}
      ORDER BY ul.recorded_at DESC
    `, params);
    res.json(rows);
  } catch (err) {
    console.error('[admin/activity]', err.message);
    res.status(500).json({ error: 'Failed to fetch activity log.' });
  }
});

module.exports = router;
