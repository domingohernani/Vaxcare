import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import loginIllustration from "../assets/loginassets/tempo.png";
import logo from "../assets/vaxcare_logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  console.log("Login rendered");

  const handleLogin = async () => {
    if (!username || !password) {
      Swal.fire({
        icon: "warning",
        title: "Empty Fields",
        text: "Please enter both username and password before attempting to log in",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
      return;
    }
    console.log(username);
    console.log(password);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/login`,
        {
          username,
          password,
        }
      );

      if (response.data.success) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", response.data.role.role);
        navigate("/dashboard");
      } else {
        console.error("Authentication failed");
      }
    } catch (error) {
      console.error("Authentication failed");
      Swal.fire({
        icon: "error",
        title: "Incorrect Credentials",
        text: "The entered username or password is not correct. Please try again.",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="absolute top-0 left-0 z-10 flex flex-col w-screen h-screen mx-auto bg-white">
      {/* <div className="mt-10 bg-blue-300">
        <h3 className="mx-auto text-xl font-bold text-center">
          Barangay Child Health Center Immunization System
        </h3>
      </div> */}
      <h6 className="absolute font-bold logo left-5 top-5 w-fit">
        <img src={logo} className="w-20 h-auto" />
      </h6>
      <div className="flex w-full h-screen m-auto logInContainer">
        <div className="flex flex-col justify-center flex-1 w-3/4 gap-5 px-12 py-10 bg-white">
          <h3 className="text-4xl font-semibold text-gray-800">Welcome!</h3>
          <p>Pleae enter you details</p>
          <input
            type="text"
            placeholder="Username"
            className="px-3 py-2 border-2 rounded-lg"
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="relative ">
            <input
              type={hidePassword ? "password" : "text"}
              placeholder="Password"
              className="w-full px-3 py-2 border-2 rounded-lg"
              onChange={(e) => setPassword(e.target.value)}
            />
            {hidePassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="20"
                viewBox="0 0 640 512"
                fill="blue"
                className="absolute cursor-pointer right-6 bottom-3 "
                onClick={() => setHidePassword(false)}
              >
                <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="20"
                viewBox="0 0 576 512"
                fill="blue"
                className="absolute text-black cursor-pointer right-6 bottom-3"
                onClick={() => setHidePassword(true)}
              >
                <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
              </svg>
            )}
          </div>
          <button
            className="w-2/5 py-3 mx-auto text-white bg-primary"
            onClick={handleLogin}
          >
            Log In
          </button>
          <div className="m-4 ml-auto w-fit">
            <Link to={"/"} className="text-black underline">
              Login as Parent
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center flex-1 h-full bg-primary">
          <img
            src={loginIllustration}
            className="object-contain w-full h-full m-auto"
          />
        </div>
      </div>
    </div>
  );
}
