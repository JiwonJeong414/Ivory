// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import "firebase/auth";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIIz6dfvD7tTHNEBiphpvVmhRMZY1ysXo",
  authDomain: "ivory-378122.firebaseapp.com",
  projectId: "ivory-378122",
  storageBucket: "ivory-378122.appspot.com",
  messagingSenderId: "767171017028",
  appId: "1:767171017028:web:bd7981add0ee4f9a3e3f11",
  //measurementId: "G-7YR2B8QY2X",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
