
'use strict';
const cacheName = 'mi-control-docente-' + self.registration.scope + '-G275';
const assets = ['./offline.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
const fallback = new URL('./offline.html', self.registration.scope).href;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assets)));
});
self.addEventListener('activate', event => {
  const prefix = 'mi-control-docente-' + self.registration.scope + '-';
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(prefix) && name !== cacheName).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.mode !== 'navigate') return;
  const url = new URL(request.url);
  const scope = new URL(self.registration.scope);
  if (url.origin !== scope.origin || (url.pathname !== scope.pathname && url.pathname !== scope.pathname + 'index.html')) return;
  event.respondWith(fetch(request).catch(() => caches.open(cacheName).then(cache => cache.match(fallback))));
});
