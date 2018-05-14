import "babel-polyfill";

import {registerPushNotification} from "./sw-register";
import {post} from "./util";

// set and get random user id
function registerUserId() {
    const name = "userId";
    const userId = localStorage.getItem(name) || Math.random().toString(36).slice(-8);
    localStorage.setItem(name, userId);
    return userId;
}

function checkNotificationPermission() {
    return new Promise((resolve, reject) => Notification.requestPermission(state => {
        if (state === 'granted') {
            resolve(state)
        } else {
            reject(state)
        }
    }))
}

window.addEventListener('load', async () => {
    if (!"serviceWorker" in navigator) {
        console.log("service worker is not supported.");
        return;
    }

    try {
        // Service Workerの登録
        const registration = await navigator.serviceWorker.register("/sw.js");

        // ランダムユーザーID生成(リロードしても同じIDを返す)
        const userId = registerUserId();
        // サーバーの公開鍵取得
        const response = await fetch("/api/push/key");
        const serverKey = await response.text();

        // プッシュ通知の許可を確認(許可を尋ねる)
        await checkNotificationPermission();

        // Service Workerに公開鍵を登録しプッシュ通知を有効にする
        const pushData = await registerPushNotification(serverKey, registration);
        const data = {
            userId: userId,
            endpoint: pushData.endpoint,
            userPublicKey: pushData.keys.p256dh,
            userAuth: pushData.keys.auth,
        };

        // クライアント自身の公開鍵とエンドポイントをサーバーに送信
        post("/api/push/register", data);
    } catch (e) {
        console.error(e);
    }

    // register dom
    const buttonEl = document.getElementById("send");
    const messageEl = document.getElementById("message");

    buttonEl.onclick = () => {
        // プッシュ通知を開始
        post("/api/push/notification", {message: messageEl.value})
    };
});