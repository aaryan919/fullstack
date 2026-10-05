// src/test-vpn.js
'use strict';

require('dotenv').config();
const vpnSvc = require('./services/vpn_service');

async function main() {
  console.log('[test] Panel base:', process.env.PANEL_BASE_URL);
  console.log('[test] Logging in to panel directly...');
  try {
    const cookie = await vpnSvc.loginPanel();
    console.log('[test] Login OK - cookie:', cookie ? cookie.slice(0, 30) + '...' : '(none)');
  } catch (loginErr) {
    console.error('[test] LOGIN FAILED');
    console.error('  status:', loginErr.response?.status);
    console.error('  data:', loginErr.response?.data);
    console.error('  message:', loginErr.message);
    process.exit(1);
  }

  console.log('\n[test] Listing inbounds...');
  const inbounds = await vpnSvc.listInbounds();
  console.log('  Found', inbounds.length, 'inbound(s):');
  inbounds.forEach((ib) => {
    console.log('    id=' + ib.id + '  remark="' + ib.remark + '"  protocol=' + ib.protocol + '  port=' + ib.port);
  });

  const configuredId = parseInt(process.env.PANEL_INBOUND_ID || '1', 10);
  const match = inbounds.find((ib) => ib.id === configuredId);
  if (!match) {
    console.error('\nPANEL_INBOUND_ID=' + configuredId + ' does not match any real inbound above.');
    process.exit(1);
  }
  console.log('\n[test] Using inbound id=' + configuredId + ' - OK');

  const fakeServer = { inbound_id: configuredId };

  console.log('\n[test] Adding a test client...');
  const result = await vpnSvc.addClient(fakeServer, 999, 'test_user_999', 10, 30);
  console.log('[test] Client created - OK');
  console.log('  client_uuid:', result.client_uuid);
  console.log('  subscription_url:', result.subscription_url);

  console.log('\n[test] Fetching traffic stats...');
  const stats = await vpnSvc.getClientTraffics('test_user_999', fakeServer.inbound_id);
  console.log('  stats:', stats);

  console.log('\n[test] Testing renewal (updateClient)...');
  await vpnSvc.updateClient(result.client_uuid, 'test_user_999', fakeServer, 20, 60);
  console.log('[test] Client updated - OK');

  console.log('\n[test] Deleting the test client...');
  await vpnSvc.deleteClient(fakeServer.inbound_id, 'test_user_999');
  console.log('[test] Client deleted - OK');

  console.log('\nAll good - panel integration is working end to end.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\nTest failed:', err.response?.data || err.message);
  process.exit(1);
});