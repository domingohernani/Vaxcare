import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AddBMI() {
  const { childId } = useParams();
  const [childDetails, setChildDetails] = useState([]);
  const [mother, setMother] = useState("");
  const [father, setFather] = useState("");
  const [weight, setWeight] = useState();
  const [height, setHeight] = useState();

  const navigate = useNavigate();

  const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
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
        // setChildDetails(data[0]);

        setChildDetails(data.childDetails[0]);
        // setParents(data.parentDetails);
        setFather(data.parentDetails[0].name);
        setMother(data.parentDetails[1].name);
      } catch (error) {
        console.log(error);
      }
    };
    fetchChildDetails();
  }, [childId]);

  return (
    <section className="w-9/12 mx-auto">
      <section className="p-3 text-center bg-white border rounded-lg border-C0076BE text-blue-950">
        <p className="text-3xl">Add Body Mass Index </p>
      </section>
      <section className="mt-3 text-gray-400 bg-white border rounded-lg border-C0076BE">
        <div className="px-5 py-4 border-b text border-C0076BE">
          Child’s Information
        </div>
        <div className="flex items-center justify-end gap-2 px-5 my-3 mr-auto">
          <label className="font-semibold">Date</label>
          <input
            type="date"
            className="px-1 py-2 pl-3 text-center bg-white border rounded-lg border-blue-950"
            readOnly
          />
        </div>
        <div className="flex px-5 gap-7">
          <div className="flex flex-col flex-1">
            <label className="font-semibold">Name</label>
            <input
              type="text"
              placeholder="Enter child's name"
              className="px-1 py-2 pl-3 bg-white border rounded-lg border-blue-950"
              value={childDetails.name}
              readOnly
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Birthdate</label>
            <input
              type="date"
              className="px-1 py-2 pl-3 bg-white border rounded-lg border-blue-950"
              value={new Date(childDetails.date_of_birth).toLocaleDateString(
                "en-CA"
              )}
              readOnly
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Age</label>
            <input
              type="number"
              className="px-1 py-2 pl-3 bg-white border rounded-lg border-blue-950"
              value={calculateAge(childDetails.date_of_birth)}
              readOnly
            />
          </div>
        </div>
        <div className="flex px-5 gap-7">
          <div className="flex flex-col flex-1">
            <label className="font-semibold">Sex</label>
            <select
              className="px-1 py-2 pl-3 bg-white border rounded-lg border-blue-950"
              value={childDetails.sex}
              readOnly
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
              placeholder="Enter child's place of birth"
              className="px-1 py-2 pl-3 bg-white border rounded-lg border-blue-950"
              value={childDetails.place_of_birth}
              readOnly
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Contact No.</label>
            <input
              type="number"
              className="px-1 py-2 pl-3 bg-white border rounded-lg border-blue-950"
              value={childDetails.family_number}
              readOnly
            />
          </div>
        </div>
        <div className="flex flex-col px-5">
          <label className="font-semibold">Address</label>
          <input
            type="text"
            placeholder="Enter child address"
            className="px-1 py-2 pl-3 bg-white border rounded-lg border-blue-950"
            value={childDetails.address}
            readOnly
          />
        </div>
        <div className="flex gap-5 px-5">
          <div className="flex flex-col flex-1">
            <label className="font-semibold">Mother's Name</label>
            <input
              type="text"
              className="px-1 py-2 pl-3 bg-white border rounded-lg border-blue-950"
              value={mother}
              readOnly
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="font-semibold">Father's Name</label>
            <input
              type="text"
              className="px-1 py-2 pl-3 bg-white border rounded-lg border-blue-950"
              value={father}
              readOnly
            />
          </div>
        </div>
        <div className="flex w-4/6 gap-5 mx-auto mt-3 text-black">
          <div className="flex flex-col flex-1">
            <label className="font-semibold">Weight</label>
            <div className="flex">
              <input
                type="number"
                className="px-1 py-2 pl-3 bg-white border rounded-l-lg border-blue-950"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <span className="flex items-center justify-center px-3 pl-3 border rounded-r-lg border-blue-950">
                KG
              </span>
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <label className="font-semibold ">Height</label>
            <div className="flex">
              <input
                type="number"
                className="px-1 py-2 pl-3 bg-white border rounded-l-lg border-blue-950"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
              <span className="flex items-center justify-center px-3 pl-3 border rounded-r-lg border-blue-950">
                CM
              </span>
            </div>
          </div>
        </div>
        <div className="flex w-3/6 mx-auto mt-5 mb-8 gap-9">
          <button
            className="flex-1 text-white"
            onClick={async () => {
              if (!weight || !height) {
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
                const response = await axios.post(
                  `http://localhost:8800/addBMIRecord/${childId}`,
                  {
                    childId,
                    weight,
                    height,
                    currentDate: new Date().toISOString().split("T")[0],
                  }
                );

                console.log(response);
              } catch (error) {
                console.error("Error during login:", error.message);
              }

              navigate(`/viewbmitracking/${childId}`);
            }}
          >
            Add
          </button>
          <button
            className="flex-1 text-gray-500 bg-CEDEDED border-blue-950"
            onClick={() => {
              navigate(`/viewbmitracking/${childId}`);
            }}
          >
            Cancel
          </button>
        </div>
      </section>
    </section>
  );
}
