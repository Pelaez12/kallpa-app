import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import { createKallpaServer } from '../server.mjs';
import webpush from 'web-push';

test('push lifecycle, access control, persistence and expired subscriptions', async () => {
  const dataDir = mkdtempSync(join(tmpdir(), 'kallpa-test-'));
  const keys = webpush.generateVAPIDKeys();
  const token = 'test-only-token-'.repeat(4);
  const env = { PUBLIC_ORIGIN: 'https://kallpa.example', VAPID_PUBLIC_KEY: keys.publicKey, VAPID_PRIVATE_KEY: keys.privateKey, VAPID_SUBJECT: 'https://kallpa.example', PUSH_ADMIN_TOKEN: token, PUSH_DATA_DIR: dataDir };
  const delivered = [];
  const sender = async (subscription, payload) => {
    if (subscription.endpoint.endsWith('/expired')) throw { statusCode: 410 };
    delivered.push(JSON.parse(payload));
  };
  let server = createKallpaServer({ env, sendNotification: sender });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let base = `http://127.0.0.1:${server.address().port}`;
  const request = (path, body, admin = false, origin = env.PUBLIC_ORIGIN) => fetch(base + path, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin, ...(admin ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body)
  });
  try {
    assert.equal((await fetch(base + '/.env')).status, 404);
    assert.equal((await fetch(base + '/server.mjs')).status, 404);
    assert.equal((await fetch(base + '/.local/subscriptions.json')).status, 404);
    assert.equal((await fetch(base + '/assets/../.env')).status, 404);
    const config = await (await fetch(base + '/api/push/config')).json();
    assert.equal(config.publicKey, keys.publicKey);
    assert.equal(JSON.stringify(config).includes(keys.privateKey), false);
    const subscription = { endpoint: 'https://fcm.googleapis.com/fcm/send/test', keys: { p256dh: keys.publicKey, auth: 'a'.repeat(22) } };
    assert.equal((await request('/api/push/subscribe', subscription, false, 'https://other.example')).status, 403);
    assert.equal((await request('/api/push/subscribe', { ...subscription, endpoint: 'https://127.0.0.1/private' })).status, 400);
    assert.equal((await request('/api/push/subscribe', subscription)).status, 200);
    assert.equal((await request('/api/push/subscribe', subscription)).status, 200);
    await request('/api/push/subscribe', { ...subscription, endpoint: 'https://fcm.googleapis.com/fcm/send/expired' });
    const promo = { title: 'Muay Thai para mujeres', body: '8 clases S/ 160. Martes y jueves de 7 a 8 p. m.', url: '/#muay-thai' };
    assert.equal((await request('/api/push/send', promo)).status, 401);
    assert.equal((await request('/api/push/send', { ...promo, url: 'https://other.example' }, true)).status, 400);
    assert.deepEqual(await (await request('/api/push/send', promo, true)).json(), { sent: 1, removed: 1, failed: 0 });
    assert.equal(delivered[0].url, 'https://kallpa.example/#muay-thai');
    server.close(); await once(server, 'close');
    server = createKallpaServer({ env, sendNotification: sender });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    base = `http://127.0.0.1:${server.address().port}`;
    assert.equal((await (await request('/api/push/send', promo, true)).json()).sent, 1);
    assert.equal((await request('/api/push/unsubscribe', { endpoint: subscription.endpoint })).status, 200);
    assert.equal((await (await request('/api/push/send', promo, true)).json()).sent, 0);
  } finally {
    server.close(); await once(server, 'close');
    rmSync(dataDir, { recursive: true, force: true });
  }
});

test('unconfigured static deployment does not pretend push is active', async () => {
  const dataDir = mkdtempSync(join(tmpdir(), 'kallpa-test-'));
  const server = createKallpaServer({ env: { PUSH_DATA_DIR: dataDir } });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    assert.deepEqual(await (await fetch(base + '/api/push/config')).json(), { enabled: false, publicKey: null });
    assert.equal((await fetch(base + '/api/push/subscribe', { method: 'POST' })).status, 503);
    assert.match((await fetch(base + '/manifest.webmanifest')).headers.get('content-type'), /manifest/);
  } finally {
    server.close(); await once(server, 'close');
    rmSync(dataDir, { recursive: true, force: true });
  }
});
