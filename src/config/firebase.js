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

export const requestPermission = async () => {
  try {
    let resultToken;
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
      });
      if (currentToken) {
        // console.log("currentToken: ", currentToken);
        resultToken = currentToken;
      }
      // else {
      //   console.log("Can not get token");
      // }
      onMessage(messaging, () => {});
    } else {
      // console.log("Do not have permission!");
      return resultToken;
    }
    return resultToken;
  } catch (error) {
    return null;
  }
};

// requestPermission();
