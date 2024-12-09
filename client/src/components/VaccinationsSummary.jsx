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
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/getAllVaccinations`
        );

        setCompletedVaccinationData(data);
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
      sort: "desc",
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
        <div className="flex items-center justify-between gap-5 mb-4">
          <section className="flex flex-col flex-1 gap-3">
            <h3 className="px-6 py-2 font-semibold bg-white rounded-lg w-fit">
              Completed Vaccinations Summary
            </h3>
            <p className="px-6 py-2 leading-relaxed bg-white rounded-lg">
              On this page, you can view a comprehensive summary of all
              completed vaccinations. The table provides detailed information,
              including the child's name, the name of the vaccine administered,
              and the date it was administered. You can also export the data in
              CSV format for reporting or archival purposes. Use the available
              filters and sorting options to quickly locate specific records.
              This summary serves as a centralized view of vaccination records
              for monitoring and analysis.
            </p>
          </section>
          <div className="flex items-center justify-end gap-4 bg-red-300 w-max">
            {/* Show/Hide CSV */}
            <button
              onClick={handleToggleCsvCompleted}
              className="flex items-center justify-center gap-2 px-4 py-4 text-black bg-gray-200 border rounded-lg"
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
              className="flex items-center justify-center gap-2 px-4 py-4 text-white rounded-lg"
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
            paginationPageSizeSelector={[10, 25, 50]}
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
