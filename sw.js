/* Increment this version when changing the offline application shell. */
const CACHE = 'kallpa-v1';
const ROOT = new URL('./', self.location.href);
const SHELL = [
  './', './index.html', './styles.css', './app.js', './pwa.js',
  './manifest.webmanifest', './assets/logo.png', './assets/muay-thai-mujeres.png',
  './assets/icons/icon-192.png', './assets/icons/icon-512.png',
  './assets/promo_natacion_integral.jpg', './assets/promo_bunker_cross.png',
  './assets/club_nadadores_kallpa.jpg', './assets/promo_atletas_juveniles.jpg',
  './assets/contacto_jesus_maria.png', './assets/flyer_triatlon.jpg',
  './assets/pay_visa.png', './assets/pay_mastercard.png',
  './assets/pay_yape.png', './assets/pay_plin.png'
].map(path => new URL(path, ROOT).href);

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('kallpa-') && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  // Never cache subscriptions, API responses, external resources or private files.
  if (request.method !== 'GET' || url.origin !== ROOT.origin) return;
  const shellUrl = new URL(url.href);
  shellUrl.search = '';
  if (request.mode !== 'navigate' && !SHELL.includes(shellUrl.href)) return;
  if (request.mode === 'navigate' && ![ROOT.pathname, `${ROOT.pathname}index.html`].includes(url.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(request);
      if (response.ok) await cache.put(shellUrl.href, response.clone());
      return response;
    } catch {
      return await cache.match(shellUrl.href) || (request.mode === 'navigate'
        ? await cache.match(new URL('./index.html', ROOT).href) : Response.error());
    }
  })());
});
self.addEventListener('push', event => {
  event.waitUntil((async () => {
    let data = {};
    try { data = event.data?.json() || {}; } catch { /* Display safe defaults. */ }
    let target = new URL('./#promociones', ROOT);
    try {
      const proposed = new URL(data.url || './#promociones', ROOT);
      if (proposed.origin === ROOT.origin && proposed.pathname.startsWith(ROOT.pathname)) target = proposed;
    } catch { /* Keep default. */ }
    await self.registration.showNotification(String(data.title || 'Kallpa & Búnker Cross').slice(0, 100), {
      body: String(data.body || 'Consulta las novedades y promociones disponibles.').slice(0, 240),
      icon: new URL('./assets/icons/icon-192.png', ROOT).href,
      badge: new URL('./assets/icons/badge-96.png', ROOT).href,
      tag: 'kallpa-promociones',
      data: { url: target.href }
    });
  })());
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async () => {
    const target = new URL(event.notification.data?.url || './#promociones', ROOT);
    if (target.origin !== ROOT.origin || !target.pathname.startsWith(ROOT.pathname)) return;
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const existing = windows.find(client => new URL(client.url).pathname.startsWith(ROOT.pathname));
    if (existing) { await existing.navigate(target.href); await existing.focus(); }
    else await self.clients.openWindow(target.href);
  })());
});
