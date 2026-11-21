/* Sammie Schaakt! - offline werken
   Bewaart alle bestanden van de app op het apparaat, zodat hij zonder internet werkt.
   Na een update: verhoog VERSIE, dan haalt de iPad de nieuwe versie op. */
const VERSIE = 'sammie-v15';
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './img/icon-180.png',
  './img/icon-192.png',
  './img/icon-512.png',
  './img/icon.svg',
  './js/ai.js',
  './js/app.js',
  './js/avatars.js',
  './js/board.js',
  './js/chess.js',
  './js/editor.js',
  './js/extras.js',
  './js/family.js',
  './js/lessons.js',
  './js/main.js',
  './js/parents.js',
  './js/pieces.js',
  './js/puzzles.js',
  './js/sound.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSIE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== VERSIE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Eerst uit de opslag op het apparaat; alleen als iets ontbreekt via het netwerk.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request)));
});
