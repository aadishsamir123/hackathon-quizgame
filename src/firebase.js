import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config will go here
// For now, using placeholder values - you'll need to replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCstdeW65Z4EPbF8e98LfoCV4KSk_0l4rE",
  authDomain: "asdev-giis-hackathon-2025.firebaseapp.com",
  projectId: "asdev-giis-hackathon-2025",
  storageBucket: "asdev-giis-hackathon-2025.firebasestorage.app",
  messagingSenderId: "991814301405",
  appId: "1:991814301405:web:50c7d078f96949114e4d34",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
