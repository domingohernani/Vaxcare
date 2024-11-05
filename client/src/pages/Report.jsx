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

export const Report = () => {
  const [vaccinationData, setVaccinationData] = useState([]);
  const [csvContent, setCsvContent] = useState("");
  const [toggleShowCSV, setToggleShowCSV] = useState(false);
  const gridRef = useRef();

  useEffect(() => {
    const fetchVaccinationData = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8800/getVaccinatedCounts"
        );
        const transformedData = Object.entries(data).map(
          ([vaccineName, counts]) => ({
            vaccine_name: vaccineName,
            male: counts.male,
            female: counts.female,
          })
        );
        setVaccinationData(transformedData);
      } catch (error) {
        console.log("Error fetching vaccination data:", error);
      }
    };

    fetchVaccinationData();
  }, []);

  const columnDefs = [
    {
      headerName: "Vaccine Name",
      field: "vaccine_name",
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Male Vaccinated",
      field: "male",
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Female Vaccinated",
      field: "female",
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

  const handleExport = () => {
    gridRef.current.api.exportDataAsCsv();
  };

  const handleToggleCsvContent = () => {
    if (toggleShowCSV) {
      setCsvContent("");
      setToggleShowCSV(false);
    } else {
      const csvData = gridRef.current.api.getDataAsCsv();
      setCsvContent(csvData);
      setToggleShowCSV(true);
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h3 className="px-6 py-2 font-semibold bg-white rounded-lg">
          Report
        </h3>
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleCsvContent}
            className="flex items-center justify-center gap-2 px-4 py-4 text-black bg-gray-200 border rounded-none"
          >
            {toggleShowCSV ? (
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
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-4 py-4 text-white rounded-none"
          >
            <ArrowDownOnSquareStackIcon className="w-5 h-5 text-white" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>
      <div className="ag-theme-quartz" style={{ height: 600, width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          rowData={vaccinationData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
        />
      </div>
      {toggleShowCSV && (
        <div className="mt-4">
          <textarea
            value={csvContent}
            readOnly
            placeholder="CSV content will appear here when you click 'Show CSV'"
            className="h-40 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
          />
        </div>
      )}
    </section>
  );
};
