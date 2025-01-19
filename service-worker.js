const CACHE_NAME = '中正九宫数字预测-v1';
const ASSETS_TO_CACHE = [
  '/', // 缓存根路径
  '/index.html', // 缓存首页
  '/styles.css', // 缓存样式文件
  '/script.js', // 缓存脚本文件
  '/icon-192x192.png', // 缓存图标
  '/icon-512x512.png', // 缓存图标
];

// 安装 Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('缓存资源:', ASSETS_TO_CACHE);
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting()) // 强制激活新的 Service Worker
  );
});

// 激活 Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName); // 删除旧缓存
          }
        })
      );
    })
  );
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log('从缓存中返回:', event.request.url);
          return response; // 返回缓存内容
        }
        return fetch(event.request); // 否则从网络请求
      })
  );
});
