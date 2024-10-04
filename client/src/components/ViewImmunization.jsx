import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import editIcon from "../assets/bmitrackingassets/editIcon.svg";
import applyIcon from "../assets/bmitrackingassets/applyIcon.svg";
import cancelIcon from "../assets/bmitrackingassets/cancelIcon.svg";
import UpdateImmunizationModal from "./modals/UpdateImmunizationModal";
import EditImmunizationModal from "./modals/EditImmunizationModal";

export default function ViewImmunization() {
  const { childId } = useParams();
  const [updateButtonClicked, setUpdateButtonClicked] = useState(false);
  const [updateImmuModal, setUpdateImmuModal] = useState(false);
  const [editImmuModal, setEditImmuModal] = useState(false);
  const [childDetails, setChildDetails] = useState({});
  const [vaccines, setVaccines] = useState({}); // Initialize as an empty object
  const [updateVaccines, setUpdateVaccines] = useState({});

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

  const applyChanges = async (childID) => {
    try {
      const response = await axios.put(
        "http://localhost:8800/updateChildDetailsFromImmu",
        {
          ...childDetails,
          birthdate: formatDateForInput(childDetails.date_of_birth),
          childID,
        }
      );
      if (response.data.reloadPage) {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
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

  return (
    <section>
      {updateImmuModal && (
        <UpdateImmunizationModal onClose={triggerUpdate} childId={childId} />
      )}
      {editImmuModal && (
        <EditImmunizationModal onClose={triggerEdit} childId={childId} />
      )}

      <div className="flex items-center justify-between mb-3">
        <h3 className="px-6 py-2 font-semibold bg-white rounded-lg w-fit">
          Child Immunization Records
        </h3>
        <div className="flex gap-4">
          <button
            className="flex items-center justify-center gap-2 px-6 text-white"
            onClick={triggerUpdate}
          >
            <img src={editIcon} alt="edit icon" width={"18px"} />
            <span>Update Record</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 px-5 py-3 mb-3 bg-white rounded-lg">
        <span className="col-start-1 col-end-4 font-light">
          ID: VXCR-UR-{childDetails.child_id}
        </span>
        <span className="flex items-center justify-end col-start-4 col-end-4 gap-2 font-light ">
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
              className="font-bold"
              value={name}
              onChange={(e) => setName(capitalizeAfterSpace(e.target.value))}
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
            <input
              type="text"
              // placeholder={childDetails.sex}
              className="font-bold"
              // value={gender}
              // onChange={(e) => setGender(capitalizeAfterSpace(e.target.value))}
            />
          ) : (
            <span className="font-bold">{childDetails.sex}</span>
          )}
        </div>
        <div className="flex flex-col">
          <span>Birthdate</span>
          {updateButtonClicked ? (
            // <input
            //   type="date"
            //   // value={birthdate}
            //   value={birthdate}
            //   onChange={(e) => {
            //     formatDateForInput(e.target.value);
            //     setBirthdate(e.target.value);
            //   }}
            // />
            <span className="font-bold">{childDetails.date_of_birth}</span>
          ) : (
            <span className="font-bold">{childDetails.date_of_birth}</span>
          )}
        </div>
        <div className="flex flex-col col-span-2">
          <span>Place of birth</span>
          {updateButtonClicked ? (
            <input
              type="text"
              // placeholder={childDetails.place_of_birth}
              className="font-bold"
              // value={placeofbirth}
              // onChange={(e) =>
              //   setPlaceofbirth(capitalizeAfterSpace(e.target.value))
              // }
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
              className="font-bold"
              // placeholder={childDetails.address}
              // value={address}
              // onChange={(e) => setAddress(capitalizeAfterSpace(e.target.value))}
            />
          ) : (
            // <span className="font-bold">{childDetails.address}</span>
            <span className="font-bold">Address</span>
          )}
        </div>
        <div className="flex flex-col">
          <span>Mother's Name</span>
          {updateButtonClicked ? (
            <input
              type="text"
              className="font-bold"
              // placeholder={childDetails.mother}
              // value={mothersname}
              // onChange={(e) =>
              //   setMothersname(capitalizeAfterSpace(e.target.value))
              // }
            />
          ) : (
            <span className="font-bold">{childDetails.mother}</span>
          )}
        </div>
        <div className="flex flex-col">
          <span>Mother's No.</span>
          {updateButtonClicked ? (
            <input
              type="text"
              className="font-bold"
              placeholder={childDetails.mother_phoneNo}
              // value={mothersNo}
              maxLength="11"
              pattern="[0-9]*"
              onChange={(e) => {
                e.target.value = e.target.value
                  .replace(/[^0-9]/g, "")
                  .slice(0, 11);
                setMothersNo(e.target.value);
              }}
            />
          ) : (
            <span className="font-bold">{childDetails.mother_phoneNo}</span>
          )}
        </div>
        <div className="flex flex-col">
          <span>Father's Name</span>
          {updateButtonClicked ? (
            <input
              type="text"
              className="font-bold"
              placeholder={childDetails.father}
              // value={fathersname}
              onChange={(e) =>
                setFathersname(capitalizeAfterSpace(e.target.value))
              }
            />
          ) : (
            <span className="font-bold">{childDetails.father}</span>
          )}
        </div>
        <div className="flex flex-col">
          <span>Father's No.</span>
          {updateButtonClicked ? (
            <input
              type="text"
              className="font-bold"
              placeholder={childDetails.father_phoneNo}
              // value={fathersNo}
              maxLength="11"
              pattern="[0-9]*"
              onChange={(e) => {
                e.target.value = e.target.value
                  .replace(/[^0-9]/g, "")
                  .slice(0, 11);
                setFathersNo(e.target.value); // Corrected from setMothersNo to setFathersNo
              }}
            />
          ) : (
            <span className="font-bold">{childDetails.father_phoneNo}</span>
          )}
        </div>

        {/* <div className="">
          <span>Status: </span>
          {showStatusTag(childDetails.status)}
          <span>{childDetails.status}</span>
        </div> */}
      </div>

      {/* Vaccine Table */}
      <div className="grid grid-cols-4 p-4 text-sm font-semibold text-center bg-white rounded-md gap-x-4 gap-y-3">
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
                {vaccines[vaccineName].dosesTaken} of{" "}
                {vaccines[vaccineName].dosesRequired}
              </div>
              <div className="p-3 bg-gray-100 rounded-md">
                {vaccines[vaccineName].administeredDates.map((date, index) => (
                  <input
                    key={index}
                    type="date"
                    value={new Date(date).toISOString().split("T")[0]}
                    onChange={(e) =>
                      handleVaccineDateChange(
                        vaccineName,
                        index,
                        e.target.value
                      )
                    }
                    className="w-full text-center rounded-md"
                  />
                ))}
              </div>
              <div className="p-3 bg-gray-100 rounded-md">
                {vaccines[vaccineName].dosesTaken ===
                vaccines[vaccineName].dosesRequired
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
