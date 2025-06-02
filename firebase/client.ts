// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtluda1Q9jH13GobJ5T8tnh0LWcas_E9Q",
  authDomain: "prepwise-3f9df.firebaseapp.com",
  projectId: "prepwise-3f9df",
  storageBucket: "prepwise-3f9df.firebasestorage.app",
  messagingSenderId: "237770470363",
  appId: "1:237770470363:web:76cd8456d014d909fa6dfe",
  measurementId: "G-1CY0K44Y4V"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app)
export const db = getFirestore(app)
