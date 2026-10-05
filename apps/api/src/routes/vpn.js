// src/routes/vpn.js
// GET    /api/vpn/status   — feeds DashboardPage
// GET    /api/vpn/config   — regenerate/re-download QR
// POST   /api/vpn/renew    — initiate renewal payment order
// DELETE /api/vpn/revoke   — admin only
'use strict';

const router = require('express').Router();
const QRCode = require('qrcode');
const pool = require('../db');
const vpnSvc = require('../services/vpn_service');
const razorpay = require('../services/razorpay');
const { requireAuth } = require('../middleware/auth');

// ── Helper: build the full VPN status payload ─────────────────────────────

async function buildVpnStatus(userId) {
  const { rows } = await pool.query(
    `SELECT
       vc.id, vc.subscription_url, vc.data_used_bytes, vc.data_cap_bytes,
       vc.expires_at, vc.status AS client_status,
       s.status AS sub_status, s.plan_id,
       p.name AS plan_name, p.data_cap_gb, p.cycle, p.devices
     FROM vpn_clients vc
     JOIN subscriptions s ON s.id = vc.subscription_id
     JOIN plans p         ON p.id = s.plan_id
     WHERE vc.user_id = $1
     ORDER BY vc.id DESC
     LIMIT 1`,
    [userId]
  );

  if (!rows.length) return null;
  const r = rows[0];

  // Generate QR code as base64 data URI
  let qr_code_base64 = null;
  if (r.subscription_url) {
    qr_code_base64 = await QRCode.toDataURL(r.subscription_url, {
      width: 300,
      margin: 2,
      color: { dark: '#1a2e1a', light: '#f7f4ee' },
    });
  }

  const dataUsedGB = r.data_used_bytes
    ? parseFloat((r.data_used_bytes / (1024 ** 3)).toFixed(2))
    : 0;

  return {
    has_subscription: true,
    client_status: r.client_status,   // active | data_exceeded | expired | revoked
    sub_status: r.sub_status,      // active | pending | superseded
    plan: r.plan_id,
    plan_name: r.plan_name,
    data_used_gb: dataUsedGB,
    data_cap_gb: r.data_cap_gb,     // null = unlimited
    expires_at: r.expires_at,
    subscription_url: r.subscription_url,
    qr_code_base64,
  };
}

// ── GET /api/vpn/status ───────────────────────────────────────────────────

