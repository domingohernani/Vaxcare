import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import editIcon from "../assets/bmitrackingassets/editIcon.svg";
import applyIcon from "../assets/bmitrackingassets/applyIcon.svg";
import cancelIcon from "../assets/bmitrackingassets/cancelIcon.svg";
import UpdateImmunizationModal from "./modals/UpdateImmunizationModal";
import EditImmunizationModal from "./modals/EditImmunizationModal";
import Swal from "sweetalert2";

export default function ViewImmunization() {
  const { childId } = useParams();
  const [updateButtonClicked, setUpdateButtonClicked] = useState(false);
  const [updateImmuModal, setUpdateImmuModal] = useState(false);
  const [editImmuModal, setEditImmuModal] = useState(false);
  const [childDetails, setChildDetails] = useState({});
  const [vaccines, setVaccines] = useState({});
  const [updateVaccines, setUpdateVaccines] = useState({});

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
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/updateChildDetailsFromImmu`,
        {
          ...childDetails,
          birthdate: formatDateForInput(childDetails.date_of_birth),
          childID,
          mother_id: childDetails.mother_id,
          father_id: childDetails.father_id,
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

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (isNaN(date)) return dateString;

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };

  const triggerComplete = async (childId, newStatus) => {
    // Show confirmation dialog
    Swal.fire({
      title: `Are you sure you want to mark as "${newStatus}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, mark it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.put(
            `${
              import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
            }/updateStatus/${childId}`,
            { status: newStatus }
          );

          if (response.status === 200) {
            Swal.fire({
              title: "Updated!",
              text: "Status has been updated successfully.",
              icon: "success",
            });
          } else {
            Swal.fire({
              title: "Failed!",
              text: `Failed to update status: ${response.data.error}`,
              icon: "error",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "An error occurred while updating the status.",
            icon: "error",
          });
          console.error("Error during status update:", error);
        }
      }
    });
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
            className="flex items-center justify-center gap-2 px-6 text-black bg-gray-300"
            onClick={() => {
              {
                childDetails.status === "Underimmunization"
                  ? triggerComplete(childDetails.child_id, "Completed")
                  : triggerComplete(childDetails.child_id, "Underimmunization");
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="Layer_1"
              data-name="Layer 1"
              className="w-5 h-5"
              viewBox="0 0 24 24"
            >
              <path d="M1.098,6.981c.29-.631,.639-1.241,1.036-1.813,.313-.453,.938-.567,1.392-.251,.453,.314,.566,.938,.251,1.392-.33,.477-.62,.984-.862,1.509-.169,.366-.53,.582-.909,.582-.14,0-.282-.029-.417-.092-.502-.231-.722-.825-.49-1.326Zm4.54-2.956c.2,0,.402-.06,.578-.185,.473-.336,.978-.632,1.5-.88,.499-.236,.712-.833,.475-1.332-.236-.498-.833-.71-1.332-.475-.628,.298-1.233,.653-1.801,1.056-.45,.319-.556,.944-.236,1.395,.195,.274,.503,.421,.816,.421Zm-2.688,12.233c-.233-.499-.827-.716-1.33-.48-.5,.234-.715,.83-.48,1.33,.294,.627,.647,1.234,1.052,1.806,.194,.275,.504,.423,.817,.423,.199,0,.401-.06,.576-.184,.451-.318,.559-.942,.239-1.394-.336-.476-.63-.98-.874-1.501Zm-.909-3.347c-.027-.299-.042-.603-.041-.912,0-.278,.012-.554,.034-.827,.047-.55-.361-1.034-.912-1.08-.538-.056-1.033,.362-1.08,.912-.028,.328-.042,.66-.042,.992,0,.371,.016,.737,.049,1.099,.048,.519,.483,.908,.995,.908,.03,0,.062,0,.093-.004,.55-.051,.954-.537,.904-1.088ZM11,2.045c.029,0,.693-.045,1-.045s.971,.045,1,.045c.513,0,.949-.392,.995-.911,.049-.551-.357-1.036-.907-1.085-.358-.032-.721-.049-1.088-.049s-.729,.017-1.088,.049c-.55,.049-.956,.534-.907,1.085,.046,.52,.482,.911,.995,.911Zm5.259,.905c.522,.245,1.027,.54,1.502,.875,.176,.124,.377,.184,.576,.184,.313,0,.623-.147,.817-.423,.319-.451,.212-1.075-.239-1.394-.569-.403-1.177-.757-1.805-1.053-.5-.234-1.096-.021-1.331,.479-.234,.5-.021,1.096,.479,1.331Zm1.478,17.242c-.475,.333-.981,.626-1.506,.872-.5,.233-.716,.829-.481,1.329,.17,.363,.53,.576,.906,.576,.142,0,.286-.03,.423-.095,.63-.294,1.237-.646,1.807-1.046,.452-.317,.562-.94,.244-1.393-.316-.452-.939-.563-1.393-.244Zm4.656-4.44c-.5-.235-1.096-.019-1.329,.481-.246,.524-.539,1.031-.872,1.506-.317,.452-.208,1.075,.244,1.393,.175,.123,.375,.182,.573,.182,.315,0,.625-.148,.819-.426,.399-.569,.752-1.177,1.046-1.807,.234-.5,.019-1.096-.481-1.329Zm.483-5.688c-.55,.047-.958,.53-.911,1.081,.023,.28,.036,.564,.035,.855,0,.3-.014,.597-.038,.889-.047,.55,.36,1.034,.911,1.081,.029,.003,.058,.004,.086,.004,.514,0,.951-.394,.995-.915,.03-.349,.046-.702,.046-1.056,0-.347-.014-.689-.043-1.028-.047-.551-.521-.97-1.081-.911ZM7.792,21.074c-.522-.242-1.03-.534-1.509-.867-.453-.315-1.076-.205-1.392,.249-.315,.453-.204,1.076,.249,1.392,.572,.399,1.182,.75,1.81,1.041,.137,.063,.279,.093,.42,.093,.378,0,.739-.214,.908-.579,.232-.501,.015-1.096-.486-1.328ZM23.718,4.304c-.385-.396-1.019-.406-1.414-.021L12.751,13.561c-.575,.574-1.517,.584-2.103,.019l-3.993-3.86c-.397-.384-1.03-.373-1.414,.023-.384,.397-.373,1.03,.023,1.414l3.993,3.86c.676,.653,1.557,.979,2.436,.979,.896,0,1.79-.338,2.461-1.01L23.696,5.718c.396-.385,.406-1.019,.021-1.414ZM12.884,21.962c-.281,.024-.565,.038-.855,.038-.307-.007-.596-.012-.888-.036-.557-.036-1.034,.365-1.079,.915-.045,.551,.365,1.033,.915,1.079,.348,.028,.667,.035,1.055,.042,.346,0,.689-.016,1.028-.046,.551-.049,.957-.534,.908-1.084s-.537-.959-1.084-.908Z" />
            </svg>
            <span>
              {childDetails.status === "Underimmunization"
                ? "Mark as Complete"
                : "Mark as Underimmunization"}
            </span>
          </button>
          <button
            className="flex items-center justify-center gap-2 px-6 text-white"
            onClick={triggerUpdate}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="Outline"
              viewBox="0 0 24 24"
              width="512"
              height="512"
              fill="white"
              className="w-5 h-5"
            >
              <path d="M22.853,1.148a3.626,3.626,0,0,0-5.124,0L1.465,17.412A4.968,4.968,0,0,0,0,20.947V23a1,1,0,0,0,1,1H3.053a4.966,4.966,0,0,0,3.535-1.464L22.853,6.271A3.626,3.626,0,0,0,22.853,1.148ZM5.174,21.122A3.022,3.022,0,0,1,3.053,22H2V20.947a2.98,2.98,0,0,1,.879-2.121L15.222,6.483l2.3,2.3ZM21.438,4.857,18.932,7.364l-2.3-2.295,2.507-2.507a1.623,1.623,0,1,1,2.295,2.3Z" />
            </svg>
            <span>Update Record</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 px-5 py-3 mb-3 bg-white rounded-lg">
        <span className="col-start-1 col-end-4 font-light">
          ID: VXCR{childDetails.child_id}
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
          <span className="font-bold">{childDetails.age} month/s</span>
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
        <div className="flex flex-col">
          <span>Mother's Name</span>
          {updateButtonClicked ? (
            <input
              type="text"
              placeholder={childDetails.mother}
              value={childDetails.mother}
              className="p-1 font-bold border border-black"
              onChange={(e) =>
                setChildDetails({
                  ...childDetails,
                  mother: e.target.value,
                })
              }
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
              className="p-1 font-bold border border-black"
              placeholder={childDetails.mother_phoneNo}
              value={childDetails.mother_phoneNo}
              maxLength="11"
              pattern="[0-9]*"
              onChange={(e) => {
                e.target.value = e.target.value
                  .replace(/[^0-9]/g, "")
                  .slice(0, 11);
                setChildDetails({
                  ...childDetails,
                  mother_phoneNo: e.target.value,
                });
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
              className="p-1 font-bold border border-black"
              placeholder={childDetails.father}
              value={childDetails.father}
              onChange={(e) =>
                setChildDetails({
                  ...childDetails,
                  father: e.target.value,
                })
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
              placeholder={childDetails.father_phoneNo}
              value={childDetails.father_phoneNo}
              className="p-1 font-bold border border-black"
              maxLength="11"
              pattern="[0-9]*"
              onChange={(e) => {
                e.target.value = e.target.value
                  .replace(/[^0-9]/g, "")
                  .slice(0, 11);
                setChildDetails({
                  ...childDetails,
                  father_phoneNo: e.target.value,
                });
              }}
            />
          ) : (
            <span className="font-bold">{childDetails.father_phoneNo}</span>
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
                <div key={doseIndex} className="p-3 bg-gray-100 rounded-md">
                  {vaccines[vaccineName]?.administeredDates?.[doseIndex] ? (
                    <input
                      type="text"
                      value={
                        vaccines[vaccineName]?.administeredDates?.[doseIndex]
                          ? formatDate(
                              vaccines[vaccineName].administeredDates[doseIndex]
                            )
                          : ""
                      }
                      onChange={(e) =>
                        handleVaccineDateChange(
                          vaccineName,
                          doseIndex,
                          e.target.value
                        )
                      }
                      className="w-full h-full text-center border-none rounded-md"
                    />
                  ) : (
                    <span className="text-gray-400">On-going</span>
                  )}
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
