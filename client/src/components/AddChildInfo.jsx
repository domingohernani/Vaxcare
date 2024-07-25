import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

export default function AddChildInfo() {
  const navigate = useNavigate();

  // Value na kailangan i-aadd sa database
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState(Date());
  const [sex, setSex] = useState("Male");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [number, setNumber] = useState(0);
  const [address, setAddress] = useState("");
  const [mother, setMother] = useState("");
  const [father, setFather] = useState("");

  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");

  const [zone, setZone] = useState("");
  const [barangay, setBarangay] = useState("");
  const [cityTown, setCityTown] = useState("");
  const [province, setProvince] = useState("");

  const [mothersNo, setMothersNo] = useState("");
  const [fathersNo, setFathersNo] = useState("");

  console.log("AddBMITracking was rendered");

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const addButton = async () => {
    const fullName = `${firstName} ${middleInitial}. ${
      secondName || ""
    }`.trim();
    const fullAddress = `Zone ${zone || ""}, ${barangay || ""}, ${
      cityTown || ""
    }, ${province || ""}`.trim();

    setName(fullName);
    setAddress(fullAddress);

    if (
      !fullName ||
      !mothersNo ||
      !fathersNo ||
      !birthdate ||
      !sex ||
      !placeOfBirth ||
      !fullAddress ||
      !mother ||
      !father
    ) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill in all the required fields before submitting the form.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8800/addchildinfo`, {
        name: fullName,
        birthdate,
        sex,
        placeOfBirth,
        address: fullAddress,
        mother,
        father,
        mothersNo,
        fathersNo,
      });
      console.log(response);
      if (response.data.reloadPage) {
        navigate("/listofchildren");
      }
    } catch (error) {
      console.log(error);
    }

    console.log("Name:", fullName);
    console.log("Birthdate:", birthdate);
    console.log("Sex:", sex);
    console.log("Place of Birth:", placeOfBirth);
    console.log("Number:", number);
    console.log("Address:", fullAddress);
    console.log("Mother:", mother);
    console.log("Father:", father);
  };

  const getMaxDate = () => {
    const currentDate = new Date();

    // Format the date to be compatible with the "date" input type
    const formattedMaxDate = currentDate.toISOString().split("T")[0];
    return formattedMaxDate;
  };

  return (
    <section className="w-9/12 mx-auto ">
      <section className="p-3 text-center bg-white border border-C0076BE text-blue-950">
        <p className="text-3xl">Child Information Form</p>
        <p>Please provide the child's information below</p>
      </section>
      <section className="mt-3 bg-white border border-C0076BE">
        <div className="px-5 py-4 border-b border-C0076BE">
          Child's Information
        </div>
        <div className="flex items-center justify-end gap-2 px-5 my-3 mr-auto ">
          <label className="font-semibold">Date</label>
          <input
            type="date"
            className="px-1 py-2 pl-3 text-center bg-white border border-blue-950"
            value={getCurrentDate()}
            readOnly
          />
        </div>
        <div className="flex px-5 gap-7">
          <div className="flex flex-1 gap-5">
            <div className="flex-2">
              <label className="font-semibold">First name</label>
              <input
                type="text"
                value={firstName}
                className="w-full px-1 py-2 pl-3 bg-white border border-blue-950"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="flex-2">
              <label className="font-semibold">Last name</label>
              <input
                type="text"
                value={secondName}
                className="w-full px-1 py-2 pl-3 bg-white border border-blue-950"
                onChange={(e) => setSecondName(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="font-semibold">Middle Initial</label>
              <input
                type="text"
                maxLength="1"
                value={middleInitial}
                className="w-full px-1 py-2 pl-3 bg-white border border-blue-950"
                onChange={(e) => setMiddleInitial(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex px-5 gap-7">
          <div className="flex flex-col flex-1">
            <label className="font-semibold">Birthdate</label>
            <input
              type="date"
              className="px-1 py-2 pl-3 bg-white border border-blue-950"
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                const formattedDate = selectedDate.toISOString().slice(0, 10);
                setBirthdate(formattedDate);
              }}
              max={getMaxDate()}
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="font-semibold">Sex</label>
            <select
              className="px-1 py-2 pl-3 bg-white border border-blue-950"
              onChange={(e) => setSex(e.target.value)}
            >
              <option value="Male" key="male">
                Male
              </option>
              <option value="Female" key="female">
                Female
              </option>
            </select>
          </div>
          <div className="flex flex-col flex-1">
            <label className="font-semibold">Place of birth</label>
            <input
              type="text"
              className="px-1 py-2 pl-3 bg-white border border-blue-950"
              onChange={(e) => setPlaceOfBirth(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-5 px-5">
          <div className="flex flex-col w-20">
            <label className="font-semibold">Zone</label>
            <input
              type="number"
              className="px-1 py-2 pl-3 bg-white border border-blue-950"
              onChange={(e) => setZone(e.target.value)}
              value={zone}
            />
          </div>
          <div className="flex flex-col ">
            <label className="font-semibold">Barangay</label>
            <input
              type="text"
              className="px-1 py-2 pl-3 bg-white border border-blue-950"
              onChange={(e) => setBarangay(e.target.value)}
              value={barangay}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">City/Town</label>
            <input
              type="text"
              className="px-1 py-2 pl-3 bg-white border border-blue-950"
              onChange={(e) => setCityTown(e.target.value)}
              value={cityTown}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Province</label>
            <input
              type="text"
              className="px-1 py-2 pl-3 bg-white border border-blue-950"
              onChange={(e) => setProvince(e.target.value)}
              value={province}
            />
          </div>
        </div>
        <div className="flex gap-5 px-5">
          <div className="flex flex-col flex-1">
            <label className="font-semibold">Mother's Name</label>
            <input
              type="text"
              className="px-1 py-2 pl-3 bg-white border border-blue-950"
              onChange={(e) => setMother(e.target.value)}
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="font-semibold">Father's Name</label>
            <input
              type="text"
              className="px-1 py-2 pl-3 bg-white border border-blue-950"
              onChange={(e) => setFather(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-5 px-5">
          <div className="flex flex-col flex-1">
            <label className="font-semibold">Mother's No.</label>
            <input
              type="number"
              placeholder="eg: 09123456789"
              className="px-1 py-2 pl-3 bg-white border border-blue-950"
              onInput={(e) => {
                e.target.value = e.target.value
                  .replace(/[^0-9]/g, "")
                  .slice(0, 11);
              }}
              value={mothersNo}
              onChange={(e) => setMothersNo(e.target.value)}
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="font-semibold">Father's No.</label>
            <input
              type="number"
              placeholder="eg: 09123456789"
              className="px-1 py-2 pl-3 bg-white border border-blue-950"
              maxLength="11"
              onInput={(e) => {
                e.target.value = e.target.value
                  .replace(/[^0-9]/g, "")
                  .slice(0, 11);
              }}
              value={fathersNo}
              onChange={(e) => setFathersNo(e.target.value)}
            />
          </div>
        </div>

        <div className="flex w-3/6 mx-auto mt-5 mb-8 gap-9">
          <button
            className="flex-1 bg-white rounded-none border-blue-950"
            onClick={() => {
              navigate("/listofchildren");
            }}
          >
            Cancel
          </button>
          <button
            className="flex-1 text-white rounded-none"
            onClick={addButton}
          >
            Add
          </button>
        </div>
      </section>
    </section>
  );
}
