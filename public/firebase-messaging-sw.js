// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyBz4AtlcejRF_9d_XUjqDCkYRghF69smyM",
  authDomain: "medre-9f7f5.firebaseapp.com",
  projectId: "medre-9f7f5",
  storageBucket: "medre-9f7f5.appspot.com",
  messagingSenderId: "925660490794",
  appId: "1:925660490794:web:ba688e05dd4344bafd6753",
  measurementId: "G-K1F3D4895N"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  // console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
