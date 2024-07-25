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
  const [childVaccines, setChildVaccines] = useState();
  const [childRemark, setChildRemarks] = useState([]);
  const [editImmuRecord, setEditImmuRecord] = useState(false);

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  let [birthdate, setBirthdate] = useState("");
  const [placeofbirth, setPlaceofbirth] = useState("");
  const [number, setNumber] = useState("");
  const [mothersname, setMothersname] = useState("");
  const [fathersname, setFathersname] = useState("");
  const [mothersNo, setMothersNo] = useState("");
  const [fathersNo, setFathersNo] = useState("");
  const [address, setAddress] = useState("");

  const [BCGVaccine, setBCGVaccine] = useState([]);
  const [HepatitisBVaccine, setHepatitisBVaccine] = useState([]);
  const [Pentavalent, setPentavalent] = useState([]);
  const [OralPolioVaccine, setOralPolioVaccine] = useState([]);
  const [InactivatedPolio, setInactivatedPolio] = useState([]);
  const [PneumococcalConjugate, setPneumococcalConjugate] = useState([]);
  const [MeaslesMumpsRubella, setMeaslesMumpsRubella] = useState([]);

  const [BCGVaccineRemarks, setBCGVaccineRemarks] = useState([]);
  const [HepatitisBVaccineRemarks, setHepatitisBVaccineRemarks] = useState([]);
  const [PentavalentRemarks, setPentavalentRemarks] = useState([]);
  const [OralPolioVaccineRemarks, setOralPolioVaccineRemarks] = useState([]);
  const [InactivatedPolioRemarks, setInactivatedPolioRemarks] = useState([]);
  const [PneumococcalConjugateRemarks, setPneumococcalConjugateRemarks] =
    useState([]);
  const [MeaslesMumpsRubellaRemarks, setMeaslesMumpsRubellaRemarks] = useState(
    []
  );

  // For updating
  const [updateBCGVaccine1, setUpdateBCGVaccine1] = useState("");
  const [updateHepatitisBVaccine1, setUpdateHepatitisBVaccine1] = useState("");

  const [updatePentavalent1, setUpdatePentavalent1] = useState("");
  const [updatePentavalent2, setUpdatePentavalent2] = useState("");
  const [updatePentavalent3, setUpdatePentavalent3] = useState("");

  const [updateOralPolioVaccine1, setUpdateOralPolioVaccine1] = useState("");
  const [updateOralPolioVaccine2, setUpdateOralPolioVaccine2] = useState("");
  const [updateOralPolioVaccine3, setUpdateOralPolioVaccine3] = useState("");

  const [updateInactivatedPolio1, setUpdateInactivatedPolio1] = useState("");
  const [updateInactivatedPolio2, setUpdateInactivatedPolio2] = useState("");

  const [updatePneumococcalConjugate1, setUpdatePneumococcalConjugate1] =
    useState("");
  const [updatePneumococcalConjugate2, setUpdatePneumococcalConjugate2] =
    useState("");
  const [updatePneumococcalConjugate3, setUpdatePneumococcalConjugate3] =
    useState("");

  const [updateMeaslesMumpsRubella1, setUpdateMeaslesMumpsRubella1] =
    useState("");
  const [updateMeaslesMumpsRubella2, setUpdateMeaslesMumpsRubella2] =
    useState("");

  const triggerUpdate = async () => {
    setUpdateImmuModal(!updateImmuModal);
  };
  const triggerEdit = async () => {
    setEditImmuModal(!editImmuModal);
  };

  // For updating

  const [updateButton, setUpdateButton] = useState(false);

  const applyChanges = async (childID) => {
    birthdate = formatDateForInput(birthdate);
    try {
      const response = await axios.put(
        "http://localhost:8800/updateChildDetailsFromImmu",
        {
          name,
          birthdate,
          placeofbirth,
          gender,
          mothersname,
          fathersname,
          address,
          childID,
        }
      );
      console.log(response);
      if (response.data.reloadPage) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
    try {
      const response = await axios.put("http://localhost:8800/updateParents", {
        childID,
        fathersname,
        fathersNo,
        mothersname,
        mothersNo,
      });
      console.log(response);
      if (response.data.reloadPage) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Kinukuha yung mga children from the database
  useEffect(() => {
    const fetchAllChild = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/viewbmitracking/${childId}`
        );
        setChildDetails(response.data.childDetails[0]);
        setName(response.data.childDetails[0].name);
        setGender(response.data.childDetails[0].sex);
        setBirthdate(response.data.childDetails[0].date_of_birth);
        setPlaceofbirth(response.data.childDetails[0].place_of_birth);
        setNumber(response.data.childDetails[0].family_number);
        setMothersname(response.data.childDetails[0].mother);
        setFathersname(response.data.childDetails[0].father);
        setAddress(response.data.childDetails[0].address);
        setFathersNo(response.data.childDetails[0].father_phoneNo);
        setMothersNo(response.data.childDetails[0].mother_phoneNo);

        // console.log(response.data.childDetails[0]);

        const response1 = await axios.get(
          `http://localhost:8800/getChildImmunization/${childId}`
        );

        console.log(response1.data.BCGVaccine);
        setBCGVaccine(response1.data.BCGVaccine);
        setHepatitisBVaccine(response1.data.HepatitisBVaccine);
        setPentavalent(response1.data.PentavalentVaccine);
        setOralPolioVaccine(response1.data.OralPolioVaccine);
        setInactivatedPolio(response1.data.InactivatedPolio);
        setPneumococcalConjugate(response1.data.PneumococcalConjugate);
        setMeaslesMumpsRubella(response1.data.MeaslesMumpsRubella);

        const response2 = await axios.get(
          `http://localhost:8800/showRemarks/${childId}`
        );

        setBCGVaccineRemarks(response2.data.BCGVaccine);
        setHepatitisBVaccineRemarks(response2.data.HepatitisBVaccine);
        setPentavalentRemarks(response2.data.PentavalentVaccine);
        setOralPolioVaccineRemarks(response2.data.OralPolioVaccine);
        setInactivatedPolioRemarks(response2.data.InactivatedPolio);
        setPneumococcalConjugateRemarks(response2.data.PneumococcalConjugate);
        setMeaslesMumpsRubellaRemarks(response2.data.MeaslesMumpsRubella);
        setChildRemarks(response2.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllChild();
  }, []);

  const capitalizeAfterSpace = (inputString) => {
    const words = inputString.split(" ");
    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    const resultString = capitalizedWords.join(" ");

    return resultString;
  };

  const updateRecord = () => {
    setUpdateButtonClicked(!updateButtonClicked);
  };

  const showStatusTag = (status) => {
    const statusConfig = {
      Active: {
        className: "text-C40BE04",
        label: "Active",
      },
      Inactive: {
        className: "text-C1886C3",
        label: "Inactive",
      },
      Completed: {
        className: "text-C869EAC",
        label: "Completed",
      },
      Underimmunization: {
        className: "text-C5FA9D6",
        label: "Underimmunization",
      },
    };

    const config = statusConfig[status] || statusConfig.Completed;

    return <span className={config.className}>{config.label}</span>;
  };

  const formatDateForInput = (serverDate) => {
    const date = new Date(serverDate);
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    let day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const childdDoseTaken = async (vaccine) => {
    try {
      const response = await axios.get(
        `http://localhost:8800/dosesTaken/${childId}?vaccine=${vaccine}`
      );
      return response.data[0].dose_taken;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="">
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
          {/* <button
            className="flex items-center justify-center gap-2 px-6 bg-white border-2 border-black text-blue"
            onClick={triggerEdit}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
              />
            </svg>

            <span>Edit Record</span>
          </button> */}

          <button
            className="flex items-center justify-center gap-2 px-6 text-white"
            onClick={triggerUpdate}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="14"
              viewBox="0 0 448 512"
              fill="white"
            >
              <path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z" />
            </svg>
            <span>Update Record</span>
          </button>
        </div>
      </div>
      {/* </div> */}

      <div className="grid grid-cols-4 gap-4 px-5 py-3 mb-3 bg-white rounded-lg">
        <span className="col-start-1 col-end-4 font-light">
          ID: CAB-UR-{childDetails.child_id}
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
              placeholder={childDetails.sex}
              className="font-bold"
              value={gender}
              onChange={(e) => setGender(capitalizeAfterSpace(e.target.value))}
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
              placeholder={childDetails.place_of_birth}
              className="font-bold"
              value={placeofbirth}
              onChange={(e) =>
                setPlaceofbirth(capitalizeAfterSpace(e.target.value))
              }
            />
          ) : (
            <span className="font-bold">{childDetails.place_of_birth}</span>
          )}
        </div>
        <div className="flex flex-col col-start-3 col-span-2">
          <span>Address</span>
          {updateButtonClicked ? (
            <input
              type="text"
              className="font-bold"
              placeholder={childDetails.address}
              value={address}
              onChange={(e) => setAddress(capitalizeAfterSpace(e.target.value))}
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
              className="font-bold"
              placeholder={childDetails.mother}
              value={mothersname}
              onChange={(e) =>
                setMothersname(capitalizeAfterSpace(e.target.value))
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
              className="font-bold"
              placeholder={childDetails.mother_phoneNo}
              value={mothersNo}
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
              value={fathersname}
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
              value={fathersNo}
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

        <div className="">
          <span>Status: </span>
          {showStatusTag(childDetails.status)}
          {/* <span>{childDetails.status}</span> */}
        </div>
      </div>

      {/* Old Details View */}
      {/* <div className="grid grid-cols-3 gap-2 p-4 mb-2 bg-white rounded-lg">
        <div>
          <span>
            Child name: <span className="font-bold">{childDetails.name}</span>
          </span>
        </div>
        <div>
          <span>
            Mother's name:{" "}
            <span className="font-bold">{childDetails.mother}</span>
          </span>
        </div>
        <div>
          <span>
            Health Center:{" "}
            <span className="font-bold">Cabaruan Health Center</span>
          </span>
        </div>
        <div>
          <span>
            Date of Birth:{" "}
            <span className="font-bold">{childDetails.date_of_birth}</span>
          </span>
        </div>
        <div>
          <span>
            Father's name:{" "}
            <span className="font-bold">{childDetails.father}</span>
          </span>
        </div>
        <div>
          <span>
            Barangay: <span className="font-bold">Cabaruan</span>
          </span>
        </div>
        <div>
          <span>
            Place of Birth:{" "}
            <span className="font-bold">{childDetails.place_of_birth}</span>
          </span>
        </div>
        <div>
          <span>
            Cellphone No.:{" "}
            <span className="font-bold">{childDetails.family_number}</span>
          </span>
        </div>
        <div>
          <span>
            Sex: <span className="font-bold">{childDetails.sex}</span>
          </span>
        </div>
        <div className="col-span-2">
          <span>
            Address: <span className="font-bold">{childDetails.address}</span>
          </span>
        </div>
      </div> */}

      <div className="grid grid-cols-4 p-4 text-sm font-semibold text-center bg-white rounded-md gap-x-4 gap-y-3 ">
        <div className="p-3 text-white rounded-md bg-C0D3E5A">Bakuna</div>
        <div className="p-3 text-white rounded-md bg-C0D3E5A">Doses</div>
        <div className="p-3 text-white rounded-md bg-C0D3E5A">
          Petsa ng bakuna MM/DD/YY
        </div>
        <div className="p-3 text-white rounded-md bg-C0D3E5A">Remarks</div>
        {/* ----- */}
        <div className="p-3 rounded-md bg-CD9D9D9">BCG Vaccine</div>
        <div className="p-3 rounded-md bg-CD9D9D9">1) At birth</div>
        <div className="border-2 rounded-md bg-CD9D9D9">
          {updateButton ? (
            <input
              type="date"
              className="w-full h-full text-center rounded-md"
              onChange={(e) => setUpdateBCGVaccine1(e.target.value)}
            />
          ) : (
            BCGVaccine.map((element) => {
              const date = new Date(element.date_administered);
              const formattedDate = date.toLocaleDateString("en-GB"); // Format as DD/MM/YYYY
              // return <p>1) {formattedDate}</p>;
              return (
                <input
                  type="text"
                  value={formattedDate}
                  className="w-full h-full text-center rounded-md "
                />
              );
            })
          )}
        </div>
        <div className="p-3 bg-white border-2 rounded-md">
          {BCGVaccineRemarks.length === 1 ? "Vaccinated" : "On process"}
        </div>
        {/* ----- */}

        {/* ----- */}
        <div className="p-3 rounded-md bg-CD9D9D9 ">Hepatitis B Vaccine</div>
        <div className="p-3 rounded-md bg-CD9D9D9 ">1) At birth</div>
        <div className="border-2 rounded-md bg-CD9D9D9 ">
          {updateButton ? (
            <input
              type="date"
              className="w-full h-full text-center rounded-md"
              onChange={(e) => setUpdateHepatitisBVaccine1(e.target.value)}
            />
          ) : (
            HepatitisBVaccine.map((element) => {
              const date = new Date(element.date_administered);
              const formattedDate = date.toLocaleDateString("en-GB"); // Format as DD/MM/YYYY
              // return <p>1) {formattedDate}</p>;
              return (
                <input
                  type="text"
                  value={formattedDate}
                  className="w-full h-full text-center rounded-md"
                />
              );
            })
          )}
        </div>
        <div className="p-3 bg-white border-2 rounded-md ">
          {HepatitisBVaccineRemarks.length === 1 ? "Vaccinated" : "On process"}
        </div>
        {/* ----- */}

        {/* ----- */}
        <div className="p-3 rounded-md bg-CD9D9D9">
          Pentavalent Vaccine (DPT-Hep B-HIB)
        </div>
        <div className="p-3 rounded-md bg-CD9D9D9">
          3) 1 1/2, 2 1/2, 3 1/2 months
        </div>
        <div className="rounded-md bg-CD9D9D9">
          <div className="flex flex-col text-sm border rounded-md">
            {updateButton ? (
              <>
                <input
                  type="date"
                  className="w-full h-full text-center "
                  onChange={(e) => setUpdatePentavalent1(e.target.value)}
                />
                <input
                  type="date"
                  className="w-full h-full text-center "
                  onChange={(e) => setUpdatePentavalent2(e.target.value)}
                />
                <input
                  type="date"
                  className="w-full h-full text-center "
                  onChange={(e) => setUpdatePentavalent3(e.target.value)}
                />
              </>
            ) : (
              Pentavalent.map((element, index) => {
                const date = new Date(element.date_administered);
                const formattedDate = date.toLocaleDateString("en-GB"); // Format as DD/MM/YYYY
                // return <p>1) {formattedDate}</p>;
                return (
                  <input
                    type="text"
                    value={formattedDate}
                    className="flex-1 w-full h-full py-1 text-center border-2 border-CEDEDED"
                  />
                );
              })
            )}
          </div>
        </div>
        <div className="p-3 bg-white border-2 rounded-md">
          {PentavalentRemarks.length === 3 ? "Vaccinated" : "On process"}
        </div>
        {/* ----- */}

        {/* ----- */}
        <div className="p-3 rounded-md bg-CD9D9D9">
          Oral Polio Vaccine (OPV)
        </div>
        <div className="p-3 rounded-md bg-CD9D9D9">
          3) 1 1/2, 2 1/2, 3 1/2 months
        </div>
        <div className="rounded-md bg-CD9D9D9">
          <div className="flex flex-col text-sm border rounded-md">
            {updateButton ? (
              <>
                <input
                  type="date"
                  className="w-full h-full text-center"
                  onChange={(e) => setUpdateOralPolioVaccine1(e.target.value)}
                />
                <input
                  type="date"
                  className="w-full h-full text-center "
                  onChange={(e) => setUpdateOralPolioVaccine2(e.target.value)}
                />
                <input
                  type="date"
                  className="w-full h-full text-center "
                  onChange={(e) => setUpdateOralPolioVaccine3(e.target.value)}
                />
              </>
            ) : (
              OralPolioVaccine.map((element, index) => {
                const date = new Date(element.date_administered);
                const formattedDate = date.toLocaleDateString("en-GB"); // Format as DD/MM/YYYY
                // return <p>1) {formattedDate}</p>;
                return (
                  <input
                    type="text"
                    value={formattedDate}
                    className="flex-1 w-full h-full py-1 text-center border-2 border-CEDEDED"
                  />
                );
              })
            )}
          </div>
        </div>
        <div className="p-3 bg-white border-2 rounded-md">
          {OralPolioVaccineRemarks.length === 3 ? "Vaccinated" : "On process"}
        </div>
        {/* ----- */}

        {/* ----- */}
        <div className="p-3 rounded-md bg-CD9D9D9">
          Inactivated Polio Vaccine (PIV)
        </div>
        <div className="p-3 rounded-md bg-CD9D9D9">2) 3 1/2 & 9 months</div>
        <div className="rounded-md bg-CD9D9D9">
          <div className="flex justify-center text-sm border rounded-md ">
            {updateButton ? (
              <>
                <input
                  type="date"
                  className="w-full h-full py-3 text-center"
                  onChange={(e) => setUpdateInactivatedPolio1(e.target.value)}
                />
                <input
                  type="date"
                  className="w-full h-full py-3 text-center "
                  onChange={(e) => setUpdateInactivatedPolio2(e.target.value)}
                />
              </>
            ) : (
              InactivatedPolio.map((element, index) => {
                const date = new Date(element.date_administered);
                const formattedDate = date.toLocaleDateString("en-GB"); // Format as DD/MM/YYYY
                // return <p>1) {formattedDate}</p>;
                return (
                  <input
                    type="text"
                    value={formattedDate}
                    className="flex-1 w-full h-full py-3 text-center border-2 border-CEDEDED"
                  />
                );
              })
            )}
          </div>
        </div>
        <div className="p-3 bg-white border-2 rounded-md">
          {InactivatedPolioRemarks.length === 2 ? "Vaccinated" : "On process"}
        </div>
        {/* ----- */}

        {/* ----- */}
        <div className="p-3 rounded-md bg-CD9D9D9">
          Pneumococcal Conjugate Vaccine (PCV)
        </div>
        <div className="p-3 rounded-md bg-CD9D9D9">
          3) 1 1/2, 2 1/2, 3 1/2 months
        </div>
        <div className="border rounded-md bg-CD9D9D9">
          <div className="flex flex-col text-sm">
            {updateButton ? (
              <>
                <input
                  type="date"
                  className="w-full h-full text-center"
                  onChange={(e) =>
                    setUpdatePneumococcalConjugate1(e.target.value)
                  }
                />
                <input
                  type="date"
                  className="w-full h-full text-center "
                  onChange={(e) =>
                    setUpdatePneumococcalConjugate2(e.target.value)
                  }
                />
                <input
                  type="date"
                  className="w-full h-full text-center "
                  onChange={(e) =>
                    setUpdatePneumococcalConjugate3(e.target.value)
                  }
                />
              </>
            ) : (
              PneumococcalConjugate.map((element, index) => {
                const date = new Date(element.date_administered);
                const formattedDate = date.toLocaleDateString("en-GB"); // Format as DD/MM/YYYY
                // return <p>1) {formattedDate}</p>;
                return (
                  <input
                    type="text"
                    value={formattedDate}
                    className="flex-1 w-full h-full py-1 text-center border-2 border-CEDEDED"
                  />
                );
              })
            )}
          </div>
        </div>
        <div className="p-3 bg-white border-2 rounded-md">
          {PneumococcalConjugateRemarks.length === 3
            ? "Vaccinated"
            : "On process"}
        </div>
        {/* ----- */}

        {/* ----- */}
        <div className="p-3 rounded-md bg-CD9D9D9">
          Measles, Mumps, Rubella Vaccine (MMR)
        </div>
        <div className="p-3 rounded-md bg-CD9D9D9">2) 9 months & 1 year</div>
        <div className="border-2 rounded-md bg-CD9D9D9">
          <div className="flex text-sm">
            {updateButton ? (
              <>
                <input
                  type="date"
                  className="w-full h-full py-5 text-center"
                  onChange={(e) =>
                    setUpdateMeaslesMumpsRubella1(e.target.value)
                  }
                />
                <input
                  type="date"
                  className="w-full h-full py-5 text-center "
                  onChange={(e) =>
                    setUpdateMeaslesMumpsRubella2(e.target.value)
                  }
                />
              </>
            ) : (
              MeaslesMumpsRubella.map((element, index) => {
                const date = new Date(element.date_administered);
                const formattedDate = date.toLocaleDateString("en-GB"); // Format as DD/MM/YYYY
                // return <p>1) {formattedDate}</p>;
                return (
                  <input
                    type="text"
                    value={formattedDate}
                    className="flex-1 w-full h-full py-6 text-center border border-CEDEDED"
                  />
                );
              })
            )}
          </div>
        </div>
        <div className="p-3 bg-white border-2 rounded-md">
          {MeaslesMumpsRubellaRemarks.length === 2
            ? "Vaccinated"
            : "On process"}
        </div>
        {/* ----- */}
      </div>
    </section>
  );
}

