// src/jobs/syncUsage.js
// Periodic usage sync: polls 3X-UI for each active VPN client,
// mirrors data_used_bytes + status back to Postgres, and records
// a minimal usage_logs entry (delta + last_online) per client —
// deliberately excludes destination URLs, DNS queries, or content.
'use strict';

const cron = require('node-cron');
const pool = require('../db');
const vpnSvc = require('../services/vpn_service');

const INTERVAL = process.env.SYNC_INTERVAL_MINUTES || '15';

async function syncUsage() {
  const start = Date.now();
  console.log('[syncUsage] Starting usage sync...');

  let synced = 0;
  let errors = 0;

  try {
    const { rows: clients } = await pool.query(
      `SELECT vc.id, vc.user_id, vc.email_tag, vc.data_cap_bytes,
              vc.expires_at, vc.status, vc.data_used_bytes,
              s.inbound_id
       FROM vpn_clients vc
       JOIN servers s ON s.id = vc.server_id
       WHERE vc.status IN ('active', 'data_exceeded')
       ORDER BY vc.id ASC`
    );

    for (const client of clients) {
      try {
        const traffic = await vpnSvc.getClientTraffics(client.email_tag, client.inbound_id);

        if (!traffic.found) {
          // Client was deleted directly on the panel (manually, or the panel
          // was reset) — reflect that truthfully instead of reporting stale
          // "active" status with silently-zero usage.
          await pool.query(
            `UPDATE vpn_clients SET status = 'revoked' WHERE id = $1`,
            [client.id]
          );
          console.warn(`[syncUsage] Client ${client.email_tag} not found on panel — marked revoked.`);
          synced++;
          continue;
        }

        const totalBytes = traffic.up + traffic.down;
        const prevTotal = client.data_used_bytes || 0;
        const deltaBytes = Math.max(0, totalBytes - prevTotal);

        let newStatus = client.status;
        const now = new Date();

        if (client.expires_at && new Date(client.expires_at) < now) {
          newStatus = 'expired';
        } else if (client.data_cap_bytes && totalBytes >= client.data_cap_bytes) {
          newStatus = 'data_exceeded';
        } else if (traffic.enable) {
          newStatus = 'active';
        }

        await pool.query(
          `UPDATE vpn_clients
           SET data_used_bytes = $1, status = $2
           WHERE id = $3`,
          [totalBytes, newStatus, client.id]
        );

        // Minimal metadata log — only when there's real activity to record
        if (deltaBytes > 0 || traffic.enable) {
          await pool.query(
            `INSERT INTO usage_logs
               (vpn_client_id, user_id, up_bytes_delta, down_bytes_delta,
                total_up_bytes, total_down_bytes, last_online)
             VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
            [client.id, client.user_id, deltaBytes, 0, traffic.up, traffic.down]
          );
        }

        synced++;
      } catch (clientErr) {
        console.error(`[syncUsage] Error syncing client ${client.email_tag}:`, clientErr.message);
        errors++;
      }
    }
  } catch (err) {
    console.error('[syncUsage] Fatal error:', err.message);
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`[syncUsage] Done — synced ${synced}, errors ${errors}, took ${elapsed}s`);
}

function startSyncJob() {
  console.log(`[syncUsage] Usage sync scheduled every ${INTERVAL} minutes.`);
  syncUsage().catch(console.error);
  cron.schedule(`*/${INTERVAL} * * * *`, () => {
    syncUsage().catch(console.error);
  });
}

module.exports = { startSyncJob, syncUsage };