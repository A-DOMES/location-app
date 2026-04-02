const CACHE_NAME = "adomes-cache-v4"; 
// ✅ 캐시 이름을 v4로 바꿔서 새 버전 적용

const urlsToCache = [
  "index.html",
  "client.html",       // ✅ 지도 페이지
  "user.html",         // ✅ 사용자 위치 전송 페이지
  "registerUser.html", // ✅ 사용자 등록 페이지
  "manifest.json",
  "icon-192.png",
  "icon-512.png",
  "btn-current.png",   // ✅ 지도 버튼 이미지 추가
  "config.js"          // ✅ 새로 추가된 설정 파일
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
