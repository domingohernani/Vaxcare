import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import applyIcon from "../assets/bmitrackingassets/applyIcon.svg";
import cancelIcon from "../assets/bmitrackingassets/cancelIcon.svg";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
          number,
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
        mothersname,
      });
      console.log(response);
      if (response.data.reloadPage) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [medicineTaken, setMedicineTaken] = useState([]);
  const [medicinePrescription, setMedicinePrescription] = useState([]);

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
            : "Delekado ang situation ng bata. Maari siyang mahawala ng polio, isang nakakahawang sakit na maaaring magdulot ng paralysis";
        case "Measles, Mumps, Rubella Vaccine (MMR)":
          return occurrenceCount > 0
            ? "Mataas proteksyon laban sa tigdas, bulutong, at rubella, na nagpapababa ng panganib na magkaruon ng mga malubhang sakit at komplikasyon"
            : "Mataas ang tsansang mahawa ang bata sa tigdas, bulutong, at rubella";
        case "Pentavalent Vaccine (DPT-Hep B-HIB)":
          return occurrenceCount > 0
            ? "Protektado laban sa diphtheria, pertussis, tetanus, Hepatitis B, at Haemophilus influenzae type b (HIB). Pangmatagalan at komprehensibong proteksyon laban sa mga nabanggit na sakit."
            : "Ang bata ay maaaring mas madaling matamaan ng diphtheria, pertussis, tetanus, Hepatitis B, at Haemophilus influenzae type b (HIB)";
        case "Pneumococcal Conjugate Vaccine (PCV)":
          return occurrenceCount > 0
            ? "Protektado laban sa ilang uri ng bacteria na sanhi ng pneumonia, meningitis, at iba pang respiratory infections"
            : "Mataas ang panganib na mahawaan ng mga sakit na dulot ng pneumococcus, na maaaring magresulta sa pneumonia, meningitis, o iba pang respiratory infections na maaaring magdulot ng komplikasyon at kritikal na kondisyon";
        default:
          return "";
      }
    };

    medicineTaken.forEach((vaccine) => {
      const text = getPrescriptionText(vaccine.name, vaccine.occurrence_count);
      prescription.push(text);
    });

    setMedicinePrescription(prescription);
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
      try {
        const response = await axios.get(
          `http://localhost:8800/prescribeMedicines/${childId}`
        );
        setMedicineTaken(response.data);
        prescribeUsingMedicines();
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllChild();
  }, [childId, medicinePrescription]);

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
    <>
      <section className="bg-white">
        {updateImmuModal && (
          <UpdateImmunizationModal onClose={triggerUpdate} childId={childId} />
        )}
        {editImmuModal && (
          <EditImmunizationModal onClose={triggerEdit} childId={childId} />
        )}
        <div className="flex items-center justify-between mb-3">
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
          </div>
        </div>
        {/* </div> */}

        <div
          className="mt-5 ml-5"
          onClick={() => {
            navigate("/enterId");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="25"
            width="25"
            fill="black"
            viewBox="0 0 512 512"
          >
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z" />
          </svg>
        </div>
        <div className="gap-4 px-5 py-3 mb-3 bg-white rounded-lg ">
          <span className="col-start-1 col-end-4 font-light">
            ID: CAB-UR-{childDetails.child_id}
          </span>
          <span className="flex items-center justify-end col-start-4 col-end-4 gap-2 font-light ">
            {updateButtonClicked ? (
              <>
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
          </span>
          <div className="flex flex-col">
            <span>
              Name: <span className="font-bold"> {childDetails.name}</span>
            </span>
          </div>
        </div>

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
            {HepatitisBVaccineRemarks.length === 1
              ? "Vaccinated"
              : "On process"}
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
      <section className="p-4 bg-white">
        <div className="font-bold ">Prescription</div>
        <div>
          {medicinePrescription.map((item) => (item ? <li>{item}</li> : ""))}
        </div>
      </section>
    </>
  );
}
