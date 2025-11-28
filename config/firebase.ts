import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCH2wk6V7hDzVsZEaepX-m-2DciMYaHAGs",
    authDomain: "banco-dados-tv.firebaseapp.com",
    projectId: "banco-dados-tv",
    storageBucket: "banco-dados-tv.firebasestorage.app",
    messagingSenderId: "295405312917",
    appId: "1:295405312917:web:2ac3c73022c81a93b4349c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
