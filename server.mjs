import http from 'node:http';
import { readFileSync, writeFileSync, renameSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { timingSafeEqual } from 'node:crypto';
import webpush from 'web-push';

const ROOT = fileURLToPath(new URL('./', import.meta.url));
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webmanifest': 'application/manifest+json', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain' };
const PUBLIC_FILES = new Set(['index.html', 'styles.css', 'app.js', 'pwa.js', 'sw.js', 'manifest.webmanifest', 'sitemap.html', 'sitemap.xml', 'robots.txt', 'google782eddfc18437c54.html']);
const PUSH_HOSTS = ['fcm.googleapis.com', 'updates.push.services.mozilla.com', 'web.push.apple.com', 'notify.windows.com'];
function validEndpoint(value) {
  try {
    const url = new URL(value);
    return typeof value === 'string' && value.length < 4096 && url.protocol === 'https:' && !url.port && !url.username && !url.password && PUSH_HOSTS.some(host => url.hostname === host || url.hostname.endsWith(`.${host}`));
  } catch { return false; }
}
function validSubscription(value) {
  return validEndpoint(value?.endpoint) && /^[A-Za-z0-9_-]{87}$/.test(value?.keys?.p256dh || '') && /^[A-Za-z0-9_-]{22}$/.test(value?.keys?.auth || '');
}
async function jsonBody(request) {
  if (!request.headers['content-type']?.startsWith('application/json')) throw { status: 415 };
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (Buffer.byteLength(body) > 8192) throw { status: 413 };
  }
  try { return JSON.parse(body); } catch { throw { status: 400 }; }
}
function authorized(request, secret) {
  if (!secret || secret.length < 32) return false;
  const actual = Buffer.from(request.headers.authorization || '');
  const expected = Buffer.from(`Bearer ${secret}`);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// One Node process with a persistent volume. Subscriptions never enter the public tree.
export function createKallpaServer({ env = process.env, sendNotification = webpush.sendNotification.bind(webpush) } = {}) {
  const origin = env.PUBLIC_ORIGIN || 'http://localhost:4173';
  const publicKey = env.VAPID_PUBLIC_KEY;
  const enabled = !!(publicKey && env.VAPID_PRIVATE_KEY && env.VAPID_SUBJECT && env.PUSH_ADMIN_TOKEN?.length >= 32);
  const directory = resolve(env.PUSH_DATA_DIR || resolve(ROOT, '.local'));
  const storeFile = resolve(directory, 'subscriptions.json');
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const subscriptions = new Map();
  if (existsSync(storeFile)) {
    // A malformed store fails startup instead of silently losing subscribers.
    for (const item of JSON.parse(readFileSync(storeFile, 'utf8'))) {
      if (validSubscription(item)) subscriptions.set(item.endpoint, item);
    }
  }
  function persist() {
    writeFileSync(`${storeFile}.tmp`, JSON.stringify([...subscriptions.values()]), { mode: 0o600 });
    renameSync(`${storeFile}.tmp`, storeFile);
  }
  const rates = new Map();
  const server = http.createServer(async (request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.setHeader('X-Frame-Options', 'DENY');
    const json = (status, data) => {
      response.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      response.end(JSON.stringify(data));
    };
    try {
      const url = new URL(request.url, origin);
      if (url.pathname.startsWith('/api/')) {
        const minute = Math.floor(Date.now() / 60000);
        for (const [key, value] of rates) if (value.minute !== minute) rates.delete(key);
        const ip = request.socket.remoteAddress;
        const rate = rates.get(ip) || { minute, count: 0 };
        rate.count++;
        rates.set(ip, rate);
        if (rate.count > 120 || rates.size > 10000) return json(429, { error: 'Inténtalo más tarde.' });
        if (request.method === 'GET' && url.pathname === '/api/push/config') return json(200, { enabled, publicKey: enabled ? publicKey : null });
        if (!enabled) return json(503, { error: 'Notificaciones sin configurar.' });
        if (request.method !== 'POST') return json(405, { error: 'Método no permitido.' });
        if (url.pathname === '/api/push/send') {
          if (!authorized(request, env.PUSH_ADMIN_TOKEN)) return json(401, { error: 'No autorizado.' });
          const body = await jsonBody(request);
          if (typeof body.title !== 'string' || !body.title.trim() || body.title.length > 100 || typeof body.body !== 'string' || !body.body.trim() || body.body.length > 240) return json(400, { error: 'Título y mensaje inválidos.' });
          const target = new URL(body.url || '/#promociones', origin);
          if (target.origin !== origin || !['/', '/index.html'].includes(target.pathname)) return json(400, { error: 'Enlace inválido.' });
          const payload = JSON.stringify({ title: body.title, body: body.body, url: target.href });
          const items = [...subscriptions.values()];
          let sent = 0, removed = 0, failed = 0;
          // Bounded concurrency prevents a campaign from exhausting connections.
          for (let i = 0; i < items.length; i += 10) {
            await Promise.all(items.slice(i, i + 10).map(async subscription => {
              try {
                await sendNotification(subscription, payload, {
                  TTL: 86400, timeout: 10000,
                  vapidDetails: { subject: env.VAPID_SUBJECT, publicKey, privateKey: env.VAPID_PRIVATE_KEY }
                });
                sent++;
              } catch (error) {
                if ([404, 410].includes(error.statusCode)) {
                  subscriptions.delete(subscription.endpoint);
                  removed++;
                } else failed++;
              }
            }));
          }
          if (removed) persist();
          return json(200, { sent, removed, failed });
        }
        if (request.headers.origin !== origin) return json(403, { error: 'Origen no permitido.' });
        const body = await jsonBody(request);
        if (url.pathname === '/api/push/subscribe') {
          if (!validSubscription(body)) return json(400, { error: 'Suscripción inválida.' });
          if (!subscriptions.has(body.endpoint) && subscriptions.size >= 5000) return json(503, { error: 'Capacidad de suscripciones alcanzada.' });
          subscriptions.set(body.endpoint, { endpoint: body.endpoint, keys: { auth: body.keys.auth, p256dh: body.keys.p256dh } });
          persist();
          return json(200, { ok: true });
        }
        if (url.pathname === '/api/push/unsubscribe') {
          if (!validEndpoint(body.endpoint)) return json(400, { error: 'Suscripción inválida.' });
          subscriptions.delete(body.endpoint);
          persist();
          return json(200, { ok: true });
        }
        return json(404, { error: 'No encontrado.' });
      }
      if (!['GET', 'HEAD'].includes(request.method)) return json(405, { error: 'Método no permitido.' });
      const path = decodeURIComponent(url.pathname).replace(/^\//, '') || 'index.html';
      const isAsset = /^assets\/[a-zA-Z0-9_./-]+\.(png|jpg|jpeg|svg|webp)$/.test(path) && !path.split('/').some(part => part.startsWith('.'));
      if (!PUBLIC_FILES.has(path) && !isAsset) return json(404, { error: 'No encontrado.' });
      const file = resolve(ROOT, path);
      let bytes;
      try { bytes = readFileSync(file); } catch { return json(404, { error: 'No encontrado.' }); }
      response.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Cache-Control': path.startsWith('assets/') ? 'public, max-age=3600' : 'no-cache' });
      response.end(request.method === 'HEAD' ? undefined : bytes);
    } catch (error) {
      json(error.status || 500, { error: 'No se pudo procesar la solicitud.' });
    }
  });
  server.requestTimeout = 15000;
  return server;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4173);
  createKallpaServer().listen(port, process.env.HOST || '127.0.0.1', () => {
    console.log(`Kallpa disponible en http://localhost:${port}`);
  });
}