router.get('/status', requireAuth, async (req, res) => {
  try {
    const status = await buildVpnStatus(req.user.id);
    if (!status) {
      return res.json({ has_subscription: false });
    }
    return res.json(status);
  } catch (err) {
    console.error('[vpn/status]', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// ── GET /api/vpn/config ───────────────────────────────────────────────────
// Always regenerates QR code. Same payload shape as status.

router.get('/config', requireAuth, async (req, res) => {
  try {
    const status = await buildVpnStatus(req.user.id);
    if (!status) return res.status(404).json({ error: 'No active VPN subscription found.' });
    return res.json(status);
  } catch (err) {
    console.error('[vpn/config]', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// ── POST /api/vpn/renew ───────────────────────────────────────────────────
// Creates a new Razorpay order for renewal; actual provisioning happens in
// POST /api/payments/verify after successful payment.

router.post('/renew', requireAuth, async (req, res) => {
  const { plan_id } = req.body || {};
  if (!plan_id) return res.status(400).json({ error: 'plan_id is required.' });

  try {
    const { rows } = await pool.query(
      'SELECT id, name, price FROM plans WHERE id = $1',
      [plan_id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Plan not found.' });
    const plan = rows[0];

    const { rows: subRows } = await pool.query(
      `INSERT INTO subscriptions (user_id, plan_id, status) VALUES ($1, $2, 'pending') RETURNING id`,
      [req.user.id, plan.id]
    );
    const subscriptionId = subRows[0].id;

    const order = await razorpay.createOrder(plan.price, `renew_${subscriptionId}_${Date.now()}`);

    await pool.query(
      `INSERT INTO payments (user_id, subscription_id, razorpay_order_id, amount, status)
       VALUES ($1,$2,$3,$4,'created')`,
      [req.user.id, subscriptionId, order.id, order.amount]
    );

    return res.json({
      razorpay_order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      subscription_id: subscriptionId,
      plan_name: plan.name,
    });
  } catch (err) {
    console.error('[vpn/renew]', err.message);
    return res.status(500).json({ error: 'Failed to create renewal order.' });
  }
});

// ── DELETE /api/vpn/revoke ────────────────────────────────────────────────
// Admin-only (checked via ADMIN_SECRET header for simplicity in v1).

router.delete('/revoke', async (req, res) => {
  const adminSecret = req.headers['x-admin-secret'];
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: 'Forbidden.' });
  }

  const { user_id } = req.body || {};
  if (!user_id) return res.status(400).json({ error: 'user_id is required.' });

  try {
    const { rows } = await pool.query(
      `SELECT vc.id, vc.client_uuid, s2.inbound_id
       FROM vpn_clients vc
       JOIN servers s2 ON s2.id = vc.server_id
       WHERE vc.user_id = $1 AND vc.status = 'active'
       ORDER BY vc.id DESC LIMIT 1`,
      [user_id]
    );
    if (!rows.length) return res.status(404).json({ error: 'No active VPN client found.' });

    const { id, client_uuid, inbound_id } = rows[0];

    await vpnSvc.deleteClient(inbound_id, client_uuid);

    await pool.query(
      `UPDATE vpn_clients SET status = 'revoked' WHERE id = $1`,
      [id]
    );

    return res.json({ success: true, message: `Client ${client_uuid} revoked.` });
  } catch (err) {
    console.error('[vpn/revoke]', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// ── POST /api/vpn/reconnect ────────────────────────────────────────────────
// Self-serve fix for when the paid subscription is still active but the
// VPN client was revoked (e.g. manually deleted on the panel). No payment
// required — they already paid for this subscription period.

router.post('/reconnect', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT vc.id AS vpn_client_id, vc.client_uuid, vc.email_tag, vc.status AS client_status,
              s.id AS subscription_id, s.status AS sub_status, s.expires_at,
              p.data_cap_gb, s2.*
       FROM vpn_clients vc
       JOIN subscriptions s ON s.id = vc.subscription_id
       JOIN plans p ON p.id = s.plan_id
       JOIN servers s2 ON s2.id = vc.server_id
       WHERE vc.user_id = $1
       ORDER BY vc.id DESC LIMIT 1`,
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'No subscription found. Purchase a plan first.' });
    }
    const r = rows[0];

    if (r.sub_status !== 'active' || new Date(r.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Your subscription is not currently active. Please purchase or renew a plan.' });
    }

    if (r.client_status === 'active') {
      return res.json({ success: true, message: 'Your VPN is already connected — nothing to fix.' });
    }

    // Client was revoked/missing — create a fresh one for the remainder of the paid period
    const durationDays = Math.max(1, Math.ceil((new Date(r.expires_at) - new Date()) / (24 * 60 * 60 * 1000)));
    const server = r; // server columns spread in via s2.*

    const freshClient = await vpnSvc.addClient(
      server,
      req.user.id,
      req.user.email,
      r.data_cap_gb,
      durationDays,
      req.user.name
    );

    await pool.query(
      `UPDATE vpn_clients
       SET client_uuid = $1, email_tag = $2, subscription_url = $3,
           status = 'active', data_used_bytes = 0
       WHERE id = $4`,
      [freshClient.client_uuid, req.user.email, freshClient.subscription_url, r.vpn_client_id]
    );

    return res.json({ success: true, message: 'VPN reconnected successfully.' });
  } catch (err) {
    console.error('[vpn/reconnect]', err.message);
    return res.status(500).json({ error: 'Failed to reconnect VPN. Please contact support.' });
  }
});

module.exports = router;