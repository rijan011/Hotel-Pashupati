const CACHE_NAME = 'hotel-pashupati-v2';
const STATIC_ASSETS = [
  './',
  'index.html',
  'about.html',
  'blog.html',
  'contact.html',
  'events.html',
  'gallery.html',
  'location.html',
  'menu.html',
  'owner.html',
  'restaurant.html',
  'reviews.html',
  'rooms.html',
  'style.css',
  'script.js',
  'menu_items.js',
  'testimonials.js',
  'site.webmanifest',
  'Logo.webp',
  'logo_web.webp',
  '1.webp',
  '2.webp',
  '3.webp',
  '4.webp',
  '5.webp',
  '207.webp',
  'Owner.webp',
  'Reception.webp',
  'Hotelpashupati.webp',
  'Surendra Bhattarai.webp',
  'aarohi.webp',
  'Department.webp',
  'Golden.webp',
  'family.webp',
  'nepali.webp',
  'hotel out look.webp',
  'hotel out look 1.webp',
  'temple.webp'
];

// Install Event - Pre-cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-while-revalidate for fast rendering & offline accessibility
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  // Skip cross-origin API requests like Formspree
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin && !url.hostname.includes('fonts.gstatic.com') && !url.hostname.includes('fonts.googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Return cached version on network error
        return cachedResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
