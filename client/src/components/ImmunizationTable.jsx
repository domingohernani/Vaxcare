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
          `http://localhost:8800/viewbmitracking/${childId}`
        );
        setChildDetails(response.data.childDetails[0]);

        const vaccineResponse = await axios.get(
          `http://localhost:8800/getChildImmunization/${childId}`
        );
        setVaccines(vaccineResponse.data || {});
      } catch (error) {
        console.error(error);
      }
    };
    fetchChildData();
  }, [childId]);

  const handleVaccineDateChange = (vaccineName, doseIndex, date) => {
    setUpdateVaccines((prev) => ({
      ...prev,
      [vaccineName]: {
        ...prev[vaccineName],
        [doseIndex]: date,
      },
    }));
  };

  const formatDateForInput = (serverDate) => {
    const date = new Date(serverDate);
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const updateRecord = () => {
    setUpdateButtonClicked(!updateButtonClicked);
  };

  if (!childDetails) {
    return <p>Loading child details...</p>;
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
            onClick={updateRecord}
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
          <span className="font-bold">{childDetails.age}</span>
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
      <div className="grid grid-cols-4 p-4 text-xs font-semibold text-center bg-white rounded-md md:text-sm gap-x-4 gap-y-3">
        <div className="p-3 text-white bg-gray-500 rounded-md">Vaccine</div>
        <div className="p-3 text-white bg-gray-500 rounded-md">
          Required Doses
        </div>
        <div className="p-3 text-white bg-gray-500 rounded-md">
          Date Administered
        </div>
        <div className="p-3 text-white bg-gray-500 rounded-md">Remarks</div>

        {Object.keys(vaccines).length > 0 ? (
          Object.keys(vaccines).map((vaccineName) => (
            <React.Fragment key={vaccineName}>
              <div className="p-3 bg-gray-100 rounded-md">{vaccineName}</div>
              <div className="p-3 bg-gray-100 rounded-md">
                {vaccines[vaccineName]?.dosesTaken} of{" "}
                {vaccines[vaccineName]?.dosesRequired}
              </div>
              <div className="p-3 bg-gray-100 rounded-md">
                {vaccines[vaccineName]?.administeredDates?.map(
                  (date, index) => (
                    <p>{new Date(date).toISOString().split("T")[0]}</p>
                  )
                )}
              </div>
              <div className="p-3 text-xs bg-gray-100 rounded-md sm:text-sm">
                {vaccines[vaccineName]?.dosesTaken ===
                vaccines[vaccineName]?.dosesRequired
                  ? "Vaccinated"
                  : "On process"}
              </div>
            </React.Fragment>
          ))
        ) : (
          <div className="col-span-4 p-3 text-center">
            No vaccine data available
          </div>
        )}
      </div>
    </section>
  );
}
