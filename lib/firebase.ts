// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBnrygqupj17-2tfFj_Ihql4-4iVnPvwN0",
  authDomain: "frulo-booking-app.firebaseapp.com",
  projectId: "frulo-booking-app",
  storageBucket: "frulo-booking-app.firebasestorage.app",
  messagingSenderId: "456540632172",
  appId: "1:456540632172:web:d1b1163634757652965449",
  measurementId: "G-38HWEYBHMD"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
