// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore"; // Import getFirestore
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHOhsPvwtH0AYKRxxE5j0j5OOZ029vrxA",
  authDomain: "drone-images-d1a48.firebaseapp.com",
  projectId: "drone-images-d1a48",
  storageBucket: "drone-images-d1a48.appspot.com",
  messagingSenderId: "890255152278",
  appId: "1:890255152278:web:83a93637bd734aedb5deb7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore();
const storage = getStorage(app);
export const auth = getAuth(app);

export { db, storage }; // Export the db variable

