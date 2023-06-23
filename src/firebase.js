/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";





// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfrywqUjSRomyQKpV6ISMoEug9w7PZ8f0",
  authDomain: "auth-app-f3957.firebaseapp.com",
  projectId: "auth-app-f3957",
  storageBucket: "auth-app-f3957.appspot.com",
  messagingSenderId: "519326465220",
  appId: "1:519326465220:web:2a3ef217691243763ddd91",
  measurementId: "G-ZKYHPGCJVP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Initialize services
const auth = getAuth(app); 
const firestore = getFirestore(app);
const storage = getStorage(app);


export { app, auth, firestore, storage };