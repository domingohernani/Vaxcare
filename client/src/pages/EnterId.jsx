import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EnterId() {
  const [id, setId] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    const regex = /^VXCR-\d+$/;

    if (!regex.test(id)) {
      Swal.fire({
        icon: "error",
        title: "Invalid ID Format",
        text: "Please enter a valid ID in the format VXCR{digit}",
      });
      return;
    }
    console.log(id);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/getAllChild/${id}`
      );
      console.log(response);
      if (response.data.length === 0) {
        Swal.fire({
          icon: "error",
          title: "No child was found.",
          text: "Please check the ID.",
        });
        return;
      }
      navigate(`/publicviewImmu/${response.data[0].child_id}`);
    } catch (error) {
      console.error("Error fetching child data:", error);
    }
  };

  return (
    <div className="w-screen h-screen bg-white ">
      <nav className="pt-3 pl-3">
        <h3 className="logo">Medicore</h3>
      </nav>
      <div className="flex flex-col items-center justify-center h-4/5">
        <div className="text-lg text-left">
          <label className="font-semibold">Maglagay ng ID ng bata</label>
        </div>
        <input
          type="text"
          className="px-2 py-2 border-2 rounded-lg"
          onChange={(e) => setId(e.target.value)}
          placeholder="ex: VXCR#"
        />
        <button className="px-16 my-5 text-white" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
}
