// Оболочка отдаётся из кэша сразу (работает без сети), свежая версия подтягивается в фоне к следующему запуску.
const C = 'zal-v2';
const SHELL = ['./', 'manifest.webmanifest', 'icon-180.png', 'icon-512.png', 'fonts/sofia-cyr.woff2', 'fonts/sofia-lat.woff2', 'fonts/golos-cyr.woff2', 'fonts/golos-lat.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(C).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
