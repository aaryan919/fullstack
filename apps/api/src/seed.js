// src/seed.js
// Seed the database with initial plans and a placeholder server row.
// Run: node src/seed.js
'use strict';

require('dotenv').config();
const pool = require('./db');

// ── Plans — matches mock.js exactly so the frontend swap is a drop-in ──
const plans = [
  {
    id: 'leaf',
    name: 'Leaf',
    price: 69,
    cycle: 'monthly',
    devices: 2,
    data_cap_gb: 10,
    description: 'Casual browsing with airtight privacy on the go.',
    features: JSON.stringify(['2 devices', '10 GB / month', 'Bangalore server', 'No-logs policy']),
    popular: false,
  },
  {
    id: 'grove',
    name: 'Grove',
    price: 149,
    cycle: 'monthly',
    devices: 5,
    data_cap_gb: 100,
    description: 'For households and remote workers who need more headroom.',
    features: JSON.stringify(['5 devices', '100 GB / month', 'Bangalore server', 'Split tunneling', 'Priority routing']),
    popular: true,
  },
  {
    id: 'canopy',
    name: 'Canopy',
    price: 1490,
    cycle: 'yearly',
    devices: 10,
    data_cap_gb: null, // unlimited
    description: 'Unlimited bandwidth across every device you own.',
    features: JSON.stringify(['10 devices', 'Unlimited data', 'Bangalore server', 'Dedicated IP option', 'Priority support']),
    popular: false,
  },
];

// ── Server — fill in real values after VPS setup (see docs/vps-setup.md) ──
const servers = [
  {
    country: 'India',
    city: 'Bangalore',
    flag: 'IN',
    ip_address: '0.0.0.0',              // replace with droplet IP
    panel_url: 'http://0.0.0.0:2087',   // replace with actual panel URL
    panel_username: 'admin',             // replace with real credentials
    panel_password_enc: 'changeme',      // replace with actual password
    inbound_id: 1,                       // replace with 3X-UI inbound ID
    reality_public_key: '',              // replace after REALITY setup
    reality_short_id: '',
    reality_sni: 'www.microsoft.com',
    ping_ms: 12,
    current_load_pct: 0,
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Plans
    for (const plan of plans) {
      await client.query(
        `INSERT INTO plans (id, name, price, cycle, devices, data_cap_gb, description, features, popular)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (id) DO UPDATE SET
           name=$2, price=$3, cycle=$4, devices=$5,
           data_cap_gb=$6, description=$7, features=$8, popular=$9`,
        [plan.id, plan.name, plan.price, plan.cycle, plan.devices, plan.data_cap_gb,
         plan.description, plan.features, plan.popular]
      );
    }
    console.log('[seed] Plans upserted ✓');

    // Servers — only insert if none exist yet
    const { rows } = await client.query('SELECT COUNT(*) FROM servers');
    if (parseInt(rows[0].count) === 0) {
      for (const srv of servers) {
        await client.query(
          `INSERT INTO servers
             (country, city, flag, ip_address, panel_url, panel_username,
              panel_password_enc, inbound_id, reality_public_key,
              reality_short_id, reality_sni, ping_ms, current_load_pct)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
          [srv.country, srv.city, srv.flag, srv.ip_address, srv.panel_url,
           srv.panel_username, srv.panel_password_enc, srv.inbound_id,
           srv.reality_public_key, srv.reality_short_id, srv.reality_sni,
           srv.ping_ms, srv.current_load_pct]
        );
      }
      console.log('[seed] Server row inserted ✓');
    } else {
      console.log('[seed] Servers already present, skipping ✓');
    }

    await client.query('COMMIT');
    console.log('[seed] Done.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[seed] Error:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
