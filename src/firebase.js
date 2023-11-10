import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDycl4Tmirk7Hr_wuc_ljcK282UlQFBGMg",
  authDomain: "chatapp1-526f8.firebaseapp.com",
  projectId: "chatapp1-526f8",
  storageBucket: "chatapp1-526f8.appspot.com",
  messagingSenderId: "938928183237",
  appId: "1:938928183237:web:af697971e315877dec5dac",
};

const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

export { app, provider };
