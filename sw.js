const CACHE_NAME = 't2sar-v4-clear';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => 
      Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
    )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request)); // ALWAYS GO TO NETWORK
});