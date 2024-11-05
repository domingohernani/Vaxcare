import axios from "axios";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

export default function EditImmunization({ onClose, childId }) {
  const [selectedVaccineId, setSelectedVaccineId] = useState("1");
  const [selectedVaccine, setSelectedVaccine] = useState("BCG Vaccine");
  const [vaccines, setVaccines] = useState([]);
  const [oldDate, setOldDate] = useState();

  const [dateBCGVaccine1, setDateBCGVaccine1] = useState();

  const [dateHepatitisBVaccine1, setDateHepatitisBVaccine1] = useState();

  const [datePentavalentVaccine1, setDatePentavalentVaccine1] = useState();
  const [datePentavalentVaccine2, setDatePentavalentVaccine2] = useState();
  const [datePentavalentVaccine3, setDatePentavalentVaccine3] = useState();

  const [dateOralPolioVaccine1, setDateOralPolioVaccine1] = useState();
  const [dateOralPolioVaccine2, setDateOralPolioVaccine2] = useState();
  const [dateOralPolioVaccine3, setDateOralPolioVaccine3] = useState();

  const [dateInactivatedPolioVaccine1, setDateInactivatedPolioVaccine1] =
    useState();
  const [dateInactivatedPolioVaccine2, setDateInactivatedPolioVaccine2] =
    useState();

  const [
    datePneumococcalConjugateVaccine1,
    setDatePneumococcalConjugateVaccine1,
  ] = useState();
  const [
    datePneumococcalConjugateVaccine2,
    setDatePneumococcalConjugateVaccine2,
  ] = useState();
  const [
    datePneumococcalConjugateVaccine3,
    setDatePneumococcalConjugateVaccine3,
  ] = useState();

  const [dateMeaslesMumpsRubellaVaccine1, setDateMeaslesMumpsRubellaVaccine1] =
    useState();
  const [dateMeaslesMumpsRubellaVaccine2, setDateMeaslesMumpsRubellaVaccine2] =
    useState();

  useEffect(() => {
    const fetchAllVaccine = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/administeredVaccines`,
          {
            params: {
              childId,
              selectedVaccineId,
            },
          }
        );
        setVaccines(response.data[0]);
        console.log(response.data[0]);
        console.log(selectedVaccineId);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllVaccine();
  }, [childId, selectedVaccineId]);

  useEffect(() => {
    const fetchAllVaccineDate = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/admnisteredVaccinesWithId/${childId}`
        );
        console.log("Dates", response.data);

        setOldDate(response.data);

        setDateBCGVaccine1(response.data[0].date);

        setDateHepatitisBVaccine1(response.data[1].date);

        setDatePentavalentVaccine1(response.data[2].date);
        setDatePentavalentVaccine2(response.data[3].date);
        setDatePentavalentVaccine3(response.data[4].date);

        setDateOralPolioVaccine1(response.data[5].date);
        setDateOralPolioVaccine2(response.data[6].date);
        setDateOralPolioVaccine3(response.data[7].date);

        setDateInactivatedPolioVaccine1(response.data[8].date);
        setDateInactivatedPolioVaccine2(response.data[9].date);

        setDatePneumococcalConjugateVaccine1(response.data[10].date);
        setDatePneumococcalConjugateVaccine2(response.data[11].date);
        setDatePneumococcalConjugateVaccine3(response.data[12].date);

        setDateMeaslesMumpsRubellaVaccine1(response.data[13].date);
        setDateMeaslesMumpsRubellaVaccine2(response.data[14].date);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllVaccineDate();
  }, []);

  const handleVaccineSelect = async (e) => {
    setSelectedVaccine(e.target.value);
    const selectedOption = e.target.options[e.target.selectedIndex];
    setSelectedVaccineId(selectedOption.dataset.info);
  };

  const returnInput = () => {
    if (selectedVaccineId === "1" && dateBCGVaccine1) {
      return (
        <input
          type="date"
          className="px-3 py-3 mb-2 border-2 rounded-md"
          value={dateBCGVaccine1}
          onChange={(e) => setDateBCGVaccine1(e.target.value)}
        />
      );
    }
    if (selectedVaccineId === "2" && dateHepatitisBVaccine1) {
      return (
        <input
          type="date"
          className="px-3 py-3 mb-2 border-2 rounded-md"
          value={dateHepatitisBVaccine1}
          onChange={(e) => setDateHepatitisBVaccine1(e.target.value)}
        />
      );
    }
    if (selectedVaccineId === "3") {
      return (
        <>
          {datePentavalentVaccine1 && (
            <input
              type="date"
              className="px-3 py-3 mb-2 border-2 rounded-md"
              value={datePentavalentVaccine1}
              onChange={(e) => setDatePentavalentVaccine1(e.target.value)}
            />
          )}
          {datePentavalentVaccine2 && (
            <input
              type="date"
              className="px-3 py-3 mb-2 border-2 rounded-md"
              value={datePentavalentVaccine2}
              onChange={(e) => setDatePentavalentVaccine2(e.target.value)}
            />
          )}
          {datePentavalentVaccine3 && (
            <input
              type="date"
              className="px-3 py-3 mb-2 border-2 rounded-md"
              value={datePentavalentVaccine3}
              onChange={(e) => setDatePentavalentVaccine3(e.target.value)}
            />
          )}
        </>
      );
    }
    if (selectedVaccineId === "4") {
      return (
        <>
          {dateOralPolioVaccine1 && (
            <input
              type="date"
              className="px-3 py-3 mb-2 border-2 rounded-md"
              value={dateOralPolioVaccine1}
              onChange={(e) => setDateOralPolioVaccine1(e.target.value)}
            />
          )}
          {dateOralPolioVaccine2 && (
            <input
              type="date"
              className="px-3 py-3 mb-2 border-2 rounded-md"
              value={dateOralPolioVaccine2}
              onChange={(e) => setDateOralPolioVaccine2(e.target.value)}
            />
          )}
          {dateOralPolioVaccine3 && (
            <input
              type="date"
              className="px-3 py-3 mb-2 border-2 rounded-md"
              value={dateOralPolioVaccine3}
              onChange={(e) => setDateOralPolioVaccine3(e.target.value)}
            />
          )}
        </>
      );
    }
    if (selectedVaccineId === "5") {
      return (
        <>
          {dateInactivatedPolioVaccine1 && (
            <input
              type="date"
              className="px-3 py-3 mb-2 border-2 rounded-md"
              value={dateInactivatedPolioVaccine1}
              onChange={(e) => setDateInactivatedPolioVaccine1(e.target.value)}
            />
          )}
          {dateInactivatedPolioVaccine2 && (
            <input
              type="date"
              className="px-3 py-3 mb-2 border-2 rounded-md"
              value={dateInactivatedPolioVaccine2}
              onChange={(e) => setDateInactivatedPolioVaccine2(e.target.value)}
            />
          )}
        </>
      );
    }
    if (selectedVaccineId === "6") {
      return (
        <>
          {datePneumococcalConjugateVaccine1 && (
            <input
              type="date"
              className="px-3 py-3 mb-2 border-2 rounded-md"
              value={datePneumococcalConjugateVaccine1}
              onChange={(e) =>
                setDatePneumococcalConjugateVaccine1(e.target.value)
              }
            />
          )}
          {datePneumococcalConjugateVaccine2 && (
            <input
              type="date"
              className="px-3 py-3 mb-2 border-2 rounded-md"
              value={datePneumococcalConjugateVaccine2}
              onChange={(e) =>
                setDatePneumococcalConjugateVaccine2(e.target.value)
              }
            />
          )}
          {datePneumococcalConjugateVaccine3 && (
            <input
              type="date"
              className="px-3 py-3 mb-2 border-2 rounded-md"
              value={datePneumococcalConjugateVaccine3}
              onChange={(e) =>
                setDatePneumococcalConjugateVaccine3(e.target.value)
              }
            />
          )}
        </>
      );
    }
    if (selectedVaccineId === "7") {
      return (
        <>
          {dateMeaslesMumpsRubellaVaccine1 && (
            <input
              type="date"
              className="px-3 py-3 mb-2 border-2 rounded-md"
              value={dateMeaslesMumpsRubellaVaccine1}
              onChange={(e) =>
                setDateMeaslesMumpsRubellaVaccine1(e.target.value)
              }
            />
          )}
          {dateMeaslesMumpsRubellaVaccine2 && (
            <input
              type="date"
              className="px-3 py-3 mb-2 border-2 rounded-md"
              value={dateMeaslesMumpsRubellaVaccine2}
              onChange={(e) =>
                setDateMeaslesMumpsRubellaVaccine2(e.target.value)
              }
            />
          )}
        </>
      );
    }
  };

  const getDateForSelectedVaccine = () => {
    switch (selectedVaccineId) {
      case "1":
        return { vaccineId: "1", date: dateBCGVaccine1 };
      case "2":
        return { vaccineId: "2", date: dateHepatitisBVaccine1 };
      case "3":
        return {
          vaccineId: "3",
          date1: datePentavalentVaccine1,
          date2: datePentavalentVaccine2,
          date3: datePentavalentVaccine3,
        };
      case "4":
        return {
          vaccineId: "4",
          date1: dateOralPolioVaccine1,
          date2: dateOralPolioVaccine2,
          date3: dateOralPolioVaccine3,
        };
      case "5":
        return {
          vaccineId: "5",
          date1: dateInactivatedPolioVaccine1,
          date2: dateInactivatedPolioVaccine2,
        };
      case "6":
        return {
          vaccineId: "6",
          date1: datePneumococcalConjugateVaccine1,
          date2: datePneumococcalConjugateVaccine2,
          date3: datePneumococcalConjugateVaccine3,
        };
      case "7":
        return {
          vaccineId: "7",
          date1: dateMeaslesMumpsRubellaVaccine1,
          date2: dateMeaslesMumpsRubellaVaccine2,
        };
      default:
        return null;
    }
  };

  const collectDatesIntoArray = () => {
    const datesArray = [
      { key: "dateBCGVaccine1", value: dateBCGVaccine1 },
      { key: "dateHepatitisBVaccine1", value: dateHepatitisBVaccine1 },
      { key: "datePentavalentVaccine1", value: datePentavalentVaccine1 },
      { key: "datePentavalentVaccine2", value: datePentavalentVaccine2 },
      { key: "datePentavalentVaccine3", value: datePentavalentVaccine3 },
      { key: "dateOralPolioVaccine1", value: dateOralPolioVaccine1 },
      { key: "dateOralPolioVaccine2", value: dateOralPolioVaccine2 },
      { key: "dateOralPolioVaccine3", value: dateOralPolioVaccine3 },
      {
        key: "dateInactivatedPolioVaccine1",
        value: dateInactivatedPolioVaccine1,
      },
      {
        key: "dateInactivatedPolioVaccine2",
        value: dateInactivatedPolioVaccine2,
      },
      {
        key: "datePneumococcalConjugateVaccine1",
        value: datePneumococcalConjugateVaccine1,
      },
      {
        key: "datePneumococcalConjugateVaccine2",
        value: datePneumococcalConjugateVaccine2,
      },
      {
        key: "datePneumococcalConjugateVaccine3",
        value: datePneumococcalConjugateVaccine3,
      },
      {
        key: "dateMeaslesMumpsRubellaVaccine1",
        value: dateMeaslesMumpsRubellaVaccine1,
      },
      {
        key: "dateMeaslesMumpsRubellaVaccine2",
        value: dateMeaslesMumpsRubellaVaccine2,
      },
    ];

    return datesArray;
  };

  const applyChanges = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/updateVaccineDate/${childId}`, {
        vaccineId: selectedVaccineId,
        // date: getDateForSelectedVaccine(), // Define the function to get the date
        oldDate: oldDate,
        newDate: collectDatesIntoArray(),
      });

      onClose();
    } catch (error) {
      console.error("Error updating vaccine date:", error);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed flex items-center justify-center w-full h-full bg-opacity-50 alertModal bg-CD9D9D9">
      <div className="flex flex-col w-1/2 px-12 py-16 bg-white rounded-lg">
        <span className="mb-5 text-xl font-semibold">
          Edit Immunization Record {childId}
        </span>
        <div className="mb-4">
          <label>Bakuna: </label>
          <select
            className="w-full px-2 py-3 border-2 rounded-lg"
            onChange={handleVaccineSelect}
            value={selectedVaccine}
          >
            <option value="BCG Vaccine" key="BCG Vaccine" data-info="1">
              BCG Vaccine
            </option>
            <option
              value="Hepatitis B Vaccine"
              key="Hepatitis B Vaccine"
              data-info="2"
            >
              Hepatitis B Vaccine
            </option>
            <option
              value="Pentavalent Vaccine (DPT-Hep B-HIB)"
              key="Pentavalent Vaccine"
              data-info="3"
            >
              Pentavalent Vaccine (DPT-Hep B-HIB)
            </option>
            <option
              value="Oral Polio Vaccine (OPV)"
              key="Oral Polio Vaccine"
              data-info="4"
            >
              Oral Polio Vaccine (OPV)
            </option>
            <option
              value="Inactivated Polio Vaccine (PIV)"
              key="Inactivated Polio Vaccine"
              data-info="5"
            >
              Inactivated Polio Vaccine (PIV)
            </option>
            <option
              value="Pneumococcal Conjugate Vaccine (PCV)"
              key="Pneumococcal Conjugate Vaccine"
              data-info="6"
            >
              Pneumococcal Conjugate Vaccine (PCV)
            </option>
            <option
              value="Measles, Mumps, Rubella Vaccine (MMR)"
              key="Measles, Mumps, Rubella Vaccine"
              data-info="7"
            >
              Measles, Mumps, Rubella Vaccine (MMR)
            </option>
          </select>
        </div>

        {/* {vaccines.map((vacccine) => {
          if (vacccine.vaccine_id === 1) {
          }
          if (vacccine.vaccine_id === 2) {
          } else if (vacccine.vaccine_id === 3) {
          }
        })} */}
        {returnInput()}

        <div className="flex items-center justify-end gap-3 mt-3">
          <button
            onClick={onClose}
            className="bg-white border-2 border-C0D3E5A text-C0D3E5A"
          >
            Close
          </button>
          <button className="text-white" onClick={applyChanges}>
            Update
          </button>
        </div>
      </div>
    </div>,
    updateImmuModal
  );
}
