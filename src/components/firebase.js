import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBtd49KQYWhZRjm4PN9eMdwYc07JdUAodc",
  authDomain: "oracions-513de.firebaseapp.com",
  databaseURL: "https://oracions-513de-default-rtdb.firebaseio.com",
  projectId: "oracions-513de",
  storageBucket: "oracions-513de.appspot.com",
  messagingSenderId: "117630363088",
  appId: "1:117630363088:web:1adb76533baef41bd645d5",
  measurementId: "G-MPRGLTCBE0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;