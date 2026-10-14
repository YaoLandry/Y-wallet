/* Moneyluck – service worker : app 100 % hors ligne.
   Change CACHE_VERSION à chaque mise à jour pour forcer le rafraîchissement. */
const CACHE_VERSION = 'v1.0.0';
const CACHE = 'moneyluck-' + CACHE_VERSION;
const SHELL = [
  './', './index.html', './manifest.json', './offline.html',
  './icon-192.png', './icon-512.png', './maskable-192.png', './maskable-512.png',
  './monochrome-512.png', './apple-touch-icon.png', './favicon-32.png', './favicon-16.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('moneyluck-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  // Pages : réseau d'abord (toujours la dernière version), repli sur le cache
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return res; })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./offline.html')))
    );
    return;
  }
  // Fichiers statiques : cache d'abord, puis réseau (et mise en cache)
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }))
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) if ('focus' in c) return c.focus();
    return self.clients.openWindow('./');
  }));
});
