import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import addIcon from "../assets/bmitrackingassets/plus.svg";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useLocation } from "react-router-dom";

const VaccinesListing = () => {
  const [vaccines, setVaccines] = useState([]);
  const location = useLocation();

  const breadcrumbs = location.pathname
    .split("/")
    .filter((path) => path)
    .map((path, index, arr) => {
      const to = `/${arr.slice(0, index + 1).join("/")}`;
      const isLast = index === arr.length - 1;
      return {
        name: path.charAt(0).toUpperCase() + path.slice(1),
        to,
        isLast,
      };
    });

  const fetchVaccines = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/getAllVaccines`
      );
      setVaccines(response.data);
    } catch (error) {
      console.error("Error fetching vaccines:", error);
    }
  };

  useEffect(() => {
    fetchVaccines();
  }, []);

  const handleAddNewVaccine = () => {
    Swal.fire({
      title: "Add New Vaccine",
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Vaccine Name">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Doses Required" type="number">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Recommended Schedule">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Add Vaccine",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const name = document.getElementById("swal-input1").value;
        const doses_required = document.getElementById("swal-input2").value;
        const recommended_schedule =
          document.getElementById("swal-input3").value;

        if (!name || !doses_required || !recommended_schedule) {
          Swal.showValidationMessage("Please fill all fields");
          return;
        }

        return { name, doses_required, recommended_schedule };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { name, doses_required, recommended_schedule } = result.value;

        try {
          // Send data to the backend to add a new vaccine record
          const response = await axios.post(
            `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/addVaccine`,
            {
              name,
              doses_required,
              recommended_schedule,
            }
          );

          // If the record was successfully added, fetch updated vaccines and show a success message
          if (response.data.success) {
            fetchVaccines();
            Swal.fire("Success!", "New vaccine added successfully.", "success");
          } else {
            Swal.fire("Error", "Failed to add vaccine.", "error");
          }
        } catch (error) {
          console.error("Error adding new vaccine:", error);
          Swal.fire("Error", "Failed to add vaccine.", "error");
        }
      }
    });
  };

  const handleDeleteVaccine = (vaccine_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Send delete request to the backend
          const response = await axios.delete(
            `${
              import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
            }/deleteVaccine/${vaccine_id}`
          );

          // If deletion was successful, refresh the vaccines table
          if (response.data.success) {
            fetchVaccines();
            Swal.fire("Deleted!", "Your vaccine has been deleted.", "success");
          } else {
            Swal.fire("Error", "Failed to delete vaccine.", "error");
          }
        } catch (error) {
          console.error("Error deleting vaccine:", error);
          Swal.fire("Error", "Failed to delete vaccine.", "error");
        }
      }
    });
  };

  const columnDefs = [
    {
      headerName: "Vaccine ID",
      field: "vaccine_id",
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Name",
      field: "name",
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Doses Required",
      field: "doses_required",
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Recommended Schedule",
      field: "recommended_schedule",
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Action",
      flex: 1,
      cellRenderer: (params) => (
        <div className="flex items-center justify-center h-full gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16"
            width="14"
            fill="red"
            viewBox="0 0 448 512"
            className="mx-auto cursor-pointer"
            onClick={() => handleDeleteVaccine(params.data.vaccine_id)}
          >
            <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
          </svg>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 bg-white rounded-lg w-fit">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <h3 className="py-2 font-semibold ">
                {!crumb.isLast ? (
                  <span to={crumb.to}>{crumb.name}</span>
                ) : (
                  <span>{crumb.name}</span>
                )}
              </h3>
              {index < breadcrumbs.length - 1 && (
                <span className="font-bold text-gray-600">{">"}</span>
              )}
            </React.Fragment>
          ))}
        </div>
        <button
          className="flex items-center justify-center gap-2 px-4 py-4 ml-auto text-white rounded-none"
          onClick={handleAddNewVaccine}
        >
          <img src={addIcon} alt="" width={"14px"} />
          <span>Add New</span>
        </button>
      </div>

      <div
        className="ag-theme-quartz"
        style={{ height: 600, width: "100%", paddingTop: "0.7rem" }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          rowData={vaccines}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
        />
      </div>
    </div>
  );
};

export default VaccinesListing;
