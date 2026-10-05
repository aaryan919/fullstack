// src/routes/plans.js
// GET /api/plans  — public endpoint, feeds HomePage pricing section
'use strict';

const router = require('express').Router();
const pool   = require('../db');

router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, price, cycle, devices, data_cap_gb AS data,
              description, features, popular
       FROM plans
       ORDER BY price ASC`
    );

    // Normalise data: data_cap_gb=null → 0 (matches mock.js Canopy "unlimited" convention)
    const plans = rows.map((p) => ({
      ...p,
      data: p.data ?? 0,
      features: Array.isArray(p.features) ? p.features : JSON.parse(p.features || '[]'),
    }));

    return res.json(plans);
  } catch (err) {
    console.error('[plans]', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
