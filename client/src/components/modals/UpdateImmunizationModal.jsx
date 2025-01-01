import axios from "axios";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";

const vaccineSchedule = {
  BCG: 0, // "At birth" (0 days after birthdate)
  HepB: 0, // "At birth" (0 days after birthdate)
  "Dpt-HIB-HepB": [45, 75, 105], // Days for 1 1/2 months, 2 1/2 months, 3 1/2 months
  Opv: [45, 75, 105],
  IPV: [105, 270], // Days for 3 1/2 months, 9 months
  PCV: [45, 75, 105],
  MCV: [270, 365], // Days for 9-11 months, 12 months
  FIC: 365, // 12 months
  CIC: 395, // More than 12 months
};

const calculateDate = (birthdate, daysOffset) => {
  const date = new Date(birthdate);
  date.setDate(date.getDate() + daysOffset);

  const formattedYear = date.getFullYear();
  const formattedMonth = String(date.getMonth() + 1).padStart(2, "0");
  const formattedDay = String(date.getDate()).padStart(2, "0");

  return `${formattedYear}-${formattedMonth}-${formattedDay}`;
};

export default function UpdateImmunizationModal({ onClose, childId }) {
  const [selectedVaccine, setSelectedVaccine] = useState("BCG");
  const [date, setDate] = useState("");
  const [selectedVaccineId, setSelectedVaccineId] = useState("1");
  const [doseLeft, setDoseLeft] = useState(0);
  const [doseTaken, setDoseTaken] = useState(0);
  const [vaccines, setVaccines] = useState([]);
  const [birthdate, setBirthdate] = useState("");

  useEffect(() => {
    const fetchChildBirthdate = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/getChildBirthdate/${childId}`
        );
        setBirthdate(response.data.birthdate);
      } catch (error) {
        console.error("Error fetching birthdate:", error);
      }
    };

    const fetchVaccines = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/getAllVaccines`
        );
        setVaccines(response.data);
      } catch (error) {
        console.error("Error fetching vaccines:", error);
      }
    };

    const fetchDefaultDate = async () => {
      if (!birthdate) return;

      const vaccine = "BCG";
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/dosesTaken/${childId}?vaccine=${vaccine}`
        );
        setDoseLeft(response.data[0].dose_left);
        setDoseTaken(response.data[0].dose_taken);

        const schedule = vaccineSchedule[vaccine];
        if (Array.isArray(schedule)) {
          setDate(
            calculateDate(birthdate, schedule[response.data[0].dose_taken])
          ); // Use dose index
        } else {
          setDate(calculateDate(birthdate, schedule)); // Single dose vaccines
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchChildBirthdate();
    fetchVaccines();
    fetchDefaultDate();
  }, [childId, birthdate]);

  const handleVaccineSelect = async (e) => {
    const vaccineName = e.target.value;
    setSelectedVaccine(vaccineName);

    const selectedOption = e.target.options[e.target.selectedIndex];
    setSelectedVaccineId(selectedOption.dataset.info);

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/dosesTaken/${childId}?vaccine=${vaccineName}`
      );
      setDoseLeft(response.data[0].dose_left);
      setDoseTaken(response.data[0].dose_taken);

      const schedule = vaccineSchedule[vaccineName];
      if (Array.isArray(schedule)) {
        setDate(
          calculateDate(birthdate, schedule[response.data[0].dose_taken])
        ); // Use dose index
      } else {
        setDate(calculateDate(birthdate, schedule)); // Single dose vaccines
      }
    } catch (error) {
      console.error(error);
    }
  };

  const appyUpdate = async () => {
    const isOutOfStock =
      vaccines.find(
        (vaccine) => vaccine.vaccine_id === parseInt(selectedVaccineId, 10)
      )?.stock === 0;

    if (isOutOfStock) {
      Swal.fire({
        icon: "error",
        title: "Out of Stock",
        text: "This vaccine is currently out of stock. Please restock before proceeding.",
        confirmButtonText: "OK",
      });
      return;
    }

    const vaccine = vaccines.find(
      (vaccine) => vaccine.vaccine_id == parseInt(selectedVaccineId, 10)
    );

    try {
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/updateImmunization`,
        {
          childId,
          selectedVaccineId,
          date,
        }
      );
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/updateStock/${
          vaccine.vaccine_id
        }`,
        { stock: vaccine.stock - 1 }
      );
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating immunization:", error);
    }
  };

  const getMaxDate = () => {
    const currentDate = new Date();
    return currentDate.toISOString().split("T")[0];
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

        <div className="mt-4">
          <span>
            Stock:{" "}
            {vaccines.find(
              (vaccine) =>
                vaccine.vaccine_id === parseInt(selectedVaccineId, 10)
            )?.stock ?? 0}
          </span>
        </div>
        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <label>Date: (dd/mm/yyyy)</label>
            <input
              type="date"
              className="w-full px-2 py-3 border-2 rounded-lg"
              value={date}
              min={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-center flex-1">
            <label>Dose Taken: </label>
            {doseLeft !== 0 ? (
              <span className="mt-2 text-center">{doseTaken}</span>
            ) : (
              <span className="mt-2 text-center">
                Recommended Doses Have Been Reached
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-white border-2 border-gray-300 rounded-lg"
          >
            Close
          </button>
          <button
            onClick={appyUpdate}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg"
          >
            Update
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("updateImmuModal")
  );
}
