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

const ScheduledCompletedVaccination = () => {
  const [scheduledVaccinationData, setScheduledVaccinationData] = useState([]);
  const [completedVaccinationData, setCompletedVaccinationData] = useState([]);
  const [csvContentScheduled, setCsvContentScheduled] = useState("");
  const [csvContentCompleted, setCsvContentCompleted] = useState("");
  const [toggleShowCSVScheduled, setToggleShowCSVScheduled] = useState(false);
  const [toggleShowCSVCompleted, setToggleShowCSVCompleted] = useState(false);
  const scheduledGridRef = useRef();
  const completedGridRef = useRef();

  useEffect(() => {
    const fetchVaccinationData = async () => {
      try {
        const scheduledResponse = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/getScheduledVaccinations`
        );

        // Format `date_scheduled` to "YYYY-MM-DD"
        const formattedScheduledData = scheduledResponse.data.map((item) => ({
          ...item,
          date_scheduled: new Date(item.date_scheduled)
            .toISOString()
            .split("T")[0],
        }));
        setScheduledVaccinationData(formattedScheduledData);

        const completedResponse = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/getCompletedVaccinations`
        );

        // Format `date_administered` to "YYYY-MM-DD"
        const formattedCompletedData = completedResponse.data.map((item) => ({
          ...item,
          date_administered: new Date(item.date_administered)
            .toISOString()
            .split("T")[0],
        }));
        setCompletedVaccinationData(formattedCompletedData);
      } catch (error) {
        console.error("Error fetching vaccination data:", error);
      }
    };

    fetchVaccinationData();
  }, []);

  const scheduledColumnDefs = [
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
      headerName: "Date Scheduled",
      field: "date_scheduled",
      flex: 1,
      sortable: true,
      filter: true,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        const formattedDate = `${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${date
          .getDate()
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`;
        return formattedDate;
      },
    },
  ];

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
      valueFormatter: (params) => {
        const date = new Date(params.value);
        const formattedDate = `${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${date
          .getDate()
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`;
        return formattedDate;
      },
    },
  ];

  const defaultColDef = {
    filter: true,
    sortable: true,
    floatingFilter: true,
  };

  const handleExportScheduled = () => {
    scheduledGridRef.current.api.exportDataAsCsv();
  };

  const handleExportCompleted = () => {
    completedGridRef.current.api.exportDataAsCsv();
  };

  const handleToggleCsvScheduled = () => {
    if (toggleShowCSVScheduled) {
      setCsvContentScheduled("");
      setToggleShowCSVScheduled(false);
    } else {
      const csvData = scheduledGridRef.current.api.getDataAsCsv();
      setCsvContentScheduled(csvData);
      setToggleShowCSVScheduled(true);
    }
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
      {/* Scheduled Vaccinations Table */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-5 mb-4">
          <section className="flex flex-col flex-1 gap-3">
            <h3 className="px-6 py-2 font-semibold bg-white rounded-lg w-fit">
              Scheduled Vaccinations for Today
            </h3>
            <p className="px-6 py-2 leading-relaxed bg-white rounded-lg">
              This table provides a comprehensive overview of all vaccinations
              scheduled for today. It includes details such as the child's name,
              the name of the vaccine, and the scheduled date for
              administration. You can use the filters and sorting options to
              organize the data as needed. Additionally, the data can be
              exported as a CSV file for easy reporting and tracking.
            </p>
          </section>
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleCsvScheduled}
              className="flex items-center justify-center gap-2 px-4 py-4 text-black bg-gray-200 border rounded-lg"
            >
              {toggleShowCSVScheduled ? (
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
              onClick={handleExportScheduled}
              className="flex items-center justify-center gap-2 px-4 py-4 text-white rounded-lg"
            >
              <ArrowDownOnSquareStackIcon className="w-5 h-5 text-white" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>
        <div className="ag-theme-quartz" style={{ height: 600, width: "100%" }}>
          <AgGridReact
            ref={scheduledGridRef}
            rowData={scheduledVaccinationData}
            columnDefs={scheduledColumnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 25, 50]}
          />
        </div>
        {toggleShowCSVScheduled && (
          <div className="mt-4">
            <textarea
              value={csvContentScheduled}
              readOnly
              placeholder="CSV content will appear here when you click 'Show CSV'"
              className="h-40 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
            />
          </div>
        )}
      </div>

      {/* Completed Vaccinations Table */}
      <div>
        <div className="flex items-center justify-between gap-5 mb-4">
          <section className="flex flex-col flex-1 gap-3">
            <h3 className="px-6 py-2 font-semibold bg-white rounded-lg w-fit">
              Completed Vaccinations for Today
            </h3>
            <p className="px-6 py-2 leading-relaxed bg-white rounded-lg">
              This table displays all vaccinations that have been successfully
              administered today. It includes information on the child's name,
              the vaccine administered, and the date of administration. The
              table allows for filtering and sorting of data, and you can export
              the records as a CSV file for record-keeping and analysis.
            </p>
          </section>
          <div className="flex items-center gap-4">
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

export default ScheduledCompletedVaccination;
