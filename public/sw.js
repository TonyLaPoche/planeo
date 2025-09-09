// Service Worker basique pour le développement
const CACHE_NAME = 'planno-cache-v1';
const STATIC_CACHE_URLS = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/og-image.png'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installation');
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Mise en cache des ressources statiques');
        return cache.addAll(STATIC_CACHE_URLS);
      })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activation');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  // Pour les requêtes de navigation, essayer le réseau d'abord
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/');
        })
    );
    return;
  }

  // Pour les autres ressources, stratégie cache-first
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});