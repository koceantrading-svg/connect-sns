// CONNECT - 最小構成のサービスワーカー（PWA/TWA化のインストール要件を満たすため）
const CACHE_NAME = "connect-shell-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// ネットワーク優先。失敗時のみキャッシュを試す（常に最新のindex.htmlを表示するため）
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
