// src/middleware/auth.js
// JWT authentication middleware.
// Attach to any route that requires a logged-in user.
'use strict';

const jwt = require('jsonwebtoken');
const pool = require('../db');

/**
 * Verifies the Bearer token in the Authorization header.
 * On success: attaches req.user = { id, email, name, is_admin }
 * On failure: returns 401
 */
async function requireAuth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { rows } = await pool.query(
      'SELECT id, name, email, is_admin FROM users WHERE id = $1',
      [payload.sub]
    );
    if (rows.length === 0) throw new Error('User not found');
    req.user = rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

/**
 * Optional auth — attaches req.user if token present and valid,
 * but never blocks the request. Useful for public routes that
 * personalise content when logged in.
 */
async function optionalAuth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const { rows } = await pool.query(
        'SELECT id, name, email, is_admin FROM users WHERE id = $1',
        [payload.sub]
      );
      if (rows.length > 0) req.user = rows[0];
    } catch {
      // silently ignore invalid token for optional auth
    }
  }
  next();
}

module.exports = {
  requireAuth,
  optionalAuth,
  requireAdmin: [
    requireAuth,
    (req, res, next) => {
      if (!req.user.is_admin) {
        return res.status(403).json({ error: 'Forbidden: Admin access required.' });
      }
      next();
    }
  ]
};
