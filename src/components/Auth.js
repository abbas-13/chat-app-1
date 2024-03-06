import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import { provider, app } from "../firebase";

import loading1 from "../items/loading1.gif";

export const Auth = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const authInstance = getAuth(app);
  const dbInstance = getFirestore(app);

  const usersRef = collection(dbInstance, "users");

  const isTokenValid = () => {
    const authToken = localStorage.getItem("authToken")
      ? jwtDecode(localStorage.getItem("authToken"))
      : 0;

    if (!authToken) {
      return false;
    }
    const currentDate = new Date();
    const tokenExp = new Date(authToken.exp * 1000);

    return { isValid: tokenExp > currentDate, authToken };
  };

  const googleSignIn = async () => {
    try {
      const response = await signInWithPopup(authInstance, provider);
      const credential = GoogleAuthProvider.credentialFromResult(response);
      const token = credential.idToken;

      localStorage.setItem("authToken", token);
      console.log("number 4");

      await setDoc(doc(usersRef, response.user.uid), {
        displayName: authInstance.currentUser.displayName,
        email: authInstance.currentUser.email,
        uid: authInstance.currentUser.uid,
        onlineStatus: true,
      });

      setUser(token);
    } catch (error) {
      const errorMsg = error.message;
      const userEmail = error.customData.email;
      const credentialType = GoogleAuthProvider.credentialFromError(error);

      console.log(errorMsg, userEmail, credentialType);
      setError(error.code);
    }
  };

  const emailSignIn = async () => {
    try {
      await signInWithEmailAndPassword(
        authInstance,
        input.email,
        input.password
      );
      console.log("number 5");

      localStorage.setItem("authToken", authInstance.currentUser.accessToken);
      setUser(authInstance.currentUser.accessToken);
    } catch (error) {
      setError(error.code);
    }
  };

  useEffect(() => {
    if (!user) {
      const { isValid } = isTokenValid();

      if (!isValid) {
        navigate("/Login");
      }
    } else {
      navigate("/");
    }

    onAuthStateChanged(authInstance, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authInstance, user]);

  if (isLoading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <img className="h-48" src={loading1} alt="loading gif" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        emailSignIn,
        googleSignIn,
        user,
        setUser,
        input,
        setInput,
        authInstance,
        dbInstance,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
