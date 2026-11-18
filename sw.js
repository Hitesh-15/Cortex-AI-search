/**
 * Cortex PWA Service Worker (v7.0.0)
 * - Network-first for HTML/JS/CSS so GitHub Pages updates appear immediately when online
 * - Cache-first for static brand icons and manifest
 * - Strict bypass for all live search, market telemetry, and Firebase API requests
 */
const CACHE_NAME = 'cortex-pwa-v7.0.0';
const APP_SHELL = [
    './',
    './index.html',
    './manifest.json',
    './favicon.svg',
    './favicon-32x32.png',
    './android-chrome-192x192.png',
    './android-chrome-512x512.png',
    './apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL).catch(() => {}))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;

    const url = new URL(req.url);

    // Never intercept external APIs, CDNs, Firebase, or live telemetry endpoints
    if (url.origin !== self.location.origin) {
        return;
    }

    // Cache-first for immutable icons/images
    if (/\.(?:png|svg|ico|webp)$/i.test(url.pathname)) {
        event.respondWith(
            caches.match(req).then((cached) => {
                if (cached) return cached;
                return fetch(req).then((res) => {
                    if (res && res.ok) {
                        const copy = res.clone();
                        caches.open(CACHE_NAME).then((c) => c.put(req, copy));
                    }
                    return res;
                });
            })
        );
        return;
    }

    // Network-first for HTML, JS, CSS, JSON (always fresh when online, offline fallback)
    event.respondWith(
        fetch(req)
            .then((res) => {
                if (res && res.ok) {
                    const copy = res.clone();
                    caches.open(CACHE_NAME).then((c) => c.put(req, copy));
                }
                return res;
            })
            .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
    );
});
