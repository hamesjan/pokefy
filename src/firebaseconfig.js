// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2EYTeeT6F5uheYyUl0ta3Z0ZnmXT5LRM",
  authDomain: "pokefy-801cd.firebaseapp.com",
  projectId: "pokefy-801cd",
  storageBucket: "pokefy-801cd.appspot.com",
  messagingSenderId: "312665941162",
  appId: "1:312665941162:web:7fa866c5c5828eeb649cd3",
  measurementId: "G-YH6FBMD5XP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export { app, analytics };
