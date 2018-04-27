workbox.clientsClaim();
workbox.skipWaiting();

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

self.addEventListener('push', (event) => {
    const title = 'Title';
    const options = {
        body: event.data.text(),
        icon: '/icons/icon_128x128.png',
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => event.notification.close(), false);