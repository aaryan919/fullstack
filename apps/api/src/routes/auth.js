// src/routes/auth.js
// POST /api/auth/signup
// POST /api/auth/login
// GET  /api/auth/me
'use strict';

const router   = require('express').Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const pool     = require('../db');
const { requireAuth } = require('../middleware/auth');

// ── Helpers ───────────────────────────────────────────────────────────────

function issueTokens(user) {
  const payload = { sub: user.id, email: user.email, name: user.name };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });

  const refreshToken = jwt.sign({ sub: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });

  return { accessToken, refreshToken };
}

// ── POST /api/auth/signup ────────────────────────────────────────────────

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email, and password are required.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  try {
    // Check for existing account
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, is_admin, created_at`,
      [name.trim(), email.toLowerCase().trim(), password_hash]
    );

    const user = rows[0];
    const { accessToken, refreshToken } = issueTokens(user);

    return res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, is_admin: user.is_admin, created_at: user.created_at },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error('[auth/signup]', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// ── POST /api/auth/login ─────────────────────────────────────────────────

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required.' });
  }

  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, password_hash, is_admin FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    const user = rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const { accessToken, refreshToken } = issueTokens(user);

    return res.json({
      user: { id: user.id, name: user.name, email: user.email, is_admin: user.is_admin },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error('[auth/login]', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// ── POST /api/auth/refresh ───────────────────────────────────────────────

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) {
    return res.status(400).json({ error: 'refreshToken is required.' });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const { rows } = await pool.query(
      'SELECT id, name, email FROM users WHERE id = $1',
      [payload.sub]
    );
    if (!rows.length) return res.status(401).json({ error: 'User not found.' });

    const { accessToken, refreshToken: newRefresh } = issueTokens(rows[0]);
    return res.json({ accessToken, refreshToken: newRefresh });
  } catch {
    return res.status(401).json({ error: 'Invalid or expired refresh token.' });
  }
});

// ── GET /api/auth/me ─────────────────────────────────────────────────────

router.get('/me', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, is_admin, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found.' });
    return res.json({ user: rows[0] });
  } catch (err) {
    console.error('[auth/me]', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
