-- ============================================================
-- ProjectVPN — PostgreSQL Schema
-- Run this once against your database:
--   psql $DATABASE_URL -f src/schema.sql
-- ============================================================

-- Users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Plans (maps 1:1 to frontend mock.js `plans` array)
CREATE TABLE IF NOT EXISTS plans (
  id          VARCHAR(20) PRIMARY KEY,         -- 'leaf' | 'grove' | 'canopy'
  name        VARCHAR(50)  NOT NULL,
  price       INT          NOT NULL,           -- INR
  cycle       VARCHAR(10)  NOT NULL,           -- 'monthly' | 'yearly'
  devices     INT          NOT NULL,
  data_cap_gb INT,                             -- NULL = unlimited (Canopy)
  description TEXT,
  features    JSONB,
  popular     BOOLEAN DEFAULT FALSE
);

-- VPN servers (single row for v1; extend for multi-region later)
CREATE TABLE IF NOT EXISTS servers (
  id                  SERIAL PRIMARY KEY,
  country             VARCHAR(50),
  city                VARCHAR(50),
  flag                VARCHAR(5),
  ip_address          VARCHAR(45) NOT NULL,
  panel_url           VARCHAR(255) NOT NULL,      -- 3X-UI panel base URL
  panel_username      VARCHAR(100) NOT NULL,
  panel_password_enc  TEXT NOT NULL,              -- encrypted at rest
  inbound_id          INT NOT NULL,               -- 3X-UI inbound ID for VLESS+REALITY
  reality_public_key  TEXT,
  reality_short_id    VARCHAR(20),
  reality_sni         VARCHAR(100),
  ping_ms             INT DEFAULT 0,
  current_load_pct    INT DEFAULT 0
);

-- Subscriptions (a user's purchase of a plan)
CREATE TABLE IF NOT EXISTS subscriptions (
  id          SERIAL PRIMARY KEY,
  user_id     INT REFERENCES users(id) ON DELETE CASCADE,
  plan_id     VARCHAR(20) REFERENCES plans(id),
  status      VARCHAR(20) DEFAULT 'pending',     -- pending | active | expired | cancelled
  started_at  TIMESTAMP,
  expires_at  TIMESTAMP,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Payments (Razorpay transaction log)
CREATE TABLE IF NOT EXISTS payments (
  id                  SERIAL PRIMARY KEY,
  user_id             INT REFERENCES users(id) ON DELETE CASCADE,
  subscription_id     INT REFERENCES subscriptions(id),
  razorpay_order_id   VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  amount              INT,                        -- paise (INR × 100)
  status              VARCHAR(20),               -- created | paid | failed
  created_at          TIMESTAMP DEFAULT NOW()
);

-- VPN clients (the actual Xray / 3X-UI identity per user)
CREATE TABLE IF NOT EXISTS vpn_clients (
  id                SERIAL PRIMARY KEY,
  user_id           INT REFERENCES users(id) ON DELETE CASCADE,
  server_id         INT REFERENCES servers(id),
  subscription_id   INT REFERENCES subscriptions(id),
  client_uuid       VARCHAR(36) NOT NULL,
  email_tag         VARCHAR(100) NOT NULL,        -- e.g. 'user_42' — links to 3X-UI stats
  subscription_url  TEXT,                         -- vless:// link / 3X-UI sub link
  data_used_bytes   BIGINT DEFAULT 0,
  data_cap_bytes    BIGINT,                       -- NULL = unlimited
  status            VARCHAR(20) DEFAULT 'active', -- active | data_exceeded | expired | revoked
  expires_at        TIMESTAMP,
  created_at        TIMESTAMP DEFAULT NOW()
);

-- Minimal connection metadata: who was active, when, how much data —
-- deliberately excludes destination URLs, DNS queries, or packet content.
CREATE TABLE IF NOT EXISTS usage_logs (
  id              SERIAL PRIMARY KEY,
  vpn_client_id   INT REFERENCES vpn_clients(id) ON DELETE CASCADE,
  user_id         INT REFERENCES users(id) ON DELETE CASCADE,
  recorded_at     TIMESTAMP DEFAULT NOW(),
  up_bytes_delta  BIGINT DEFAULT 0,
  down_bytes_delta BIGINT DEFAULT 0,
  total_up_bytes  BIGINT DEFAULT 0,
  total_down_bytes BIGINT DEFAULT 0,
  last_online     TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_time ON usage_logs (user_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_usage_logs_client_time ON usage_logs (vpn_client_id, recorded_at);
-- Devices (optional, for device-limit tracking per plan)
CREATE TABLE IF NOT EXISTS devices (
  id                  SERIAL PRIMARY KEY,
  vpn_client_id       INT REFERENCES vpn_clients(id) ON DELETE CASCADE,
  device_name         VARCHAR(100),
  last_connected_at   TIMESTAMP
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status  ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_vpn_clients_user_id   ON vpn_clients(user_id);
CREATE INDEX IF NOT EXISTS idx_vpn_clients_status    ON vpn_clients(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id      ON payments(user_id);
