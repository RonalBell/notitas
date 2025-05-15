// Inicializar Firebase Cloud Messaging
const messaging = firebase.messaging();

// Solicitar permiso para notificaciones
async function requestNotificationPermission() {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            // Obtener el token de FCM
            const token = await messaging.getToken({
                vapidKey: 'BIeMMv4x4EOJHbGEPH_1Tkn6gthNMo0ExLvridwzXWRD0fYSjVee0zQBCHP59Su7BmanQa1_TBSk3XuSXQeFMm0'
            });
            
            // Guardar el token en Firestore
            if (currentUser) {
                await db.collection('users').doc(currentUser.uid).update({
                    fcmToken: token,
                    notificationEnabled: true
                });
            }
            
            console.log('Notificaciones habilitadas');
        }
    } catch (error) {
        console.error('Error al solicitar permiso de notificaciones:', error);
    }
}

// Manejar mensajes cuando la app está en primer plano
messaging.onMessage((payload) => {
    const notificationTitle = '¡Nueva Nota de Amor!';
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/moon-icon.png', // Asegúrate de tener este ícono
        badge: '/moon-badge.png', // Asegúrate de tener este ícono
        vibrate: [200, 100, 200],
        data: payload.data
    };

    new Notification(notificationTitle, notificationOptions);
});

// Manejar clic en notificación
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});

// Función para enviar notificación a todos los usuarios no admin
async function notifyNewNote(noteContent, authorEmail) {
    try {
        // Obtener todos los usuarios no admin
        const usersSnapshot = await db.collection('users')
            .where('isAdmin', '==', false)
            .where('notificationEnabled', '==', true)
            .get();

        const tokens = [];
        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            if (userData.fcmToken) {
                tokens.push(userData.fcmToken);
            }
        });

        if (tokens.length > 0) {
            // Enviar notificación a cada token usando FCM HTTP v1
            tokens.forEach(async (token) => {
                try {
                    const message = {
                        message: {
                            token: token,
                            notification: {
                                title: '¡Nueva Nota de Amor!',
                                body: `Luna ha dejado una nueva nota: "${noteContent.substring(0, 50)}${noteContent.length > 50 ? '...' : ''}"`
                            },
                            webpush: {
                                notification: {
                                    icon: '/moon-icon.png',
                                    badge: '/moon-badge.png',
                                    vibrate: [200, 100, 200]
                                },
                                fcm_options: {
                                    link: window.location.origin
                                }
                            }
                        }
                    };

                    // Obtener el token de acceso para la API
                    const auth = await firebase.auth().currentUser.getIdToken();
                    
                    await fetch('https://fcm.googleapis.com/v1/projects/notitas-16a1e/messages:send', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${auth}`
                        },
                        body: JSON.stringify(message)
                    });
                } catch (error) {
                    console.error('Error al enviar notificación:', error);
                }
            });
        }
    } catch (error) {
        console.error('Error al obtener tokens:', error);
    }
}

// Solicitar permiso de notificaciones cuando el usuario inicia sesión
auth.onAuthStateChanged(async (user) => {
    if (user) {
        await requestNotificationPermission();
    }
}); 