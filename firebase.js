// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGEYxlolkO8L1szmn-JCVKI43I7O7a-7o",
  authDomain: "nubank-9f9de.firebaseapp.com",
  projectId: "nubank-9f9de",
  storageBucket: "nubank-9f9de.firebasestorage.app",
  messagingSenderId: "179950919738",
  appId: "1:179950919738:web:3e49088fb39bdd9e979503",
  measurementId: "G-RJ28M5M52J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };