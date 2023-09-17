// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCh5FYc5FeSmKufAIV5mOqr9MtLXmHiWnY",
  authDomain: "whale-profits.firebaseapp.com",
  projectId: "whale-profits",
  storageBucket: "whale-profits.appspot.com",
  messagingSenderId: "494584726928",
  appId: "1:494584726928:web:5caa5387a8820d0a48df15",
  measurementId: "G-V31G2EH7RS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;

