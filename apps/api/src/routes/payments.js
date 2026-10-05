// src/routes/payments.js
// POST /api/payments/create-order
// POST /api/payments/verify
'use strict';

const router = require('express').Router();
const pool = require('../db');
const razorpay = require('../services/razorpay');
const vpnSvc = require('../services/vpn_service');
const { requireAuth } = require('../middleware/auth');

// ── POST /api/payments/create-order ─────────────────────────────────────

router.post('/create-order', requireAuth, async (req, res) => {
  const { plan_id } = req.body || {};
  if (!plan_id) return res.status(400).json({ error: 'plan_id is required.' });

  try {
    // Block new purchases while an active, unexpired subscription exists
    const { rows: activeRows } = await pool.query(
      `SELECT id, plan_id, expires_at FROM subscriptions
       WHERE user_id = $1 AND status = 'active' AND expires_at > NOW()
       ORDER BY expires_at DESC LIMIT 1`,
      [req.user.id]
    );
    if (activeRows.length > 0) {
      const active = activeRows[0];
      return res.status(409).json({
        error: `You already have an active ${active.plan_id} plan running until ${new Date(active.expires_at).toLocaleDateString()}. Please wait until it expires before purchasing a new plan.`,
      });
    }

    // Fetch plan
    const { rows: planRows } = await pool.query(
      'SELECT id, name, price FROM plans WHERE id = $1',
      [plan_id]
    );
    if (!planRows.length) return res.status(404).json({ error: 'Plan not found.' });
    const plan = planRows[0];

    // Create pending subscription
    const { rows: subRows } = await pool.query(
      `INSERT INTO subscriptions (user_id, plan_id, status)
       VALUES ($1, $2, 'pending') RETURNING id`,
      [req.user.id, plan.id]
    );
    const subscriptionId = subRows[0].id;

    // Create Razorpay order
    const receipt = `sub_${subscriptionId}_${Date.now()}`;
    const order = await razorpay.createOrder(plan.price, receipt);

    // Save payment record
    await pool.query(
      `INSERT INTO payments (user_id, subscription_id, razorpay_order_id, amount, status)
       VALUES ($1, $2, $3, $4, 'created')`,
      [req.user.id, subscriptionId, order.id, order.amount]
    );

    return res.json({
      razorpay_order_id: order.id,
      amount: order.amount,          // paise
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      subscription_id: subscriptionId,        // keep client-side for verify call
      plan_name: plan.name,
    });
  } catch (err) {
    console.error('[payments/create-order]', err.message);
    return res.status(500).json({ error: 'Failed to create payment order.' });
  }
});

// ── POST /api/payments/verify ────────────────────────────────────────────

