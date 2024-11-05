import axios from "axios";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";

export default function UpdateImmunizationModal({ onClose, childId }) {
  const [selectedVaccine, setSelectedVaccine] = useState("BCG Vaccine");
  const [date, setDate] = useState();
  const [remarks, setRemarks] = useState("");
  const [selectedVaccineId, setSelectedVaccineId] = useState("1");
  const [doses, setDoses] = useState("");
  const [doseLeft, setDoseLeft] = useState(0);
  const [doseMax, setDoseMax] = useState(0);
  const [doseTaken, setDoseTaken] = useState(0);
  const [vaccines, setVaccines] = useState([]);

  useEffect(() => {
    // Fetch all vaccines when component mounts
    const fetchVaccines = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8800/getAllVaccines"
        );
        setVaccines(response.data);
      } catch (error) {
        console.log("Error fetching vaccines:", error);
      }
    };

    const fetchDate = async () => {
      const vaccine = "BCG Vaccine";
      try {
        const response = await axios.get(
          `http://localhost:8800/dosesTaken/${childId}?vaccine=${vaccine}`
        );
        console.log(response.data[0].dose_taken);
        setDoseLeft(response.data[0].dose_left);
        setDoseMax(response.data[0].doses_required);
        setDoseTaken(response.data[0].dose_taken);
      } catch (error) {
        console.log(error);
      }
    };

    fetchVaccines();
    fetchDate();
  }, [childId]);

  const handleVaccineSelect = async (e) => {
    setSelectedVaccine(e.target.value);
    const selectedOption = e.target.options[e.target.selectedIndex];
    setSelectedVaccineId(selectedOption.dataset.info);
    try {
      const response = await axios.get(
        `http://localhost:8800/dosesTaken/${childId}?vaccine=${e.target.value}`
      );
      console.log(response.data[0]);
      setDoseLeft(response.data[0].dose_left);
      setDoseTaken(response.data[0].dose_taken);
    } catch (error) {
      console.log(error);
    }
  };

  const appyUpdate = async () => {
    let doseValid = doseLeft !== 0;

    // console.log("Remarks:", doseVdaalid);
    console.log("date: ", date === "");

    if (
      selectedVaccine.length === 0 ||
      date === undefined ||
      date === "" ||
      !date ||
      doseValid === false
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "It looks like there's an issue with the input. Please check and try again.",
      });
    } else {
      onClose();
      try {
        const response = await axios.put(
          `http://localhost:8800/updateImmunization`,
          {
            childId,
            selectedVaccineId,
            date,
            remarks,
          }
        );
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getMaxDate = () => {
    const currentDate = new Date();
    const formattedMaxDate = currentDate.toISOString().split("T")[0];
    return formattedMaxDate;
  };

  return ReactDOM.createPortal(
    <div className="fixed top-0 z-10 flex items-center justify-center w-full h-full bg-opacity-50 alertModal bg-CD9D9D9">
      <div className="flex flex-col w-1/2 px-12 py-16 bg-white rounded-lg">
        <span className="mb-5 text-xl font-semibold">
          Update Immunization Record
        </span>
        <div className="">
          <label>Bakuna: </label>
          <select
            className="w-full px-2 py-3 border-2 rounded-lg"
            onChange={handleVaccineSelect}
            value={selectedVaccine}
          >
            {vaccines.map((vaccine) => (
              <option
                key={vaccine.vaccine_id}
                value={vaccine.name}
                data-info={vaccine.vaccine_id}
              >
                {vaccine.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label>Date: </label>
            <input
              type="date"
              className="w-full px-2 py-3 border-2 rounded-lg"
              value={date}
              max={getMaxDate()}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-center flex-1">
            <label>Dose Taken: </label>
            {doseLeft !== 0 ? (
              <span className="mt-2 text-center">{doseTaken}</span>
            ) : (
              <span className="mt-2 text-center">
                Required Doses Have Been Reached
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-3">
          <button
            onClick={onClose}
            className="bg-white border-2 border-C0D3E5A text-C0D3E5A"
          >
            Close
          </button>
          <button onClick={appyUpdate} className="text-white">
            Update
          </button>
        </div>
      </div>
    </div>,
    updateImmuModal
  );
}
