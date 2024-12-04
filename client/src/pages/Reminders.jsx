import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export default function RemindersView() {
  const [reminders, setReminders] = useState([]);
  const [filteredReminders, setFilteredReminders] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllReminder = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/allAccounts`
        );
        console.log(response.data);
        setReminders(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllReminder();
  }, []);

  // Define the column definitions for AG Grid
  const columnDefs = useMemo(
    () => [
      { headerName: "Parent ID", field: "parent_id", flex: 1 },
      { headerName: "Name", field: "parent_name", flex: 1 },
      // { headerName: "Relationship", field: "parent_name", flex: 1 },
      {
        headerName: "Date",
        field: "dateSend",
        cellRenderer: (params) => {
          return (
            <div
              className="underline cursor-pointer underline-offset-4"
              onClick={() => handleSetCredentials(params.data)}
            >
              Send SMS message
            </div>
          );
        },
      },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  // Row click handler
  const onRowClicked = (row) => {
    navigate(`/viewMessages/${row.data.parent_id}/data`);
  };

  return (
    <div
      className="mb-20 ag-theme-quartz"
      style={{ height: 600, width: "100%" }}
    >
      <div className="flex items-center mb-4 justify-left">
        <h3 className="px-6 py-2 font-semibold bg-white rounded-lg">
          Reminder
        </h3>
      </div>
      <AgGridReact
        rowData={reminders}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={10}
        onRowClicked={onRowClicked}
        paginationPageSizeSelector={[10, 25, 50]}
      />
    </div>
  );
}
