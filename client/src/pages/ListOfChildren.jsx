import React, { useEffect, useState } from "react";
import addIcon from "../assets/bmitrackingassets/plus.svg";
import axios from "axios";
import info from "../assets/bmitrackingassets/info.svg";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export default function ListOfChildren() {
  const [children, setChildren] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAllChild = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/listofchildren`
        );
        setChildren(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllChild();
  }, []);

  // Columns for AG Grid
  const columnDefs = [
    {
      headerName: "Child ID",
      field: "child_id",
      flex: 1,
      sortable: true,
      filter: true,
      cellRenderer: (params) => {
        return `VXCR${params.value}`;
      },
    },
    {
      headerName: "Name",
      field: "name",
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Age",
      field: "age",
      flex: 1,
      sortable: true,
      filter: true,
      valueGetter: (params) => {
        const ageInMonths = calculateAge(params.data.date_of_birth);

        if (ageInMonths >= 12) {
          const years = Math.floor(ageInMonths / 12);
          const months = ageInMonths % 12;

          if (months > 0) {
            return `${years} year/s & ${months} month/s`;
          } else {
            return `${years} year/s`;
          }
        } else {
          return `${ageInMonths} month/s`;
        }
      },
    },
    { headerName: "Sex", field: "sex", flex: 1, sortable: true, filter: true },
    {
      headerName: "Address",
      field: "address",
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Status",
      field: "status",
      flex: 1,
      sortable: true,
      filter: true,
      cellRenderer: (params) => {
        return params.value;
      },
    },
    {
      headerName: "Actions",
      flex: 1,
      cellRenderer: (params) => (
        <div className="flex items-center justify-center gap-2">
          <img src={info} alt="info" width={"15px"} />
          {params.data.status === "Underimmunization" ? (
            <NavLink to={`/viewimmunization/${params.data.child_id}`}>
              View info
            </NavLink>
          ) : (
            <NavLink to={`/viewbmitracking/${params.data.child_id}`}>
              View info
            </NavLink>
          )}
        </div>
      ),
    },
    {
      headerName: "Delete",
      flex: 1,
      cellRenderer: (params) => (
        <div className="flex items-center justify-center h-full gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16"
            width="14"
            fill="red"
            viewBox="0 0 448 512"
            onClick={() => handleDelete(params.data.child_id)}
            className="cursor-pointer"
          >
            <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
          </svg>
        </div>
      ),
    },
  ];

  // Calculate the age in months
  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const currentDate = new Date();
    const ageInMilliseconds = currentDate - birthDate;
    const ageInMonths = Math.floor(
      ageInMilliseconds / (30.44 * 24 * 60 * 60 * 1000)
    );
    return ageInMonths;
  };

  const onDelete = async (childId) => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/deleteChild/${childId}`
      );
      console.log(response);
      if (response.data.refresh) {
        window.location.reload();
        showModal();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (childId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this child?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(childId);
        Swal.fire("Deleted!", "The child has been deleted.", "success");
      }
    });
  };

  // Filtered data for search
  const filteredChildren = children.filter((child) =>
    search.toLowerCase() === ""
      ? child
      : child.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="">
      <div className="flex items-center justify-center">
        <h3 className="px-6 py-2 font-semibold bg-white rounded-lg">
          List Of Children
        </h3>
        <div className="flex items-center flex-1 gap-2 h-fit">
          {/* <input
            type="text"
            className="w-2/3 h-full py-4 pl-3 border focus:outline-none"
            placeholder="Search by name..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          /> */}
          <NavLink to={"/addchildinfo"} className={" ml-auto"}>
            <button className="flex items-center justify-center gap-2 px-4 py-4 text-white rounded-none">
              <img src={addIcon} alt="" width={"14px"} />
              <span>Add Child</span>
            </button>
          </NavLink>
        </div>
      </div>
      <div
        className="ag-theme-quartz"
        style={{ height: 600, width: "100%", paddingTop: "0.7rem" }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          rowData={filteredChildren}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
        />
      </div>
    </section>
  );
}
