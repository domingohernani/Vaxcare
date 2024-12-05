import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useLocation } from "react-router-dom";

const VaccinesInventory = () => {
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

  const handleUpdateStock = async (vaccine_id, currentStock) => {
    const { value: newStock } = await Swal.fire({
      title: "Update Stock",
      input: "number",
      inputLabel: "Enter new stock value",
      inputPlaceholder: "Stock value",
      inputValue: currentStock,
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value || isNaN(value) || value < 0) {
          return "Please enter a valid stock value!";
        }
      },
    });

    if (newStock) {
      try {
        const response = await axios.put(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/updateStock/${vaccine_id}`,
          { stock: parseInt(newStock, 10) }
        );

        if (response.data.message) {
          Swal.fire("Success!", response.data.message, "success");
          fetchVaccines(); // Refresh the vaccines data
        }
      } catch (error) {
        console.error("Error updating stock:", error);
        Swal.fire(
          "Error",
          "Failed to update stock. Please try again.",
          "error"
        );
      }
    }
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
      headerName: "Stock",
      field: "stock",
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Update Stock",
      flex: 1,
      cellRenderer: (params) => (
        <div className="flex items-center justify-center h-full gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Outline"
            viewBox="0 0 24 24"
            width="512"
            height="512"
            className="w-4 h-4 cursor-pointer"
            onClick={() =>
              handleUpdateStock(params.data.vaccine_id, params.data.stock)
            }
          >
            <path d="M12,2a10.032,10.032,0,0,1,7.122,3H16a1,1,0,0,0-1,1h0a1,1,0,0,0,1,1h4.143A1.858,1.858,0,0,0,22,5.143V1a1,1,0,0,0-1-1h0a1,1,0,0,0-1,1V3.078A11.981,11.981,0,0,0,.05,10.9a1.007,1.007,0,0,0,1,1.1h0a.982.982,0,0,0,.989-.878A10.014,10.014,0,0,1,12,2Z" />
            <path d="M22.951,12a.982.982,0,0,0-.989.878A9.986,9.986,0,0,1,4.878,19H8a1,1,0,0,0,1-1H9a1,1,0,0,0-1-1H3.857A1.856,1.856,0,0,0,2,18.857V23a1,1,0,0,0,1,1H3a1,1,0,0,0,1-1V20.922A11.981,11.981,0,0,0,23.95,13.1a1.007,1.007,0,0,0-1-1.1Z" />
          </svg>
        </div>
      ),
    },
  ];

  return (
    <div>
      <nav className="mt-2 mb-2">
        <div className="flex items-center gap-2 px-3 bg-white rounded-lg w-fit">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <h3 className="py-2 font-semibold ">
                {!crumb.isLast ? (
                  <span>{crumb.name}</span>
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
      </nav>

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

export default VaccinesInventory;
