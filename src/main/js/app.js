import {registerPushNotification} from "./sw-register";

window.addEventListener('load', async () => {
    if (!"serviceWorker" in navigator) {
        console.log("service worker is not supported.");
        return;
    }
    try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        const response = await fetch("/server-key");
        const serverKey = await response.text();
        const pushData = await registerPushNotification(serverKey, registration);

        console.log(JSON.stringify(pushData));
    } catch (e) {
        console.error(e);
    }
});