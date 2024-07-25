import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import back from "../assets/bmitrackingassets/back.svg";

export default function AddAdmin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");

  const createAdmin = async () => {
    if (!username || !password || !repassword) {
      Swal.fire({
        title: "Invalid Input",
        text: "Please enter a valid input.",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
      return;
    }
    if (password !== repassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "The entered passwords do not match. Please try again.",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
      return;
    }
    try {
      const response = await axios.put("http://localhost:8800/createAdmin", {
        username,
        password,
        repassword,
      });
      console.log(response);
      if (response.data.reloadPage) {
        window.alert("An admin was created successfully");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div
          className="p-1 bg-white rounded-full cursor-pointer w-fit"
          onClick={() => navigate("/manageaccounts")}
        >
          <img src={back} alt="" width={"40px"} />
        </div>
        <h3 className="px-6 py-2 mt-1 font-semibold bg-white rounded-lg w-fit">
          Manage Accounts
        </h3>
      </div>
      <section className="flex flex-col w-2/3 px-6 py-8 mx-auto font-semibold bg-white rounded-lg">
        <h6 className="font-normal text-center">Create Admin Account</h6>
        <label>Username: </label>
        <input
          type="text"
          className="px-3 py-2 font-normal border-2 rounded-lg"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Password: </label>
        <input
          type="password"
          className="px-3 py-2 font-normal border-2 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Re-Type Password: </label>
        <input
          type="password"
          className="px-3 py-2 font-normal border-2 rounded-lg"
          value={repassword}
          onChange={(e) => setRepassword(e.target.value)}
        />

        <div className="flex justify-center gap-5 mt-3">
          <button className="px-10 text-white bg-C0D3E5A" onClick={createAdmin}>
            Create
          </button>
          <button
            className="px-10 text-white bg-C1886C3"
            onClick={() => navigate("/manageaccounts")}
          >
            Cancel
          </button>
        </div>
      </section>
    </div>
  );
}
