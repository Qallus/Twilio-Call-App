// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASFI4MR0odIr38YMIEEfC7JwFbyQbTZgc",
  authDomain: "warmieio.firebaseapp.com",
  projectId: "warmieio",
  storageBucket: "warmieio.appspot.com",
  messagingSenderId: "418463469991",
  appId: "1:418463469991:web:984d36671880fa52506682",
  measurementId: "G-7Z0YG4B9DL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);