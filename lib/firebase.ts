import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAMdaR-Xr9oRDnx1oWg6wPV780qHEZ5BrI",
  authDomain: "bookingapp-4e6a4.firebaseapp.com",
  projectId: "bookingapp-4e6a4",
  storageBucket: "bookingapp-4e6a4.firebasestorage.app",
  messagingSenderId: "502398321158",
  appId: "1:502398321158:web:b07f54a08d02d5bf7f7987",
  measurementId: "G-QJJB7M7TFN"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
