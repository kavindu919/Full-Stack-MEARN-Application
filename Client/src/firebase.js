// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,                                                           
  authDomain: "real-state-65730.firebaseapp.com",
  projectId: "real-state-65730",
  storageBucket: "real-state-65730.appspot.com",
  messagingSenderId: "730068906533",
  appId: "1:730068906533:web:dceabb8900e80bd8d685cc"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);