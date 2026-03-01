const CACHE_NAME = 'calcbox-v4';
const BASE_PATH = '/calcbox/';

const PRECACHE_URLS = [
  BASE_PATH,
  BASE_PATH + 'css/style.css',
  BASE_PATH + 'js/common.js',
  BASE_PATH + 'currency/',
  BASE_PATH + 'js/currency.min.js',
  BASE_PATH + 'encode/',
  BASE_PATH + 'js/encode.min.js',
  BASE_PATH + 'regex/',
  BASE_PATH + 'js/regex.min.js',
  BASE_PATH + 'ip-calc/',
  BASE_PATH + 'js/ip-calc.min.js',
  BASE_PATH + 'probability/',
  BASE_PATH + 'js/probability.min.js',
  BASE_PATH + 'gradient/',
  BASE_PATH + 'js/gradient.min.js',
  BASE_PATH + 'markdown/',
  BASE_PATH + 'js/markdown.min.js',
  BASE_PATH + 'diff/',
  BASE_PATH + 'js/diff.min.js',
  BASE_PATH + 'loan-compare/',
  BASE_PATH + 'js/loan-compare.min.js',
  BASE_PATH + 'nutrition/',
  BASE_PATH + 'js/nutrition.min.js',
  BASE_PATH + 'uuid/',
  BASE_PATH + 'js/uuid.min.js',
  BASE_PATH + 'timestamp/',
  BASE_PATH + 'js/timestamp.min.js',
  BASE_PATH + 'jwt/',
  BASE_PATH + 'js/jwt.min.js',
  BASE_PATH + 'cron/',
  BASE_PATH + 'js/cron.min.js',
  BASE_PATH + 'chmod/',
  BASE_PATH + 'js/chmod.min.js',
  BASE_PATH + 'csv-json/',
  BASE_PATH + 'js/csv-json.min.js',
  BASE_PATH + 'sql-formatter/',
  BASE_PATH + 'js/sql-formatter.min.js',
  BASE_PATH + 'byte-converter/',
  BASE_PATH + 'js/byte-converter.min.js',
  BASE_PATH + 'http-status/',
  BASE_PATH + 'js/http-status.min.js',
  BASE_PATH + 'lorem/',
  BASE_PATH + 'js/lorem.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET requests and external resources
  if (event.request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  // CSS and JS: cache-first
  if (url.pathname.match(/\.(css|js)$/)) {
    event.respondWith(
      caches.match(event.request).then(cached =>
        cached || fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
      )
    );
    return;
  }

  // HTML: network-first
  if (event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => caches.match(event.request))
    );
    return;
  }
});
