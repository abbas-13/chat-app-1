import { useNavigate } from "react-router-dom";

import img1 from "../items/img1.png";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const LoginPage = () => {
  const { emailSignIn, googleSignIn, input, setInput } =
    useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    emailSignIn();
  };

  const handleChange = (key) => (event) => {
    setInput((prevState) => ({
      ...prevState,
      [key]: event.target.value,
    }));
  };

  return (
    <div className="flex flex-col h-full justify-center items-center">
      <div className="rounded p-8 border w-100 shadow-lg">
        <img src={img1} className="m-auto h-32" alt="chatapp logo" />
        <form onSubmit={handleSubmit} className="grid ">
          <input
            className="border rounded-lg bg-gray-100 p-2 my-4"
            placeholder="Email"
            value={input.email}
            type="email"
            onChange={handleChange("email")}
          />
          <input
            className="border rounded-lg bg-gray-100 p-2 mb-4"
            placeholder="Password"
            type="password"
            value={input.password}
            onChange={handleChange("password")}
          />
          <div className="flex gap-4 mb-4 text-sm font-medium items-start">
            <input
              className="p-2 w-32 text-white bg-[#b8e0d2] rounded-lg"
              type="submit"
              value="Sign In"
            />
            <div>
              <button
                onClick={() => {
                  googleSignIn();
                }}
                className="text-white w-full gap-2 bg-[#4285F4] hover:bg-[#4285F4]/90 rounded-lg p-2 flex items-center justify-center"
                type="button"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
                Sign In with Google
              </button>
            </div>
          </div>

          <hr />
          <button
            className="p-2 m-auto mt-4 w-32 text-white text-sm font-medium bg-[#b8e0d2] rounded-lg"
            onClick={() => {
              navigate("/signup");
            }}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};
