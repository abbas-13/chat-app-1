import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useContext, useState } from "react";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

import img1 from "../items/img1.png";
import { AuthContext } from "../context/AuthContext";

export const SignUpPage = () => {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { dbInstance, authInstance } = useContext(AuthContext);

  const usersRef = collection(dbInstance, "users");

  const createUser = async () => {
    try {
      const response = await createUserWithEmailAndPassword(
        authInstance,
        input.email,
        input.password
      );
      await updateProfile(response.user, {
        displayName: input.name,
      });

      await setDoc(doc(usersRef, response.user.uid), {
        displayName: input.name,
        email: input.email,
        uid: response.user.uid,
        onlineStatus: false,
      });
      await setDoc(doc(dbInstance, "userChats", response.user.uid), {});
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    }
  };

  const handleChange = (key) => (event) => {
    setInput((prevState) => ({
      ...prevState,
      [key]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createUser();
    navigate("/login");
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div>
        <img src={img1} className="h-32" alt="chatapp logo" />
      </div>
      <div className="rounded p-12 mt-2 border object-center overflow-hidden shadow-lg">
        <form className="grid ">
          <input
            className="border rounded-lg bg-gray-100 p-2 m-4"
            placeholder="name"
            type="name"
            value={input.name}
            onChange={handleChange("name")}
          />
          <input
            className="border rounded-lg bg-gray-100 p-2 m-4"
            placeholder="email"
            type="email"
            value={input.email}
            onChange={handleChange("email")}
          />
          <input
            className="border rounded-lg bg-gray-100 p-2 m-4"
            placeholder="password"
            type="password"
            value={input.password}
            onChange={handleChange("password")}
          />
          <div className="flex justify-center">
            <button
              className="p-2 pl-6 pr-6 m-4 w-32 text-white bg-blue-500 border rounded-lg"
              onClick={handleSubmit}
            >
              sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
