import React, { useEffect, useState } from "react";
import info from "../assets/bmitrackingassets/info.svg";
import filter from "../assets/generalIcons/sort.svg";
import { NavLink, useSearchParams } from "react-router-dom";
import Deactivation from "../components/modals/Deactivation";
import axios from "axios";

export default function BMITracking() {
  console.log("BMI Tracking is rendered");

  const [statusModal, setStatusModal] = useState(false);
  const [childId, setChildId] = useState();
  const [status, setStatus] = useState();
  const [children, setChildren] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleFilterChange = async (event) => {
    if (event.target.value === "active") {
      try {
        const response = await axios.get("http://localhost:8800/activeBMI");
        setChildren(response.data);
      } catch (error) {
        console.log(error);
      }
    } else if (event.target.value === "inactive") {
      try {
        const response = await axios.get("http://localhost:8800/inactiveBMI");
        setChildren(response.data);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await axios.get("http://localhost:8800/completedBMI");
        setChildren(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Kinukuha yung mga children from the database
  useEffect(() => {
    const fetchAllChild = async () => {
      try {
        const response = await axios.get("http://localhost:8800/activeBMI");
        setChildren(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllChild();
  }, []);

  const toggleDeactivationModal = () => {
    setStatusModal(!statusModal);
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
        className: "bg-C869EAC",
        label: "Completed",
      },
    };

    const config = statusConfig[status] || statusConfig.Completed;

    return (
      <button
        className={`px-5 py-1 font-normal text-white rounded-3xl ${config.className}`}
        onClick={toggleDeactivationModal}
      >
        {config.label}
      </button>
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

  const handleSort = (property) => {
    if (sortBy === property) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(property);
      setSortOrder("asc");
    }
  };

  const sortedChildren = [...children].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === "age") {
      const ageA = a.age_in_months;
      const ageB = b.age_in_months;
      return sortOrder === "asc" ? ageA - ageB : ageB - ageA;
    } else if (sortBy === "sex") {
      return sortOrder === "asc"
        ? a.sex.localeCompare(b.sex)
        : b.sex.localeCompare(a.sex);
    }
    return 0;
  });

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
          <input
            type="text"
            className="w-2/3 h-full py-4 pl-3 border focus:outline-none"
            placeholder="Search by name..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <select
            className="h-full px-2 py-4 pr-2 text-sm text-gray-400 border focus:outline-none"
            onChange={(e) => {
              handleSort(e.target.value);
            }}
          >
            <option value={"child_id"}>Child ID</option>
            <option value={"name"}>Name</option>
            <option value={"age"}>Age</option>
            <option value={"sex"}>Sex</option>
          </select>
        </div>
      </div>
      <table className="w-full mt-3 bg-white border border-collapse rounded-lg table-auto">
        <thead>
          <tr className="my-5 text-center border-b">
            <th>Child ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Sex</th>
            <th>BMI Status</th>
            <th>Status</th>
            <th className="text-right">
              <label className="font-medium">Filter By: </label>
              <select
                className="font-medium text-center border-2 border-white outline-none "
                onChange={handleFilterChange}
              >
                <option
                  value="active"
                  key="active"
                  className="border-none outline-none"
                >
                  Active
                </option>
                <option
                  value="inactive"
                  key="inactive"
                  className="border-none outline-none"
                >
                  Inactive
                </option>
              </select>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedChildren
            .filter((child) => {
              return search.toLowerCase() === ""
                ? child
                : child.name.toLowerCase().includes(search.toLowerCase());
            })
            .map((child, index) => {
              return (
                <tr key={index}>
                  <td>CAB-UR-{child.child_id}</td>
                  <td>{child.name}</td>
                  <td>{child.age_in_months} month/s</td>

                  <td>{child.sex}</td>
                  <td> {calculateBMI(child.weight, child.height)}</td>
                  <td
                    onClick={() => {
                      setChildId(child.child_id);
                      setStatus(child.status);
                    }}
                  >
                    {showStatusButton(child.status)}
                  </td>
                  <td className="text-blue-600 underline cursor-pointer ">
                    <div className="flex items-center justify-center gap-2">
                      <img src={info} alt="" width={"20px"} />
                      <NavLink to={`/viewbmitracking/${child.child_id}`}>
                        View info
                      </NavLink>
                    </div>
                  </td>
                </tr>
              );
            })}

          {/* 
          <td>
            <button
              className="px-5 py-1 font-normal text-white bg-C40BE04 rounded-3xl"
              onClick={toggleDeactivationModal}
            >
              Active
            </button>
          </td>
          <td className="text-blue-600 underline cursor-pointer ">
            <div className="flex items-center justify-center gap-2">
              <img src={info} alt="" width={"20px"} />
              <NavLink to={"/viewbmitracking/" + childId}>View info</NavLink>
            </div>
          </td> */}
        </tbody>
      </table>
    </section>
  );
}
