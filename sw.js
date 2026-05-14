// Service Worker para Progressive Web App
const CACHE_NAME = 'creative-studio-v1';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.webmanifest'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache).catch(() => {
                console.log('No todas las URLs pudieron ser cacheadas');
                return cache.addAll(urlsToCache.slice(0, 2));
            });
        })
    );
    self.skipWaiting();
});

// Activate event
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
    self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => {
                if (event.request.destination === 'document') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});

// Push notifications
self.addEventListener('push', event => {
    const options = {
        body: '¡Nuevo contenido disponible en Creative Studio!',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%239c27b0" width="192" height="192"/><circle cx="96" cy="96" r="60" fill="%2300e5ff"/></svg>',
        badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><circle cx="96" cy="96" r="96" fill="%239c27b0"/></svg>'
    };

    event.waitUntil(
        self.registration.showNotification('Creative Studio', options)
    );
});
