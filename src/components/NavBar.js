import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import img1 from "../items/img1.png";
import jwtDecode from "jwt-decode";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const NavBar = () => {
  const navigate = useNavigate();
  const { authInstance } = useContext(AuthContext);
  const user = jwtDecode(localStorage.getItem("authToken"));

  const handleClick = async () => {
    try {
      await signOut(authInstance);
      localStorage.removeItem("authToken");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const loggedIn = localStorage.getItem("authToken") ? (
    <div
      className="text-black mr-4 cursor-pointer hover:text-gray-300"
      onClick={handleClick}
    >
      Sign Out
    </div>
  ) : (
    <div
      className="text-black mr-4 hover:text-gray-300 cursor-pointer"
      onClick={handleClick}
    >
      Sign In
    </div>
  );

  return (
    <nav className="bg-[#b8e0d2] h-20 shadow p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex top-0 font-bold text-xl">
          <img src={img1} className="h-12 left-0 top-0" alt="message-icon" />
          <div className="text-black p-2"> ChatApp1 </div>
        </div>
        <div className="hidden md:flex space-x-4">
          <div className="text-white">{user.displayName}</div>
          <div
            onClick={() => {
              navigate("/");
            }}
            className="text-black mr-4 cursor-pointer hover:text-gray-300"
          >
            Home
          </div>
          {loggedIn}
        </div>
      </div>
    </nav>
  );
};
