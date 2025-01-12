import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import ParentDatalist from "./ParentDatalist";

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
  const [isExistingParent, setExistingParent] = useState(false);
  const [motherId, setMotherId] = useState(null);
  const [fatherId, setFatherId] = useState(null);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const addButton = async () => {
    const fullName = `${firstName} ${middleInitial} ${secondName || ""}`.trim();
    const fullAddress = `Zone ${zone || ""}, ${barangay || ""}, ${
      cityTown || ""
    }, ${province || ""}`.trim();

    setName(fullName);
    setAddress(fullAddress);

    // Check if birthdate is valid (not older than one year from the current date)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    if (new Date(birthdate) < oneYearAgo) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Birthdate",
        text: "The birthdate cannot be older than one year from today.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!isExistingParent) {
      // Validation for new parents
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
    } else {
      // Validation for existing parents
      if (
        !fullName ||
        !birthdate ||
        !sex ||
        !placeOfBirth ||
        !fullAddress ||
        !motherId ||
        !fatherId
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
    }

    try {
      let response = "";
      if (!isExistingParent) {
        response = await axios.put(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/addchildinfo`,
          {
            name: fullName,
            birthdate,
            sex,
            placeOfBirth,
            address: fullAddress,
            mother,
            father,
            mothersNo,
            fathersNo,
          }
        );
      } else {
        response = await axios.put(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/addchildinfoexistingparent`,
          {
            name: fullName,
            birthdate,
            sex,
            placeOfBirth,
            address: fullAddress,
            mother_id: motherId,
            father_id: fatherId,
          }
        );
      }
      if (response.data.reloadPage) {
        navigate("/listofchildren");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMaxDate = () => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);

    const formattedMaxDate = currentDate.toISOString().split("T")[0];
    return formattedMaxDate;
  };

  const handleMotherSelect = (id) => {
    setMotherId(id);
  };

  const handleFatherSelect = (id) => {
    setFatherId(id);
  };

  return (
    <section className="w-9/12 h-screen mx-auto">
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
              <label className="font-semibold">Middle Name</label>
              <input
                type="text"
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
              min={new Date(
                new Date().setFullYear(new Date().getFullYear() - 1)
              )
                .toISOString()
                .slice(0, 10)}
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
        <div className="px-5 ml-auto w-fit">
          <input
            className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckDefault"
            onClick={() => setExistingParent(!isExistingParent)}
          />
          <label
            className="inline-block pl-[0.15rem] hover:cursor-pointer"
            htmlFor="flexSwitchCheckDefault"
          >
            Existing Registered Parent
          </label>
        </div>
        {!isExistingParent ? (
          <>
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
                  type="text"
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
                  type="text"
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
          </>
        ) : (
          <ParentDatalist
            onMotherSelect={handleMotherSelect}
            onFatherSelect={handleFatherSelect}
          />
        )}

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
