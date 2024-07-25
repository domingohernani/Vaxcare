import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AddMedicalHistory() {
  const { childId } = useParams();
  const navigate = useNavigate();

  const [childDetails, setChildDetails] = useState({});

  const [heartrate, setHeartRate] = useState("");
  const [allergies, setAllergies] = useState("");
  const [temperature, setTemperature] = useState("");
  const [coughValue, setCoughValue] = useState("");
  const [coldsValue, setColdsValue] = useState("");

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  useEffect(() => {
    const fetchChildDetails = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8800/viewbmitracking/addbmi/${childId}`
        );
        setChildDetails(data.childDetails[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchChildDetails();
  }, [childDetails]);

  const addButton = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8800/addHistoryAndRecord`,
        {
          childId,
          heartrate,
          allergies,
          temperature,
          coldsValue,
          coughValue,
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }

    navigate("/viewbmitracking/" + childId);
  };

  return (
    <section className="w-9/12 mx-auto">
      <section className="p-3 text-center bg-white border rounded-lg border-C0076BE text-blue-950">
        <p className="text-3xl">Medical History Child Information Form</p>
        <p>
          Please provide the child's information below, so we can include it in
          the Medical History and Record
        </p>
      </section>
      <section className="mt-3 text-gray-400 bg-white border rounded-lg border-C0076BE">
        <div className="px-5 py-4 text-black border-b border-C0076BE">
          Child’s Information
        </div>
        <div className="flex items-center justify-end gap-2 px-5 my-3 mr-auto text-black">
          <label className="font-semibold">Date</label>
          <input
            type="date"
            className="px-1 py-2 pl-3 text-center bg-white border rounded-lg border-blue-950"
            value={getCurrentDate()}
          />
        </div>
        <div className="flex px-5 gap-7">
          <div className="flex flex-col flex-1">
            <label className="font-semibold text-black">Name</label>
            <input
              type="text"
              placeholder="Enter child's name"
              className="px-1 py-2 pl-3 bg-white border border-none rounded-lg"
              readOnly
              value={childDetails.name}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-black">Birthdate</label>
            <input
              type="date"
              className="px-1 py-2 pl-3 bg-white border border-none rounded-lg"
              readOnly
              value={new Date(childDetails.date_of_birth).toLocaleDateString(
                "en-CA"
              )}
            />
          </div>
          <div className="flex flex-col w-1/6">
            <label className="font-semibold text-black">Age</label>
            <input
              type="number"
              className="px-1 py-2 pl-3 bg-white border border-none rounded-lg "
              readOnly
              value={calculateAge(childDetails.date_of_birth)}
            />
          </div>
          <div className="flex flex-col flex-1 text-left ">
            <label className="font-semibold text-black">Sex</label>
            <select
              className="px-1 py-2 pl-3 text-left bg-white border border-none rounded-lg text first-line:"
              value={childDetails.sex}
            >
              <option value="Male" key="male">
                Male
              </option>
              <option value="Female" key="female">
                Female
              </option>
            </select>
          </div>
        </div>
        <div className="flex px-5 gap-7">
          <div className="flex flex-col flex-1">
            <label className="font-semibold text-black">Place of birth</label>
            <input
              type="text"
              placeholder="Enter child's place of birth"
              className="px-1 py-2 pl-3 text-center bg-white border border-none rounded-lg"
              readOnly
              value={childDetails.place_of_birth}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-black">Contact No.</label>
            <input
              type="number"
              className="px-1 py-2 pl-3 text-center bg-white border border-none rounded-lg"
              readOnly
              value={childDetails.family_number}
            />
          </div>
        </div>
        <div className="flex ">
          <div className="flex flex-col flex-1 px-5">
            <label className="font-semibold text-black">Address</label>
            <input
              type="text"
              placeholder="Enter child address"
              className="px-1 py-2 pl-3 text-center bg-white border border-none rounded-lg"
              readOnly
              value={childDetails.address}
            />
          </div>
          <div className="flex flex-col px-5">
            <label className="font-semibold text-black">Status</label>
            <input
              type="text"
              placeholder="Enter child address"
              className="px-1 py-2 pl-3 text-center bg-white border border-none rounded-lg"
              value={childDetails.status}
            />
          </div>
        </div>
        <div className="flex gap-5 px-5">
          <div className="flex flex-col ">
            <label className="font-semibold text-black">Heart Rate: </label>
            <input
              type="number"
              className="px-1 py-2 pl-3 text-black bg-white border rounded-lg border-blue-950"
              value={heartrate}
              onChange={(e) => setHeartRate(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="font-semibold text-black">Allergies: </label>
            <input
              type="text"
              className="px-1 py-2 pl-3 text-black bg-white border rounded-lg border-blue-950"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col ">
            <label className="font-semibold text-black">
              Temperature: (°C){" "}
            </label>
            <input
              type="text"
              className="px-1 py-2 pl-3 text-black bg-white border rounded-lg border-blue-950"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
            />
          </div>
        </div>
        <div className="flex w-4/6 gap-5 mx-auto mt-3 text-black">
          <div className="flex-1 text-center ">
            <span className="block ">Cough:</span>
            <span className="mx-2">
              <label htmlFor="coughYes">Yes</label>
              <input
                type="radio"
                id="coughYes"
                name="cough"
                value="Yes"
                className="ml-1"
                onChange={(e) => setCoughValue(e.target.value)}
                checked={coughValue === "Yes"}
              />
            </span>
            <span className="mx-2">
              <label htmlFor="coughNo">No</label>
              <input
                type="radio"
                id="coughNo"
                name="cough"
                value="No"
                className="ml-1"
                onChange={(e) => setCoughValue(e.target.value)}
                checked={coughValue === "No"}
              />
            </span>
          </div>
          <div className="flex-1 text-center ">
            <span className="block">Colds:</span>
            <span className="mx-2">
              <label htmlFor="coldsYes">Yes</label>
              <input
                type="radio"
                id="coldsYes"
                name="cold"
                value="Yes"
                className="ml-1"
                onChange={(e) => setColdsValue(e.target.value)}
                checked={coldsValue === "Yes"}
              />
            </span>

            <span className="mx-2">
              <label htmlFor="coldsNo">No</label>
              <input
                type="radio"
                id="coldsNo"
                name="cold"
                value="No"
                className="ml-1"
                onChange={(e) => setColdsValue(e.target.value)}
                checked={coldsValue === "No"}
              />
            </span>
          </div>
        </div>
        <div className="flex w-3/6 mx-auto mt-5 mb-8 gap-9">
          <button className="flex-1 text-white" onClick={addButton}>
            Add
          </button>
          <button
            className="flex-1 text-gray-500 bg-CEDEDED border-blue-950"
            onClick={() => {
              navigate("/viewbmitracking/" + childId);
            }}
          >
            Cancel
          </button>
        </div>
      </section>
    </section>
  );
}
