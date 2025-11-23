// Carolina Black Owned - Service Worker
// Version: 1.0.0

const CACHE_NAME = 'cbo-cache-v1';
const STATIC_CACHE = 'cbo-static-v1';
const DYNAMIC_CACHE = 'cbo-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

// API routes to cache
const API_ROUTES = [
  '/api/listings/',
  '/api/homepage/'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[ServiceWorker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests
  if (url.origin !== location.origin) return;

  // API requests - Network first, then cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets - Cache first, then network
  event.respondWith(cacheFirst(request));
});

// Cache-first strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return offline page if available
    return caches.match('/offline.html');
  }
}

// Network-first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return a JSON error response for API calls
    return new Response(
      JSON.stringify({ error: 'Offline', message: 'You are currently offline' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Push notification event
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push received');

  let data = { title: 'Carolina Black Owned', body: 'You have a new notification' };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body || data.message,
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      ...data
    },
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification clicked');
  event.notification.close();

  if (event.action === 'dismiss') return;

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there is already a window open
        for (const client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync', event.tag);

  if (event.tag === 'sync-reviews') {
    event.waitUntil(syncReviews());
  }

  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  }
});

// Sync reviews when online
async function syncReviews() {
  try {
    const pendingReviews = await getPendingData('pendingReviews');
    for (const review of pendingReviews) {
      await fetch('/api/reviews/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      });
    }
    await clearPendingData('pendingReviews');
  } catch (error) {
    console.error('[ServiceWorker] Error syncing reviews:', error);
  }
}

// Sync favorites when online
async function syncFavorites() {
  try {
    const pendingFavorites = await getPendingData('pendingFavorites');
    for (const favorite of pendingFavorites) {
      await fetch('/api/favorites/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(favorite)
      });
    }
    await clearPendingData('pendingFavorites');
  } catch (error) {
    console.error('[ServiceWorker] Error syncing favorites:', error);
  }
}

// IndexedDB helpers for offline data
function getPendingData(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('cbo-offline', 1);
    request.onsuccess = (event) => {
      const db = event.target.result;
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const getAll = store.getAll();
      getAll.onsuccess = () => resolve(getAll.result);
      getAll.onerror = () => reject(getAll.error);
    };
    request.onerror = () => resolve([]);
  });
}

function clearPendingData(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('cbo-offline', 1);
    request.onsuccess = (event) => {
      const db = event.target.result;
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };
  });
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-listings') {
    event.waitUntil(updateListingsCache());
  }
});

async function updateListingsCache() {
  try {
    const response = await fetch('/api/listings/');
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put('/api/listings/', response);
    }
  } catch (error) {
    console.error('[ServiceWorker] Error updating listings cache:', error);
  }
}

console.log('[ServiceWorker] Loaded');
