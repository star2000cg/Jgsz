const CACHE_NAME = '中正九宫数字预测-v3'; // 更新版本号
const ASSETS_TO_CACHE = [
  '/', // 缓存根路径
  '/index.html', // 缓存首页
  '/styles.css', // 缓存样式文件
  '/script.js', // 缓存脚本文件
  '/icon-192x192.png', // 缓存图标
  '/icon-512x512.png', // 缓存图标
  '/offline.html' // 自定义离线页面
];

// 安装 Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('正在缓存资源:', ASSETS_TO_CACHE);
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('资源缓存完成');
        return self.skipWaiting(); // 强制激活新的 Service Worker
      })
      .catch((err) => {
        console.error('资源缓存失败:', err);
      })
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
    }).then(() => {
      console.log('Service Worker 激活完成');
      return self.clients.claim(); // 立即控制所有客户端
    })
  );
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 只缓存同源请求
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            console.log('从缓存中返回:', event.request.url);
            return response; // 返回缓存内容
          }

          // 动态缓存新请求
          return fetch(event.request)
            .then((fetchResponse) => {
              if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                return fetchResponse; // 只缓存成功的响应
              }

              const responseToCache = fetchResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                  console.log('动态缓存新请求:', event.request.url);
                });

              return fetchResponse;
            })
            .catch(() => {
              // 如果网络请求失败，返回离线页面
              return caches.match('/offline.html');
            });
        })
    );
  } else {
    // 对于非同源请求，直接通过网络请求
    event.respondWith(fetch(event.request));
  }
});