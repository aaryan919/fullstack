// src/index.js
// ProjectVPN API — Express application entry point.
'use strict';

require('dotenv').config();

const express     = require('express');
const helmet      = require('helmet');
const cors        = require('cors');
const rateLimit   = require('express-rate-limit');

const authRouter     = require('./routes/auth');
const plansRouter    = require('./routes/plans');
const serversRouter  = require('./routes/servers');
const paymentsRouter = require('./routes/payments');
const vpnRouter      = require('./routes/vpn');
const accountRouter  = require('./routes/account');
const adminRouter    = require('./routes/admin');
const { startSyncJob } = require('./jobs/syncUsage');

const app  = express();
const PORT = process.env.PORT || 8443;

// ── Security headers ─────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ─────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',  // Vite dev server
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, mobile apps, Razorpay callbacks)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

// ── Body parsing ─────────────────────────────────────────────────────────
app.use(express.json());

// ── Rate limiting ─────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // 20 attempts per window per IP
  message: { error: 'Too many requests. Please wait and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: { error: 'Too many requests.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', authLimiter);
app.use('/api', generalLimiter);

// ── Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',     authRouter);
app.use('/api/plans',    plansRouter);
app.use('/api/servers',  serversRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/vpn',      vpnRouter);
app.use('/api/account',  accountRouter);
app.use('/api/admin',    adminRouter);

// ── Health check ──────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// ── 404 handler ───────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Not found.' }));

// ── Global error handler ──────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[unhandled]', err.message);
  res.status(500).json({ error: 'Internal server error.' });
});

// ── Start ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[api] ProjectVPN API listening on port ${PORT}`);
  console.log(`[api] Environment: ${process.env.NODE_ENV || 'development'}`);

  // Start usage sync job (polls 3X-UI every 15 min)
  // Skips gracefully if panel is not yet configured
  if (process.env.PANEL_BASE_URL && process.env.PANEL_PASSWORD !== 'changeme') {
    startSyncJob();
  } else {
    console.warn('[api] VPN panel not configured — usage sync disabled. Set PANEL_* env vars.');
  }
});

module.exports = app;
