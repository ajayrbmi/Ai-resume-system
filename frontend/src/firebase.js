import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Replace this config with your actual Firebase Project keys
// From Firebase Console -> Project Settings -> General -> Web App
const firebaseConfig = {
  apiKey: "AIzaSyCxBLFFxaLvKox8T9oGTMcR59pqLBeOGLI",
  authDomain: "resume-screening-system-c7d90.firebaseapp.com",
  projectId: "resume-screening-system-c7d90",
  storageBucket: "resume-screening-system-c7d90.firebasestorage.app",
  messagingSenderId: "805429310590",
  appId: "1:805429310590:web:e065af47d6815e3f44542f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
