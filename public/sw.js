const CACHE_PREFIX = `big-trip`;
const CACHE_VERSION = `v1`;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`;

self.addEventListener(`install`, (evt) => evt.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache) => cache.addAll([
      `/`,
      `/index.html`,
      `/css/style.css`,
      `/bundle.js`,
      `/img/logo.png`,
      `/img/header-bg.png`,
      `/img/header-bg@2x.png`,
      `/img/icons/taxi.png`,
      `/img/icons/bus.png`,
      `/img/icons/train.png`,
      `/img/icons/ship.png`,
      `/img/icons/transport.png`,
      `/img/icons/drive.png`,
      `/img/icons/flight.png`,
      `/img/icons/check-in.png`,
      `/img/icons/sightseeing.png`,
      `/img/icons/restaurant.png`,
    ]))
));

self.addEventListener(`activate`, (evt) => evt.waitUntil(
    caches.keys()
    .then((keys) => Promise.all(
        keys
        .filter((key) => key.startsWith(CACHE_PREFIX) && !key.endsWith(CACHE_VERSION))
        .map((key) => caches.delete(key))
    ))
));

self.addEventListener(`fetch`, (evt) => evt.respondWith(
    caches.match(evt.request)
    .then((cachedResponse) => cachedResponse || fetch(evt.request).then((response) => response))
));
