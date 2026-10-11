// Offline cache: the site and its tools are kept on the device. Nothing else is stored here.
const CACHE = "creneaux-d869dde67c19";
const FILES = ["./", "./app.data.js", "./icon-192.png", "./icon-512.png", "./index.html", "./manifest.webmanifest", "./vendor/pdf.min.js", "./vendor/pdf.worker.min.js", "./vendor/tesseract/fra.traineddata.gz", "./vendor/tesseract/tesseract-core-lstm.wasm.js", "./vendor/tesseract/tesseract-core-simd-lstm.wasm.js", "./vendor/tesseract/tesseract.min.js", "./vendor/tesseract/worker.min.js"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// Network first (to pick up updates), cache when offline
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match("./")))
  );
});
