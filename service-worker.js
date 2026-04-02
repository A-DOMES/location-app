const CACHE_NAME = "adomes-cache-v1"; 
// ✅ 캐시 이름을 v4로 바꿔서 새 버전 적용

const urlsToCache = [
  "index.html",
  "manifest.json",
  "icon-192.png",
  "icon-512.png",
  "config.js"   // ✅ 새로 추가된 파일
];

// ✅ 설치 단계: 캐시에 필요한 파일들을 모두 저장
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// ✅ 요청(fetch) 단계: 캐시에 있으면 캐시에서 응답, 없으면 네트워크에서 가져옴
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// ✅ 활성화 단계: 이전 버전 캐시를 정리하고 최신 캐시만 유지
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
