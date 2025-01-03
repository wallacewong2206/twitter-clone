// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGdWqL-Phb_BzlvGnxVatoLFeWXRRXJh8",
  authDomain: "twitter-app-69e31.firebaseapp.com",
  projectId: "twitter-app-69e31",
  storageBucket: "twitter-app-69e31.firebasestorage.app",
  messagingSenderId: "61752318599",
  appId: "1:61752318599:web:692ac173f3fd8ec208b622"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);