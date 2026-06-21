const CACHE_NAME = 'adopsi-hewan-v3'

self.addEventListener('install', (event) => {
  // Segera aktifkan service worker baru tanpa menunggu tab ditutup
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  // Segera hapus semua cache lama dari versi sebelumnya
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName)
        })
      )
    }).then(() => {
      // Ambil alih kontrol halaman klien secara langsung
      return self.clients.claim()
    })
  )
})

self.addEventListener('fetch', (event) => {
  // NETWORK FIRST STRATEGY
  // Selalu minta data terbaru dari server (Vercel) terlebih dahulu
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Jika berhasil, simpan ke cache sebagai cadangan offline
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic' && event.request.url.startsWith('http')) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Jika gagal (sedang offline), baru gunakan cache
        return caches.match(event.request);
      })
  )
})
