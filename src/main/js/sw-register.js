export function registerPushNotification(serverKey, registration) {
    return new Promise((resolve, reject) => {
        const applicationServerKey = decodeBase64URL(serverKey);
        registration.pushManager.subscribe({
            applicationServerKey,
            userVisibleOnly: true
        }).then(subscription => {
            const data = {
                endpoint: subscription.endpoint,
                keys: {
                    auth: encodeBase64URL(subscription.getKey("auth")),
                    p256dh: encodeBase64URL(subscription.getKey("p256dh")),
                },
            };
            resolve(data);
        }).catch(reject)
    });
}

function encodeBase64URL(buffer) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeBase64URL(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}