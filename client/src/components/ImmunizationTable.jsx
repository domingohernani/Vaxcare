import React, { useEffect, useState } from "react";
import axios from "axios";
import editIcon from "../assets/bmitrackingassets/editIcon.svg";
import applyIcon from "../assets/bmitrackingassets/applyIcon.svg";
import cancelIcon from "../assets/bmitrackingassets/cancelIcon.svg";
import UpdateImmunizationModal from "./modals/UpdateImmunizationModal";
import EditImmunizationModal from "./modals/EditImmunizationModal";

export default function ImmunizationTable({ childId }) {
  const [updateButtonClicked, setUpdateButtonClicked] = useState(false);
  const [updateImmuModal, setUpdateImmuModal] = useState(false);
  const [editImmuModal, setEditImmuModal] = useState(false);
  const [childDetails, setChildDetails] = useState({});
  const [vaccines, setVaccines] = useState({});

  const triggerUpdate = () => setUpdateImmuModal(!updateImmuModal);
  const triggerEdit = () => setEditImmuModal(!editImmuModal);

  // Fetch data
  useEffect(() => {
    const fetchChildData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/viewbmitracking/${childId}`
        );

        setChildDetails(response.data.childDetails[0]);

        const vaccineResponse = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/getChildImmunization/${childId}`
        );

        setVaccines(vaccineResponse.data || {});
      } catch (error) {
        console.error(error);
      }
    };
    fetchChildData();
  }, [childId]);

  const formatDate = (dateString) => {
    if (!dateString) return "On-going";
    const date = new Date(dateString);
    if (isNaN(date)) return "On-going";
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  if (!childDetails || !vaccines) {
    return <p>Loading immunization data...</p>;
  }

  return (
    <section>
      {updateImmuModal && (
        <UpdateImmunizationModal onClose={triggerUpdate} childId={childId} />
      )}
      {editImmuModal && (
        <EditImmunizationModal onClose={triggerEdit} childId={childId} />
      )}

      <div className="grid grid-cols-4 gap-4 px-5 py-3 mb-3 text-xs bg-white rounded-lg sm:text-sm">
        <span className="col-start-1 col-end-4 font-light">
          ID: VXCR{childDetails.child_id}
        </span>
        <span className="flex items-center justify-end col-start-4 col-end-4 gap-2 font-light opacity-0 ">
          {updateButtonClicked ? (
            <>
              <img
                src={applyIcon}
                alt="icon"
                width={"20px"}
                className="cursor-pointer"
                title="Apply changes"
                onClick={() => applyChanges(childDetails.child_id)}
              />
              <img
                src={cancelIcon}
                alt="icon"
                width={"20px"}
                className="cursor-pointer"
                title="Cancel changes"
                onClick={() => setUpdateButtonClicked(false)}
              />
            </>
          ) : null}
          <img
            src={editIcon}
            alt="icon"
            width={"18px"}
            className="cursor-pointer"
          />
        </span>
        <div className="flex flex-col ">
          <span>Name</span>
          {updateButtonClicked ? (
            <input
              type="text"
              placeholder={childDetails.name}
              className="p-1 font-bold border border-black"
              value={childDetails.name}
              onChange={(e) =>
                setChildDetails({
                  ...childDetails,
                  name: e.target.value,
                })
              }
            />
          ) : (
            <span className="font-bold">{childDetails.name}</span>
          )}
        </div>
        <div className="flex flex-col">
          <span>Age</span>
          <span className="font-bold">
            {(() => {
              const ageInMonths = childDetails.age;
              if (ageInMonths >= 12) {
                const years = Math.floor(ageInMonths / 12);
                const months = ageInMonths % 12;
                return months > 0
                  ? `${years} year/s & ${months} month/s`
                  : `${years} year/s`;
              }
              return `${ageInMonths} month/s`;
            })()}
          </span>
        </div>
        <div className="flex flex-col">
          <span>Gender</span>
          {updateButtonClicked ? (
            <select
              className="p-1 font-bold border border-black"
              value={childDetails.sex}
              onChange={(e) =>
                setChildDetails({
                  ...childDetails,
                  sex: e.target.value,
                })
              }
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <span className="font-bold">{childDetails.sex}</span>
          )}
        </div>
        <div className="flex flex-col">
          <span>Birthdate</span>
          {updateButtonClicked ? (
            <input
              type="date"
              className="p-1 font-bold border border-black"
              value={formatDateForInput(childDetails.date_of_birth)}
              onChange={(e) => {
                setChildDetails({
                  ...childDetails,
                  date_of_birth: e.target.value,
                });
              }}
            />
          ) : (
            <span className="font-bold">{childDetails.date_of_birth}</span>
          )}
        </div>
        <div className="flex flex-col col-span-2">
          <span>Place of birth</span>
          {updateButtonClicked ? (
            <input
              type="text"
              placeholder={childDetails.place_of_birth}
              className="p-1 font-bold border border-black"
              value={childDetails.place_of_birth}
              onChange={(e) =>
                setChildDetails({
                  ...childDetails,
                  place_of_birth: e.target.value,
                })
              }
            />
          ) : (
            <span className="font-bold">{childDetails.place_of_birth}</span>
          )}
        </div>
        <div className="flex flex-col col-span-2 col-start-3">
          <span>Address</span>
          {updateButtonClicked ? (
            <input
              type="text"
              placeholder={childDetails.address}
              className="p-1 font-bold border border-black"
              value={childDetails.address}
              onChange={(e) =>
                setChildDetails({
                  ...childDetails,
                  address: e.target.value,
                })
              }
            />
          ) : (
            <span className="font-bold">{childDetails.address}</span>
          )}
        </div>
      </div>

      {/* Vaccine Table */}
      <div className="p-4 bg-white rounded-md">
        {/* Table Headers */}
        <div className="grid grid-cols-6 gap-2 text-sm font-semibold text-center">
          <div className="p-3 text-white bg-gray-500 rounded-md">Vaccines</div>
          <div className="p-3 text-white bg-red-500 rounded-md">1st Dose</div>
          <div className="p-3 text-white bg-yellow-500 rounded-md">
            2nd Dose
          </div>
          <div className="p-3 text-white bg-green-500 rounded-md">3rd Dose</div>
          <div className="p-3 text-white bg-blue-500 rounded-md">
            4th Dose (Booster 1)
          </div>
          <div className="p-3 text-white bg-indigo-500 rounded-md">
            5th Dose (Booster 2)
          </div>
        </div>

        {/* Vaccine Rows */}
        {Object.keys(vaccines).length > 0 ? (
          Object.keys(vaccines).map((vaccineName) => (
            <div
              key={vaccineName}
              className="grid grid-cols-6 gap-2 mt-2 text-sm text-center"
            >
              {/* Vaccine Name */}
              <div className="p-3 bg-gray-100 rounded-md">{vaccineName}</div>

              {/* Doses */}
              {[...Array(5)].map((_, doseIndex) => (
                <div
                  key={doseIndex}
                  className={`p-3 rounded-md ${
                    vaccines[vaccineName]?.administeredDates?.[doseIndex]
                      ? "bg-green-200 text-green-700 font-bold"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {vaccines[vaccineName]?.administeredDates?.[doseIndex]
                    ? formatDate(
                        vaccines[vaccineName]?.administeredDates?.[doseIndex]
                      )
                    : "On-going"}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="mt-4 text-center">No vaccine data available</div>
        )}
      </div>
    </section>
  );
}
