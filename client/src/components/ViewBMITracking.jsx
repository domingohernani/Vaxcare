import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import editIcon from "../assets/bmitrackingassets/editIcon.svg";
import cancelIcon from "../assets/bmitrackingassets/cancelIcon.svg";
import applyIcon from "../assets/bmitrackingassets/applyIcon.svg";

export default function ViewBMITracking() {
  const [childDetails, setChildDetails] = useState({});
  const [bmiHistory, setBmiHistory] = useState([]);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [updateButtonClicked, setUpdateButtonClicked] = useState(false);
  const navigate = useNavigate();
  const { childId } = useParams();

  const [bmiHistoryColumns] = useState([
    { headerName: "BMI", field: "bmi", sortable: true, filter: true, flex: 1 },
    {
      headerName: "Weight",
      field: "weight",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Height",
      field: "height",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Date",
      field: "ht_date",
      sortable: true,
      filter: true,
      flex: 1,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
  ]);

  const bmiRowData = bmiHistory.map((bmi) => ({
    bmi: (bmi.weight / Math.pow(bmi.height / 100, 2)).toFixed(2),
    weight: bmi.weight,
    height: bmi.height,
    ht_date: bmi.ht_date,
  }));

  const [medicalHistoryColumns] = useState([
    {
      headerName: "Date",
      field: "history_date",
      sortable: true,
      filter: true,
      flex: 1,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      headerName: "Allergies",
      field: "allergies",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Temperature",
      field: "temperature",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Cough",
      field: "cough",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Colds",
      field: "cold",
      sortable: true,
      filter: true,
      flex: 1,
    },
  ]);

  const medicalRowData = historyRecords.map((record) => ({
    history_date: record.history_date,
    allergies: record.allergies,
    temperature: record.temperature,
    cough: record.cough,
    cold: record.cold,
  }));

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
      console.log("Error updating child and parent details:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [childDetailsResponse, medicalResponse] = await Promise.all([
          axios.get(`http://localhost:8800/viewbmitracking/${childId}`),
          axios.get(`http://localhost:8800/prescribeMedicines/${childId}`),
        ]);

        const { data } = childDetailsResponse;
        setChildDetails(data.childDetails[0]);
        setBmiHistory(data.bmiHistory);
        setHistoryRecords(data.historyRecords);
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
        <div className="grid flex-1 grid-cols-4 gap-4 px-5 py-3 border rounded-lg">
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
                    name: e.target.value,
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
                    place_of_birth: e.target.value,
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
                    address: e.target.value,
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
                    mother: e.target.value,
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
                    father: e.target.value,
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
        {/* <div className="pb-3 text-center rounded-lg max-h-80">
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
        </div> */}
      </section>

      {/* Prescription Section */}
      <section className="flex gap-2 mt-3 bg-green-200">
        <div className="flex-1 gap-3 rounded-lg">
          {/* BMI History */}
          {/* <div className="px-4 py-3 my-3 bg-white rounded-lg">
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
          </div> */}
        </div>
        <div className="w-64 mx-1"></div>
      </section>

      <section className="flex items-center gap-4">
        {/* BMI History Table */}
        <div className="ag-theme-quartz" style={{ height: 400, width: "100%" }}>
          <h3>BMI History</h3>
          <AgGridReact
            columnDefs={bmiHistoryColumns}
            rowData={bmiRowData}
            pagination={true}
            paginationPageSize={5}
          />
        </div>

        {/* Medical History Table */}
        <div className="ag-theme-quartz" style={{ height: 400, width: "100%" }}>
          <h3>Medical History</h3>
          <AgGridReact
            columnDefs={medicalHistoryColumns}
            rowData={medicalRowData}
            pagination={true}
            paginationPageSize={5}
          />
        </div>
      </section>
    </section>
  );
}
