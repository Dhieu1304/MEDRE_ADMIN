import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBz4AtlcejRF_9d_XUjqDCkYRghF69smyM",
  authDomain: "medre-9f7f5.firebaseapp.com",
  projectId: "medre-9f7f5",
  storageBucket: "medre-9f7f5.appspot.com",
  messagingSenderId: "925660490794",
  appId: "1:925660490794:web:ba688e05dd4344bafd6753",
  measurementId: "G-K1F3D4895N"
};

export const requestPermission = () => {
  // console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      // console.log("Notification permission granted.");
      const app = initializeApp(firebaseConfig);

      const messaging = getMessaging(app);
      getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
        // validKey: "BIM1c0Hf6ZJdZCnFjkdx9Judg_y4y5CEe3VsPTTib4udEvzbCoMj5HH-mxWSwXDR_Ft7t_IB9t9HrsuIsGY-XsQ"
      }).then((currentToken) => {
        // if (currentToken) {
        //   console.log("currentToken: ", currentToken);
        // } else {
        //   console.log("Can not get token");
        // }
        return currentToken;
      });

      // onMessage(messaging, (payload) => {
      //   // console.log("Message received. ", payload);
      //   return payload;
      // });
      onMessage(messaging, () => {});
    } else {
      // console.log("Do not have permission!");
    }
  });
};

// requestPermission();
