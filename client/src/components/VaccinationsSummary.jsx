import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { AgGridReact } from "@ag-grid-community/react";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { CsvExportModule } from "@ag-grid-community/csv-export";
import { ModuleRegistry } from "@ag-grid-community/core";
import {
  ArrowDownOnSquareStackIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([ClientSideRowModelModule, CsvExportModule]);

const VaccinationsSummary = () => {
  const [completedVaccinationData, setCompletedVaccinationData] = useState([]);
  const [csvContentCompleted, setCsvContentCompleted] = useState("");
  const [toggleShowCSVCompleted, setToggleShowCSVCompleted] = useState(false);
  const completedGridRef = useRef();

  useEffect(() => {
    const fetchVaccinationData = async () => {
      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/getCompletedVaccinations`
        );

        // Format the `date_administered` to "YYYY-MM-DD"
        const formattedData = data.map((item) => ({
          ...item,
          date_administered: new Date(item.date_administered)
            .toISOString()
            .split("T")[0], // Converts to "YYYY-MM-DD"
        }));

        setCompletedVaccinationData(formattedData);
      } catch (error) {
        console.error("Error fetching completed vaccination data:", error);
      }
    };

    fetchVaccinationData();
  }, []);

  const completedColumnDefs = [
    {
      headerName: "Child Name",
      field: "child_name",
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Vaccine Name",
      field: "vaccine_name",
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Date Administered",
      field: "date_administered",
      flex: 1,
      sortable: true,
      filter: true,
    },
  ];

  const defaultColDef = {
    filter: true,
    sortable: true,
    floatingFilter: true,
  };

  const handleExportCompleted = () => {
    completedGridRef.current.api.exportDataAsCsv();
  };

  const handleToggleCsvCompleted = () => {
    if (toggleShowCSVCompleted) {
      setCsvContentCompleted("");
      setToggleShowCSVCompleted(false);
    } else {
      const csvData = completedGridRef.current.api.getDataAsCsv();
      setCsvContentCompleted(csvData);
      setToggleShowCSVCompleted(true);
    }
  };

  return (
    <section>
      {/* Completed Vaccinations Table */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="px-6 py-2 font-semibold bg-white rounded-lg">
            Completed Vaccinations Summary
          </h3>
          <div className="flex items-center gap-4">
            {/* Show/Hide CSV */}
            <button
              onClick={handleToggleCsvCompleted}
              className="flex items-center justify-center gap-2 px-4 py-4 text-black bg-gray-200 border rounded-none"
            >
              {toggleShowCSVCompleted ? (
                <>
                  <EyeSlashIcon className="w-5 h-5 text-black" />
                  <span>Hide CSV</span>
                </>
              ) : (
                <>
                  <EyeIcon className="w-5 h-5 text-black" />
                  <span>Show CSV</span>
                </>
              )}
            </button>
            {/* Export CSV */}
            <button
              onClick={handleExportCompleted}
              className="flex items-center justify-center gap-2 px-4 py-4 text-white rounded-none"
            >
              <ArrowDownOnSquareStackIcon className="w-5 h-5 text-white" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>
        <div className="ag-theme-quartz" style={{ height: 600, width: "100%" }}>
          <AgGridReact
            ref={completedGridRef}
            rowData={completedVaccinationData}
            columnDefs={completedColumnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={10}
          />
        </div>
        {toggleShowCSVCompleted && (
          <div className="mt-4">
            <textarea
              value={csvContentCompleted}
              readOnly
              placeholder="CSV content will appear here when you click 'Show CSV'"
              className="h-40 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default VaccinationsSummary;
