// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAcUsWStB1GPQRl5Si-GRqoA_gzUPHf9E",
  authDomain: "point-and-click-20d4c.firebaseapp.com",
  projectId: "point-and-click-20d4c",
  storageBucket: "point-and-click-20d4c.appspot.com",
  messagingSenderId: "386727040152",
  appId: "1:386727040152:web:42744215ba2bcfe9996ced",
  measurementId: "G-SZ03795ZW2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
