import info from "../assets/bmitrackingassets/info.svg";
import { NavLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export default function Immunization() {
  const [children, setChildren] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("activeImmu");

  // Fetching children from the database
  useEffect(() => {
    const fetchFilteredChildren = async () => {
      try {
        let url = `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/activeImmu`; // Default to active
        if (filterStatus === "completedImmu") {
          url = `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/completedImmu`;
        }
        const response = await axios.get(url);
        setChildren(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFilteredChildren();
  }, [filterStatus]); // Re-fetch data when the filter changes

  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const currentDate = new Date();
    const ageInMilliseconds = currentDate - birthDate;
    const ageInMonths = Math.floor(
      ageInMilliseconds / (1000 * 60 * 60 * 24 * 30.44)
    );
    return ageInMonths;
  };

  const columnDefs = [
    {
      headerName: "Child ID",
      field: "child_id",
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: (params) => {
        return `VXCR${params.value}`;
      },
    },
    {
      headerName: "Name",
      field: "name",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Age",
      field: "age_in_months",
      flex: 1,
      sortable: true,
      filter: true,
      valueGetter: (params) => {
        const ageInMonths = params.data.age_in_months;

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

    { headerName: "Sex", field: "sex", sortable: true, filter: true, flex: 1 },
    // {
    //   headerName: "Zone",
    //   field: "zone_number",
    //   flex: 1,
    //   valueGetter: (params) => `Zone ${params.data.zone_number}`,
    // },
    {
      headerName: "Status",
      field: "status",
      flex: 1,
      cellRenderer: (params) => {
        const statusColor = {
          Active: "text-C40BE04",
          Inactive: "text-C1886C3",
          Completed: "text-C869EAC",
        };
        return (
          <span className={statusColor[params.data.status] || "text-C869EAC"}>
            {params.data.status}
          </span>
        );
      },
    },
    {
      headerName: "Actions",
      flex: 1,
      cellRenderer: (params) => (
        <div className="flex items-center justify-center gap-2">
          <img src={info} alt="info" width={"20px"} />
          <NavLink to={`/viewimmunization/${params.data.child_id}`}>
            View info
          </NavLink>
        </div>
      ),
    },
  ];

  // Filter children based on search query
  const filteredChildren = children.filter((child) =>
    child.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="">
      <div className="flex items-center justify-between">
        <h3 className="px-6 py-2 font-semibold bg-white rounded-lg">
          Child Immunization Records
        </h3>
        <div className="flex items-center flex-1 gap-2 h-fit">
          {/* <input
            type="text"
            className="w-2/3 h-full py-4 pl-3 border focus:outline-none"
            placeholder="Search by name..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          /> */}
          <select
            className="h-full px-2 py-4 pr-2 ml-auto text-sm text-gray-400 border focus:outline-none"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="activeImmu">Active</option>
            <option value="completedImmu">Completed</option>
          </select>
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
