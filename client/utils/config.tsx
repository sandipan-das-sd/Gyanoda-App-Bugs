
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyAN6H6RxL9NSsLeuXIbm-8gEFdTiC-TWNY",
  authDomain: "gyanoda-facebook-login.firebaseapp.com",
  projectId: "gyanoda-facebook-login",
  storageBucket: "gyanoda-facebook-login.appspot.com",
  messagingSenderId: "373284502153",
  appId: "1:373284502153:web:f961b6771b8e0ad60aa458",
  measurementId: "G-4PFHB5RFS7"
};

// Initialize Firebase
if(!firebase.apps.length)
{
    firebase.initializeApp(firebaseConfig)
}
export {firebase}