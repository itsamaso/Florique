// Import necessary functions from Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqARCPhNPuzS7bREncNtoJ6yiFyo_DJ8M",
  authDomain: "florique-ff88c.firebaseapp.com",
  projectId: "florique-ff88c",
  storageBucket: "florique-ff88c.appspot.com",
  messagingSenderId: "396321249969",
  appId: "1:396321249969:web:91f05b5f3fe38408c46090",
  measurementId: "G-BBWFXJT15N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

// Export the initialized services
export { auth, db, storage };