/*

<div className="flex flex-col w-3/12 gap-3 font-semibold text-center">
          <div className="w-full px-3 py-4 text-white bg-C0D3E5A ">Bakuna</div>
          <div className="w-full px-3 py-4 border-2 border-blue-950 text-blue-950 bg-C869EAC">
            BCG Vaccine
          </div>
          <div className="w-full px-3 py-4 border-2 border-blue-950 text-blue-950 bg-C869EAC">
            Hepatitis B Vaccine
          </div>
          <div className="w-full px-3 py-4 border-2 text-blue-950 border-blue-950 bg-C869EAC">
            Pentavalent Vaccine (DPT-Hep B-HIB)
          </div>
          <div className="w-full px-3 py-4 border-2 text-blue-950 border-blue-950 bg-C869EAC">
            Oral Polio Vaccine (OPV)
          </div>
          <div className="w-full px-3 py-4 border-2 text-blue-950 border-blue-950 bg-C869EAC">
            Inactivated Polio Vaccine (PIV)
          </div>
          <div className="w-full px-3 py-4 border-2 text-blue-950 border-blue-950 bg-C869EAC">
            Pneumococcal Conjugate Vaccine (PCV)
          </div>
          <div className="w-full px-3 py-4 border-2 text-blue-950 border-blue-950 bg-C869EAC">
            Measles, Mumps, Rubella Vaccine (MMR)
          </div>
        </div>

        <div className="flex flex-col w-3/12 gap-3 font-semibold text-center">
          <div className="w-full px-3 py-4 text-white bg-C0D3E5A ">Doses</div>
          <div className="w-full px-3 py-4 border-2 border-blue-950 text-blue-950 bg-C869EAC">
            1) At birth
          </div>
          <div className="w-full px-3 py-4 border-2 border-blue-950 text-blue-950 bg-C869EAC">
            1) At birth
          </div>
          <div className="w-full px-3 py-4 border-2 text-blue-950 border-blue-950 bg-C869EAC">
            3) 1 1/2, 2 1/2, 3 1/2 months
          </div>
          <div className="w-full px-3 py-4 border-2 text-blue-950 border-blue-950 bg-C869EAC">
            3) 1 1/2, 2 1/2, 3 1/2 months
          </div>
          <div className="w-full px-3 py-4 border-2 text-blue-950 border-blue-950 bg-C869EAC">
            2) 3 1/2 & 9 months
          </div>
          <div className="w-full px-3 py-4 border-2 text-blue-950 border-blue-950 bg-C869EAC">
            3) 1 1/2, 2 1/2, 3 1/2 months
          </div>
          <div className="w-full px-3 py-4 border-2 text-blue-950 border-blue-950 bg-C869EAC">
            2) 9 months & 1 year
          </div>
        </div>

*/

