import React, { useState, useEffect } from "react";
import axios from "axios";

const ParentDatalist = ({ onMotherSelect, onFatherSelect }) => {
  const [parents, setParents] = useState([]);
  const [mother, setMother] = useState("");
  const [father, setFather] = useState("");

  useEffect(() => {
    // Fetch the list of parents from the server
    const fetchParents = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/getAllParents`);
        setParents(response.data);
      } catch (error) {
        console.error("Error fetching parents:", error);
      }
    };

    fetchParents();
  }, []);

  const mothersList = parents.filter(
    (parent) => parent.relationship === "Mother"
  );
  const fathersList = parents.filter(
    (parent) => parent.relationship === "Father"
  );

  const handleMotherChange = (e) => {
    const selectedMother = mothersList.find(
      (mother) => mother.name === e.target.value
    );
    setMother(e.target.value);
    if (selectedMother) {
      onMotherSelect(selectedMother.parent_id); // Pass parent_id to the parent component
    }
  };

  const handleFatherChange = (e) => {
    const selectedFather = fathersList.find(
      (father) => father.name === e.target.value
    );
    setFather(e.target.value);
    if (selectedFather) {
      onFatherSelect(selectedFather.parent_id); // Pass parent_id to the parent component
    }
  };

  return (
    <div className="flex gap-4 px-5">
      {/* Input for Mothers */}
      <div className="flex-1">
        <label htmlFor="mother" className="block font-semibold text-black">
          Select Mother:
        </label>
        <input
          type="text"
          list="mothers"
          value={mother}
          onChange={handleMotherChange}
          className="block w-full p-2 mt-1 text-black border border-black"
          placeholder="Search for Mother"
        />
        <datalist id="mothers">
          {mothersList.map((mother) => (
            <option key={mother.parent_id} value={mother.name} />
          ))}
        </datalist>
      </div>

      {/* Input for Fathers */}
      <div className="flex-1">
        <label htmlFor="father" className="block font-semibold text-black">
          Select Father:
        </label>
        <input
          type="text"
          list="fathers"
          value={father}
          onChange={handleFatherChange}
          className="block w-full p-2 mt-1 border border-black"
          placeholder="Search for Father"
        />
        <datalist id="fathers">
          {fathersList.map((father) => (
            <option key={father.parent_id} value={father.name} />
          ))}
        </datalist>
      </div>
    </div>
  );
};

export default ParentDatalist;
