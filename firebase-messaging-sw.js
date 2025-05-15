importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyDnk37eZ1UL_GS437343mB4LYYhqoh01pk",
    authDomain: "notitas-16a1e.firebaseapp.com",
    projectId: "notitas-16a1e",
    storageBucket: "notitas-16a1e.firebasestorage.app",
    messagingSenderId: "860713219431",
    appId: "1:860713219431:web:7330701e7f01f18164ebc2",
    measurementId: "G-6XCN8SWY70"
});

const messaging = firebase.messaging();

// Manejar mensajes en segundo plano
messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/moon-icon.png',
        badge: '/moon-badge.png',
        vibrate: [200, 100, 200],
        data: payload.data,
        actions: [
            {
                action: 'open',
                title: 'Ver Nota'
            }
        ]
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Manejar clic en notificación
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow(event.notification.data?.link || '/')
        );
    }
}); 