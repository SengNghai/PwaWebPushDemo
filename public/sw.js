self.addEventListener('install', (event) => {
  console.log('[Service Worker] 正在安装服务工作线程 ...', event);
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] 激活服务工作线程 ...', event);
  return self.clients.claim();
});

self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-24x24.png'
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
