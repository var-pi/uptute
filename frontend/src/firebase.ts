import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDSnV2ifdnYeLk91lBOFtBkN9NtLwJwO_E",
  authDomain: "fir-rtc-a43d2.firebaseapp.com",
  projectId: "fir-rtc-a43d2",
  storageBucket: "fir-rtc-a43d2.appspot.com",
  messagingSenderId: "1000941131088",
  appId: "1:1000941131088:web:b53590f0bef12527494855",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export * as firestore from "firebase/firestore";
