import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import logo from "../assets/vaxcare_logo.png";
import ParentNavigation from "../components/ParentNavigation";
import loginImage from "../assets/loginassets/login-image.webp";

const LoginParent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogin = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8800/getAllChildOfParent",
        {
          params: { username, password },
        }
      );

      if (response.data.length > 0) {
        Swal.fire({
          icon: "success",
          title: "Login successful!",
          text: `Welcome ${username}, you can now view your children's details.`,
          showConfirmButton: false,
          timer: 2000,
        });

        // Redirect to the page where the parent can see their children's details
        // navigate("/children-details", { state: { children: response.data } });
        navigate("/immunization-viewing", {
          state: { children: response.data },
        });
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        Swal.fire({
          icon: "error",
          title: "No parent found",
          text: "Please check your credentials and try again.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: "Please check your credentials and try again.",
        });
      }
    }
  };

  return (
    <div>
      <div className="px-10 pt-4">
        <img src={logo} className="w-20 h-auto" />
      </div>
      <div className="flex items-center justify-center px-4 py-20">
        <div className="grid items-center w-full max-w-6xl gap-4 md:grid-cols-2">
          <div className="border border-gray-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="mb-8">
                <h3 className="text-3xl font-extrabold text-gray-800">
                  Parent Login
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-gray-500">
                  Welcome to the Barangay Child Health Monitoring System. Sign
                  in to access your account and view the vaccination status of
                  your children.
                </p>
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-800">
                  Username
                </label>
                <div className="relative flex items-center">
                  <input
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 text-sm text-gray-800 border border-gray-300 rounded-lg outline-blue-600"
                    placeholder="Enter username"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-800">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 text-sm text-gray-800 border border-gray-300 rounded-lg outline-blue-600"
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleLogin}
                  className="w-full px-4 py-3 text-sm tracking-wide text-white bg-blue-600 rounded-lg shadow-xl hover:bg-blue-700 focus:outline-none"
                >
                  Log in
                </button>
              </div>
            </form>
          </div>

          <div className="lg:h-[400px] md:h-[300px] max-md:mt-8">
            <img
              src={loginImage}
              className="block object-cover w-full h-full mx-auto max-md:w-4/5"
              alt="Child Health Monitoring"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginParent;
