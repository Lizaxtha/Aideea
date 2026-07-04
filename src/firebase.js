import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAijlrVJzcaLy2LMNS8mI2rBl3SbYMbft8",
  authDomain: "aideea.firebaseapp.com",
  projectId: "aideea",
  storageBucket: "aideea.firebasestorage.app",
  messagingSenderId: "577131166347",
  appId: "1:577131166347:web:925cd8da597a537ca1b28e",
  measurementId: "G-7E6QHDF2H2"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth=getAuth(app);
export const db=getFirestore(app);