const CACHE_NAME = 'aero-v1';
const urlsToCache = [
  '/',
  '/welcome',
  '/site.webmanifest',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/icon-72x72.png',
  '/icon-96x96.png',
  '/icon-128x128.png',
  '/icon-144x144.png',
  '/icon-152x152.png',
  '/icon-384x384.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Service Worker install failed:', error);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Network request with error handling
        return fetch(event.request).catch(() => {
          // Return cached version if network fails
          return caches.match('/welcome');
        });
      })
      .catch(error => {
        console.error('Service Worker fetch failed:', error);
      })
  );
});
