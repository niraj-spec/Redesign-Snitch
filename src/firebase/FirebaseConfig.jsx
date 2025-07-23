// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCbpcI7qHYcNd4EOGsfAB3k1m_3Lh_1s7Q",
  authDomain: "snitch-redesign.firebaseapp.com",
  projectId: "snitch-redesign",
  storageBucket: "snitch-redesign.firebasestorage.app",
  messagingSenderId: "397143012457",
  appId: "1:397143012457:web:c7758af40b1abd64271ef8",
  measurementId: "G-KRLT353GPT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
