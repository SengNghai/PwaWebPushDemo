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
  // 增加红点消息计数
  let notificationCount = localStorage.getItem('notificationCount');
  notificationCount = notificationCount ? parseInt(notificationCount) + 1 : 1;
  localStorage.setItem('notificationCount', notificationCount);

  // 更新角标 (仅安卓)
  if ('setAppBadge' in navigator) {
    navigator.setAppBadge(notificationCount).catch(error => {
      console.error('更新角标时出错:', error);
    });
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
    const clickedNotification = event.notification;
    clickedNotification.close();
  
    // Do something as the result of the notification click
    const promiseChain = doSomething();
    event.waitUntil(promiseChain);
  });
