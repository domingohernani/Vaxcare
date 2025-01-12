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

export const Every20Days = () => {
  const [vaccinationData, setVaccinationData] = useState([]);
  const [csvContent, setCsvContent] = useState("");
  const [toggleShowCSV, setToggleShowCSV] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const gridRef = useRef();

  useEffect(() => {
    const fetchVaccinationData = async () => {
      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/getVaccinatedCounts`
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

  useEffect(() => {
    const calculateInterval = () => {
      const today = new Date();
      const dayOfMonth = today.getDate();

      let intervalStart, intervalEnd;

      if (dayOfMonth <= 9) {
        intervalStart = new Date(today.getFullYear(), today.getMonth() - 1, 21);
        intervalEnd = new Date(today.getFullYear(), today.getMonth(), 9);
      } else if (dayOfMonth <= 20) {
        intervalStart = new Date(today.getFullYear(), today.getMonth(), 10);
        intervalEnd = new Date(today.getFullYear(), today.getMonth(), 20);
      } else {
        intervalStart = new Date(today.getFullYear(), today.getMonth(), 21);
        intervalEnd = new Date(today.getFullYear(), today.getMonth() + 1, 9);
      }

      const formatDate = (date) =>
        date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

      setReportTitle(
        `Vaccination Report (${formatDate(intervalStart)} to January 30, 2025)`
      );
    };

    calculateInterval();
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
      <div className="flex items-center justify-between gap-5 mb-4">
        <section className="flex flex-col flex-1 gap-3">
          <h3 className="px-6 py-2 font-semibold bg-white rounded-lg w-fit">
            {reportTitle}
          </h3>
          <p className="px-6 py-2 leading-relaxed bg-white rounded-lg">
            On this page, you can view a detailed vaccination report for the
            current 20-day interval. The report includes the number of males and
            females vaccinated for each vaccine type during this period. The
            data is dynamically updated based on the interval. Use the provided
            tools to filter, sort, and export the data as a CSV file for further
            analysis. This report provides valuable insights into vaccination
            trends within the specified time frame
          </p>
        </section>
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleCsvContent}
            className="flex items-center justify-center gap-2 px-4 py-4 text-black bg-gray-200 border rounded-lg"
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
            className="flex items-center justify-center gap-2 px-4 py-4 text-white rounded-lg"
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
