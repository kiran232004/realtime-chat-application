import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-3f522.firebaseapp.com",
  projectId: "reactchat-3f522",
  storageBucket: "reactchat-3f522.firebasestorage.app",
  messagingSenderId: "374377532781",
  appId: "1:374377532781:web:47833d7e5ff98033981e64",
  measurementId: "G-E9BLNSP3H9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
