import React, { useEffect, useState } from "react";
import info from "../assets/bmitrackingassets/info.svg";
import { NavLink } from "react-router-dom";
import axios from "axios";
import Deactivation from "../components/modals/Deactivation";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export default function BMITracking() {
  console.log("BMI Tracking is rendered");

  const [statusModal, setStatusModal] = useState(false);
  const [childId, setChildId] = useState();
  const [status, setStatus] = useState();
  const [children, setChildren] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredChildren, setFilteredChildren] = useState([]);

  useEffect(() => {
    const fetchAllChild = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/activeBMI`
        );
        setChildren(response.data);
        setFilteredChildren(response.data); // Setting the initial filtered children
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllChild();
  }, []);

  // Handle status modal
  const toggleDeactivationModal = () => {
    setStatusModal(!statusModal);
  };

  // Filter based on status
  const handleFilterChange = async (event) => {
    try {
      let response;
      if (event.target.value === "active") {
        response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/activeBMI`
        );
      } else if (event.target.value === "inactive") {
        response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/inactiveBMI`
        );
      } else {
        response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/completedBMI`
        );
      }
      setFilteredChildren(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const showStatusButton = (status) => {
    const statusConfig = {
      Active: {
        className: "bg-C40BE04",
        label: "Active",
      },
      Inactive: {
        className: "bg-C1886C3",
        label: "Inactive",
      },
      Completed: {
        className: "bg-white",
        label: "Completed",
      },
    };

    const config = statusConfig[status] || statusConfig.Completed;

    return (
      <span
        className={`px-5 py-2 font-normal text-white cursor-pointer rounded-3xl ${config.className}`}
        onClick={toggleDeactivationModal}
      >
        {config.label}
      </span>
    );
  };

  const calculateBMI = (value1, value2) => {
    if (!value1 || !value2) {
      return "N/A";
    }

    const weightInKg = value1;
    const heightInMeters = value2 / 100;
    const bmi = (weightInKg / Math.pow(heightInMeters, 2)).toFixed(2);

    const underweightRange = 18.5;
    const normalRange = 24.9;
    const overweightRange = 29.9;

    let bmiCategory = "";

    if (bmi < underweightRange) {
      bmiCategory = "Underweight";
    } else if (bmi <= normalRange) {
      bmiCategory = "Normal";
    } else if (bmi <= overweightRange) {
      bmiCategory = "Overweight";
    } else {
      bmiCategory = "Obese";
    }

    return bmiCategory;
  };

  // Set up the column definitions for AG Grid
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

    { headerName: "Sex", field: "sex", flex: 1, sortable: true, filter: true },
    {
      headerName: "Status",
      field: "bmi_status",
      flex: 1,
      valueGetter: (params) =>
        calculateBMI(params.data.weight, params.data.height),
    },
    // {
    //   headerName: "Status",
    //   field: "status",
    //   flex: 1,
    //   cellRenderer: (params) => (
    //     <div
    //     // onClick={() => {
    //     //   setChildId(params.data.child_id);
    //     //   setStatus(params.data.status);
    //     //   toggleDeactivationModal();
    //     // }}
    //     className="text-black"
    //     >
    //       {/* {showStatusButton(params.data.status)} */}
    //       Completed
    //     </div>
    // ),
    // },
    {
      headerName: "Actions",
      flex: 1,
      cellRenderer: (params) => (
        <div className="flex items-center justify-center gap-2">
          <img src={info} alt="info" width={"20px"} />
          <NavLink to={`/viewbmitracking/${params.data.child_id}`}>
            View info
          </NavLink>
        </div>
      ),
    },
  ];

  // Filtered data based on search input
  useEffect(() => {
    setFilteredChildren(
      children.filter((child) =>
        child.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, children]);

  return (
    <section className="">
      {statusModal && (
        <Deactivation
          toggleDeactivationModal={toggleDeactivationModal}
          childId={childId}
          status={status}
        />
      )}
      <div className="flex items-center justify-center">
        <h3 className="px-6 py-2 font-semibold bg-white rounded-lg">
          Body Mass Index Tracking
        </h3>
        <div className="flex items-center flex-1 gap-2 h-fit">
          {/* <input
            type="text"
            className="w-2/3 h-full py-4 pl-3 border focus:outline-none"
            placeholder="Search by name..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <select
            className="h-full px-2 py-4 pr-2 text-sm border focus:outline-none"
            onChange={(e) => {
              handleFilterChange(e);
            }}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select> */}
        </div>
      </div>

      {/* AG Grid Table */}
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
