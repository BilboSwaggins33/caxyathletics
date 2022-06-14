import { initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyA-hmoAFNyHJnB4wbhbkZXRblhs8wIe3A0",
  authDomain: "caxy-athletics.firebaseapp.com",
  databaseURL: "https://caxy-athletics-default-rtdb.firebaseio.com",
  projectId: "caxy-athletics",
  storageBucket: "caxy-athletics.appspot.com",
  messagingSenderId: "746295234450",
  appId: "1:746295234450:web:86cdfb1f8f7aeee025bb4b",
  measurementId: "G-T53S3JDBE9",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
