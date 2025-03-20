import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyApTg3tgSpt3i03MRoxH1FVTaTGZskl6co",
  authDomain: "dam-chatmerchito-20251.firebaseapp.com",
  projectId: "dam-chatmerchito-20251",
  storageBucket: "dam-chatmerchito-20251.firebasestorage.app",
  messagingSenderId: "894876873561",
  appId: "1:894876873561:web:9b0ad13fbc174953759248",
  measurementId: "G-LV9X925MWS",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
