import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import editIcon from "../assets/bmitrackingassets/editIcon.svg";
import cancelIcon from "../assets/bmitrackingassets/cancelIcon.svg";
import applyIcon from "../assets/bmitrackingassets/applyIcon.svg";
import Prescription from "./Prescription";

export default function ViewBMITracking() {
  const [childDetails, setChildDetails] = useState({});
  const [bmiHistory, setBmiHistory] = useState([]);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [updateButtonClicked, setUpdateButtonClicked] = useState(false);
  const navigate = useNavigate();
  const { childId } = useParams();

  const [medicinePrescription, setMedicinePrescription] = useState([]);

  const calculateBMI = (weightInKg, heightInCm, dateOfBirth, sex) => {
    const currentDate = new Date();
    const birthDate = new Date(dateOfBirth);
    const ageInMonths =
      (currentDate.getFullYear() - birthDate.getFullYear()) * 12 +
      currentDate.getMonth() -
      birthDate.getMonth();

    const heightInMeters = heightInCm / 100;
    const bmi = (weightInKg / Math.pow(heightInMeters, 2)).toFixed(2);

    const bmiCategories = {
      underweight: { upperLimit: 18.4, category: "Underweight" },
      normal: { upperLimit: 24.9, category: "Normal" },
      overweight: { upperLimit: 29.9, category: "Overweight" },
      obese: { upperLimit: Number.POSITIVE_INFINITY, category: "Obese" },
    };

    if (sex === "Male" && ageInMonths >= 24) {
      bmiCategories.underweight.upperLimit = 17.9;
      bmiCategories.normal.upperLimit = 23.9;
    } else if (sex === "Female" && ageInMonths >= 24) {
      bmiCategories.underweight.upperLimit = 17.9;
      bmiCategories.normal.upperLimit = 23.9;
    }

    let bmiCategory = Object.keys(bmiCategories).find(
      (category) => bmi <= bmiCategories[category].upperLimit
    );
    bmiCategory = bmiCategories[bmiCategory].category;

    return (
      <>
        <li>
          <span className="font-semibold">BMI:</span> {bmi}
        </li>
        <li>
          <span className="font-semibold">Interpretation:</span>{" "}
          <span className="text-C40BE04">{bmiCategory}</span>
        </li>
      </>
    );
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
        className: "text-gray",
        label: "Underimmunization",
      },
    };

    const config = statusConfig[status] || statusConfig.Completed;

    return <span className={config.className}>{config.label}</span>;
  };

  const capitalizeAfterSpace = (inputString) => {
    const words = inputString.split(" ");
    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    return capitalizedWords.join(" ");
  };

  const updateRecord = () => {
    setUpdateButtonClicked(!updateButtonClicked);
  };

  const formatDateForInput = (serverDate) => {
    const date = new Date(serverDate);
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
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
      console.log(response);

      if (response.data.reloadPage) {
        window.location.reload();
      }
    } catch (error) {
      console.log("Error updating child and parent details:", error);
    }
  };

  const prescribeUsingMedicines = () => {
    let prescription = [];

    const getPrescriptionText = (vaccineName, occurrenceCount) => {
      switch (vaccineName) {
        case "BCG Vaccine":
          return occurrenceCount > 0
            ? "Siya ay may mababang tsansa na mahawaan ng ilang uri ng tuberculosis (TB)"
            : "Mataas ang panganib na mahawaan siya ng ilang uri ng tuberculosis (TB)";
        case "Hepatitis B Vaccine":
          return occurrenceCount > 0
            ? "Protektado ang bata sa Hepatitis B, na maaaring magdulot ng seryosong problema sa atay"
            : "May panganib na mahawa siya ng Hepatitis B virus kung sakaling magkaruon siya ng contact sa isang taong may sakit";
        case "Inactivated Polio Vaccine (PIV)":
          return occurrenceCount >= 2
            ? "Mataas ang immune response ng bata laban sa polio"
            : "Delekado ang situation ng bata. Maari siyang mahawaan ng polio, isang nakakahawang sakit na maaaring magdulot ng paralysis";
        case "Measles, Mumps, Rubella Vaccine (MMR)":
          return occurrenceCount > 0
            ? "Mataas proteksyon laban sa tigdas, bulutong, at rubella, na nagpapababa ng panganib na magkaruon ng mga malubhang sakit at komplikasyon"
            : "Mataas ang tsansang mahawa ang bata sa tigdas, bulutong, at rubella";
        case "Pentavalent Vaccine (DPT-Hep B-HIB)":
          return occurrenceCount > 0
            ? "Protektado laban sa diphtheria, pertussis, tetanus, Hepatitis B, at Haemophilus influenzae type b (HIB)."
            : "Ang bata ay maaaring mas madaling matamaan ng diphtheria, pertussis, tetanus, Hepatitis B, at Haemophilus influenzae type b (HIB)";
        case "Pneumococcal Conjugate Vaccine (PCV)":
          return occurrenceCount > 0
            ? "Protektado laban sa ilang uri ng bacteria na sanhi ng pneumonia, meningitis, at iba pang respiratory infections"
            : "Mataas ang panganib na mahawaan ng mga sakit na dulot ng pneumococcus";
        default:
          return "";
      }
    };

    childDetails.medicineTaken?.forEach((vaccine) => {
      const text = getPrescriptionText(vaccine.name, vaccine.occurrence_count);
      prescription.push(text);
    });

    setMedicinePrescription(prescription);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [childDetailsResponse, medicineResponse] = await Promise.all([
          axios.get(`http://localhost:8800/viewbmitracking/${childId}`),
          axios.get(`http://localhost:8800/prescribeMedicines/${childId}`),
        ]);

        const { data } = childDetailsResponse;
        setChildDetails(data.childDetails[0]);

        setBmiHistory(data.bmiHistory);
        setHistoryRecords(data.historyRecords);

        setMedicinePrescription(medicineResponse.data);
        prescribeUsingMedicines();
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [childId]);

  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <div
          className="w-10 h-10 p-1 cursor-pointer"
          onClick={() => navigate("/bmitracking")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Outline"
            viewBox="0 0 24 24"
          >
            <path d="M10.6,12.71a1,1,0,0,1,0-1.42l4.59-4.58a1,1,0,0,0,0-1.42,1,1,0,0,0-1.41,0L9.19,9.88a3,3,0,0,0,0,4.24l4.59,4.59a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.42Z" />
          </svg>
        </div>
        <h3 className="flex-1 px-6 py-4 mx-6 font-semibold">
          Body Mass Index Tracking Information
        </h3>
        <div className="flex items-center gap-4">
          <NavLink to={`/viewbmitracking/addbmi/${childId}`}>
            <button className="py-3 font-normal text-white bg-C1886C3">
              Add Body Mass Index
            </button>
          </NavLink>
          <NavLink to={`/viewbmitracking/addmedicalhistory/${childId}`}>
            <button className="py-3 font-normal text-white bg-C1886C3">
              Add Medical History
            </button>
          </NavLink>
        </div>
      </div>

      <section className="flex gap-3 mt-2">
        <div className="grid flex-1 grid-cols-4 gap-4 px-5 py-3 bg-white rounded-lg">
          <span className="col-start-1 col-end-4 font-light">
            ID: VXCR-UR-{childDetails.child_id}
          </span>
          <span className="flex items-center justify-end col-start-4 col-end-4 gap-2 font-light">
            {updateButtonClicked ? (
              <>
                <img
                  src={applyIcon}
                  alt="icon"
                  width="20px"
                  className="cursor-pointer"
                  title="Apply changes"
                  onClick={() => applyChanges(childDetails.child_id)}
                />
                <img
                  src={cancelIcon}
                  alt="icon"
                  width="20px"
                  className="cursor-pointer"
                  title="Cancel changes"
                  onClick={() => setUpdateButtonClicked(false)}
                />
              </>
            ) : null}
            <img
              src={editIcon}
              alt="icon"
              width="18px"
              className="cursor-pointer"
              onClick={updateRecord}
            />
          </span>

          {/* Name Input */}
          <div className="flex flex-col">
            <span>Name</span>
            {updateButtonClicked ? (
              <input
                type="text"
                value={childDetails.name}
                className="p-1 font-bold border border-black"
                onChange={(e) =>
                  setChildDetails({
                    ...childDetails,
                    name: capitalizeAfterSpace(e.target.value),
                  })
                }
              />
            ) : (
              <span className="font-bold">{childDetails.name}</span>
            )}
          </div>

          {/* Age */}
          <div className="flex flex-col">
            <span>Age</span>
            <span className="font-bold">{childDetails.age}</span>
          </div>

          {/* Gender Input */}
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

          {/* Birthdate */}
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

          {/* Place of Birth Input */}
          <div className="flex flex-col col-span-2">
            <span>Place of birth</span>
            {updateButtonClicked ? (
              <input
                type="text"
                value={childDetails.place_of_birth}
                className="p-1 font-bold border border-black"
                onChange={(e) =>
                  setChildDetails({
                    ...childDetails,
                    place_of_birth: capitalizeAfterSpace(e.target.value),
                  })
                }
              />
            ) : (
              <span className="font-bold">{childDetails.place_of_birth}</span>
            )}
          </div>

          {/* Address Input */}
          <div className="flex flex-col col-span-2 col-start-3">
            <span>Address</span>
            {updateButtonClicked ? (
              <input
                type="text"
                value={childDetails.address}
                className="p-1 font-bold border border-black"
                onChange={(e) =>
                  setChildDetails({
                    ...childDetails,
                    address: capitalizeAfterSpace(e.target.value),
                  })
                }
              />
            ) : (
              <span className="font-bold">{childDetails.address}</span>
            )}
          </div>

          {/* Mother's Name Input */}
          <div className="flex flex-col">
            <span>Mother's Name</span>
            {updateButtonClicked ? (
              <input
                type="text"
                value={childDetails.mother}
                className="p-1 font-bold border border-black"
                onChange={(e) =>
                  setChildDetails({
                    ...childDetails,
                    mother: capitalizeAfterSpace(e.target.value),
                  })
                }
              />
            ) : (
              <span className="font-bold">{childDetails.mother}</span>
            )}
          </div>

          {/* Mother's No Input */}
          <div className="flex flex-col">
            <span>Mother's No.</span>
            {updateButtonClicked ? (
              <input
                type="text"
                value={childDetails.mother_phoneNo}
                maxLength="11"
                className="p-1 font-bold border border-black"
                onChange={(e) =>
                  setChildDetails({
                    ...childDetails,
                    mother_phoneNo: e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 11),
                  })
                }
              />
            ) : (
              <span className="font-bold">{childDetails.mother_phoneNo}</span>
            )}
          </div>

          {/* Father's Name Input */}
          <div className="flex flex-col">
            <span>Father's Name</span>
            {updateButtonClicked ? (
              <input
                type="text"
                value={childDetails.father}
                className="p-1 font-bold border border-black"
                onChange={(e) =>
                  setChildDetails({
                    ...childDetails,
                    father: capitalizeAfterSpace(e.target.value),
                  })
                }
              />
            ) : (
              <span className="font-bold">{childDetails.father}</span>
            )}
          </div>

          {/* Father's No Input */}
          <div className="flex flex-col">
            <span>Father's No.</span>
            {updateButtonClicked ? (
              <input
                type="text"
                value={childDetails.father_phoneNo}
                maxLength="11"
                className="p-1 font-bold border border-black"
                onChange={(e) =>
                  setChildDetails({
                    ...childDetails,
                    father_phoneNo: e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 11),
                  })
                }
              />
            ) : (
              <span className="font-bold">{childDetails.father_phoneNo}</span>
            )}
          </div>

          {/* Status */}
          <div>
            <span>Status: </span>
            {showStatusTag(childDetails.status)}
          </div>
        </div>

        {/* Medical History Section */}
        <div className="pb-3 text-center rounded-lg max-h-80">
          <h4 className="px-4 py-4 text-base font-semibold text-center text-black bg-white rounded-md">
            Medical History
          </h4>
          <ul className="py-2 my-auto mt-4 ml-1 text-left text-black bg-white border px-9 medicalhistoryrecords">
            {historyRecords.length === 0 ? (
              <span className="text-gray-500">No records</span>
            ) : (
              historyRecords.map((record, index) => (
                <li key={index}>
                  <span className="block">
                    <span className="font-semibold">Date: </span>
                    {new Date(record.history_date).toLocaleDateString("en-CA")}
                  </span>
                  <span className="block">
                    <span className="font-semibold">Allergies: </span>{" "}
                    {record.allergies}
                  </span>
                  <span className="block">
                    <span className="font-semibold">Temperature: </span>{" "}
                    {record.temperature}
                  </span>
                  <span className="block">
                    <span className="font-semibold">Coughs: </span>{" "}
                    {record.cough}
                  </span>
                  <span className="block">
                    <span className="font-semibold">Colds: </span> {record.cold}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      {/* Prescription Section */}
      <section className="flex gap-2 mt-3">
        <div className="flex-1 gap-3 rounded-lg">
          <div className="px-4 py-3 text-gray-500 bg-white rounded-lg">
            <span className="font-semibold text-black">Prescription</span>
            <hr className="my-4 bg-gray-100" />
            <ul className="text-left text-black list-disc px-9">
              {bmiHistory.length > 0 && (
                <Prescription
                  height={bmiHistory[0].height}
                  weight={bmiHistory[0].weight}
                />
              )}
              {medicinePrescription.map((item, index) =>
                item ? (
                  <li className="my-2" key={index}>
                    {item}
                  </li>
                ) : (
                  ""
                )
              )}
            </ul>
          </div>

          {/* BMI History */}
          <div className="px-4 py-3 my-3 bg-white rounded-lg">
            <span className="block py-2 font-semibold text-black bg-white rounded-lg">
              BMI History
            </span>
            <hr />
            <ul className="w-full py-2 mt-3 text-black rounded-lg bmiHistory">
              {bmiHistory.length === 0 ? (
                <span className="text-gray-500 pl-9">No records</span>
              ) : (
                bmiHistory.map((bmi, element) => (
                  <div
                    className="flex p-3 mb-5 rounded-md hover:bg-slate-100"
                    key={element}
                  >
                    <h3 className="mr-2">{element + 1}).</h3>
                    <div className="flex-1">
                      {calculateBMI(bmi.weight, bmi.height)}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span>
                        <span className="font-semibold">Weight: </span>
                        {bmi.weight}
                      </span>
                      <span>
                        <span className="font-semibold">Height: </span>
                        {bmi.height}
                      </span>
                    </div>
                    <div>
                      <span>
                        <span> Date: </span>{" "}
                        {new Date(bmi.ht_date).toDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </ul>
          </div>
        </div>
        <div className="w-64 mx-1"></div>
      </section>
    </section>
  );
}
