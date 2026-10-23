const CACHE_NAME = 'nippon-drive-offline-v5';
const APP_SHELL = ['/', '/index.html', '/app-icon.svg', '/manifest.webmanifest', '/app-icon.svg', '/app-icon.svg', '/app-icon.svg', '/fonts/roboto-latin-400-normal.woff2', '/fonts/roboto-cyrillic-400-normal.woff2', '/fonts/roboto-cyrillic-ext-400-normal.woff2'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    // Precache the production entry bundle and styles during installation. This avoids
    // depending on a second online visit before the app can be opened offline.
    const response = await fetch('/index.html', { cache: 'no-cache' });
    if (!response.ok) throw new Error('Could not fetch app shell for offline precache');
    const html = await response.text();
    const assets = new Set();
    for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
      const asset = match[1];
      if (/\.(?:js|css|svg|woff2?|png|webp|ico)(?:[?#].*)?$/i.test(asset)) {
        const url = new URL(asset, self.location.origin);
        if (url.origin === self.location.origin) assets.add(url.pathname + url.search);
      }
    }
    await Promise.all([...assets].map(async (asset) => {
      try {
        const assetResponse = await fetch(asset);
        if (assetResponse.ok && assetResponse.type === 'basic') {
          await cache.put(asset, assetResponse);
        }
      } catch (error) {
        // A single optional asset should not prevent installation of the app shell.
        console.warn('Offline asset precache skipped:', asset, error);
      }
    }));
    await cache.put('/index.html', new Response(html, { headers: { 'Content-Type': 'text/html' } }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => (key.startsWith('mitsubishi-bro-offline-') || key.startsWith('car-brother-offline-')) && key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put('/index.html', response.clone());
        }
        return response;
      } catch {
        return (await caches.match('/index.html')) || (await caches.match('/'));
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
    } catch {
      return new Response('Offline: this resource has not been cached yet.', {
        status: 503,
        statusText: 'Offline resource unavailable',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  })());
});