router.post('/verify', requireAuth, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    subscription_id,
  } = req.body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !subscription_id) {
    return res.status(400).json({ error: 'Missing required payment verification fields.' });
  }

  // ── 1. Verify HMAC signature server-side (critical security step) ──────
  const valid = razorpay.verifySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  if (!valid) {
    console.warn('[payments/verify] INVALID signature for order:', razorpay_order_id);
    return res.status(400).json({ error: 'Payment signature verification failed.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ── 2. Update payment record ──────────────────────────────────────────
    await client.query(
      `UPDATE payments
       SET razorpay_payment_id = $1, status = 'paid'
       WHERE razorpay_order_id = $2`,
      [razorpay_payment_id, razorpay_order_id]
    );

    // ── 3. Fetch subscription + plan details ─────────────────────────────
    const { rows: subRows } = await client.query(
      `SELECT s.id, s.plan_id, p.data_cap_gb, p.cycle, p.devices,
              p.name AS plan_name
       FROM subscriptions s
       JOIN plans p ON p.id = s.plan_id
       WHERE s.id = $1 AND s.user_id = $2`,
      [subscription_id, req.user.id]
    );
    if (!subRows.length) throw new Error('Subscription not found.');
    const sub = subRows[0];

    // Calculate expiry
    const durationDays = sub.cycle === 'yearly' ? 365 : 30;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    // ── 4. Activate subscription (and supersede any other active one) ────
    await client.query(
      `UPDATE subscriptions
       SET status = 'superseded'
       WHERE user_id = $1 AND id != $2 AND status = 'active'`,
      [req.user.id, subscription_id]
    );

    await client.query(
      `UPDATE subscriptions
       SET status = 'active', started_at = NOW(), expires_at = $1
       WHERE id = $2`,
      [expiresAt, subscription_id]
    );

    // ── 5. VPN provisioning (add or update 3X-UI client) ─────────────────
    // Fetch the first server (v1: single server)
    const { rows: srvRows } = await client.query(
      'SELECT * FROM servers ORDER BY id ASC LIMIT 1'
    );
    if (!srvRows.length) throw new Error('No VPN server configured.');
    const server = srvRows[0];

    // Check for existing VPN client for this user
    const { rows: existingClient } = await client.query(
      'SELECT * FROM vpn_clients WHERE user_id = $1 ORDER BY id DESC LIMIT 1',
      [req.user.id]
    );

    let vpnClient;
    if (existingClient.length > 0) {
      // Renewal: try to update the existing client in 3X-UI
      vpnClient = existingClient[0];
      let renewed = true;
      try {
        await vpnSvc.updateClient(
          vpnClient.client_uuid,
          vpnClient.email_tag,
          server,
          sub.data_cap_gb,
          durationDays,
          req.user.name
        );
      } catch (updateErr) {
        // Client no longer exists on the panel (e.g. manually deleted, or
        // panel was reset) — self-heal by creating a fresh one instead.
        console.warn('[payments/verify] updateClient failed, falling back to addClient:', updateErr.message);
        renewed = false;
      }

      if (renewed) {
        await client.query(
          `UPDATE vpn_clients
           SET subscription_id = $1, data_cap_bytes = $2, expires_at = $3,
               status = 'active', data_used_bytes = 0
           WHERE id = $4`,
          [
            subscription_id,
            sub.data_cap_gb ? sub.data_cap_gb * 1024 * 1024 * 1024 : null,
            expiresAt,
            vpnClient.id,
          ]
        );
      } else {
        const emailTag = req.user.email;
        const freshClient = await vpnSvc.addClient(
          server,
          req.user.id,
          emailTag,
          sub.data_cap_gb,
          durationDays,
          req.user.name
        );
        await client.query(
          `UPDATE vpn_clients
           SET subscription_id = $1, client_uuid = $2, email_tag = $3,
               subscription_url = $4, data_cap_bytes = $5, expires_at = $6,
               status = 'active', data_used_bytes = 0
           WHERE id = $7`,
          [
            subscription_id,
            freshClient.client_uuid,
            emailTag,
            freshClient.subscription_url,
            sub.data_cap_gb ? sub.data_cap_gb * 1024 * 1024 * 1024 : null,
            expiresAt,
            vpnClient.id,
          ]
        );
        vpnClient = { ...vpnClient, ...freshClient };
      }
    } else {
      // New user: create fresh 3X-UI client — use the real email so the
      // panel's client list is human-readable, and the name as a comment.
      const emailTag = req.user.email;
      vpnClient = await vpnSvc.addClient(
        server,
        req.user.id,
        emailTag,
        sub.data_cap_gb,
        durationDays,
        req.user.name
      );

      await client.query(
        `INSERT INTO vpn_clients
           (user_id, server_id, subscription_id, client_uuid, email_tag,
            subscription_url, data_cap_bytes, expires_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          req.user.id,
          server.id,
          subscription_id,
          vpnClient.client_uuid,
          emailTag,
          vpnClient.subscription_url,
          sub.data_cap_gb ? sub.data_cap_gb * 1024 * 1024 * 1024 : null,
          expiresAt,
        ]
      );
    }

    await client.query('COMMIT');

    return res.json({
      success: true,
      message: `${sub.plan_name} plan activated.`,
      expires_at: expiresAt,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[payments/verify]', err.message);
    return res.status(500).json({ error: 'Payment verified but provisioning failed. Contact support.' });
  } finally {
    client.release();
  }
});

module.exports = router;