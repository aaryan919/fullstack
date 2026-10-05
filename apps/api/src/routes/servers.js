// src/routes/servers.js
// GET /api/servers  — public endpoint, feeds ServersPage + DashboardPage
'use strict';

const router = require('express').Router();
const pool   = require('../db');

router.get('/', async (_req, res) => {
  try {
    // Only expose non-sensitive fields; never return panel creds or IP to frontend
    const { rows } = await pool.query(
      `SELECT id, country, city, flag, ping_ms AS ping, current_load_pct AS load
       FROM servers
       ORDER BY ping_ms ASC`
    );
    return res.json(rows);
  } catch (err) {
    console.error('[servers]', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