// copies
/*

 <div className="grid grid-cols-4 gap-4 px-5 py-3 bg-white rounded-lg">
          <span className="col-start-1 col-end-4 font-light">
            ID: CAB-UR-{childDetails.child_id}
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
                placeholder={childDetails.sex}
                className="font-bold"
                value={gender}
                onChange={(e) =>
                  setGender(capitalizeAfterSpace(e.target.value))
                }
              />
            ) : (
              <span className="font-bold">{childDetails.sex}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span>Birthdate</span>
            {updateButtonClicked ? (
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
              />
            ) : (
              <span className="font-bold">{childDetails.date_of_birth}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span>Place of birth</span>
            {updateButtonClicked ? (
              <input
                type="text"
                placeholder={childDetails.place_of_birth}
                className="font-bold"
                value={placeofbirth}
                onChange={(e) =>
                  setPlaceofbirth(capitalizeAfterSpace(e.target.value))
                }
              />
            ) : (
              <span className="font-bold">{childDetails.place_of_birth}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span>Contact no.</span>
            {updateButtonClicked ? (
              <input
                type="number"
                placeholder={childDetails.family_number}
                className="font-bold"
                value={number}
                onChange={(e) =>
                  setNumber(capitalizeAfterSpace(e.target.value))
                }
              />
            ) : (
              <span className="font-bold">{childDetails.family_number}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span>Mother's Name</span>
            {updateButtonClicked ? (
              <input
                type="text"
                className="font-bold"
                placeholder={childDetails.mother}
                value={mothersname}
                onChange={(e) =>
                  setMothersname(capitalizeAfterSpace(e.target.value))
                }
              />
            ) : (
              <span className="font-bold">{childDetails.mother}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span>Father's Name</span>
            {updateButtonClicked ? (
              <input
                type="text"
                className="font-bold"
                placeholder={childDetails.father}
                value={fathersname}
                onChange={(e) =>
                  setFathersname(capitalizeAfterSpace(e.target.value))
                }
              />
            ) : (
              <span className="font-bold">{childDetails.father}</span>
            )}
          </div>
          <div className="flex flex-col col-span-3 ">
            <span>Address</span>
            {updateButtonClicked ? (
              <input
                type="text"
                className="font-bold"
                placeholder={childDetails.address}
                value={address}
                onChange={(e) =>
                  setAddress(capitalizeAfterSpace(e.target.value))
                }
              />
            ) : (
              <span className="font-bold">{childDetails.address}</span>
            )}
          </div>
          <div className="">
            <span>Status: </span>
            {showStatusTag(childDetails.status)}
          </div>
        </div>
*/
