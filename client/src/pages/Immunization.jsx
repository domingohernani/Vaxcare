import info from "../assets/bmitrackingassets/info.svg";
import filter from "../assets/generalIcons/sort.svg";
import { NavLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Immunization() {
  const [children, setChildren] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // Fetching children from the database
  useEffect(() => {
    const fetchAllChild = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8800/getAllCompleted"
        );
        setChildren(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllChild();
  }, []);

  const handleFilterChange = async (event) => {
    if (event.target.value === "activeImmu") {
      try {
        const response = await axios.get("http://localhost:8800/activeImmu");
        setChildren(response.data);
      } catch (error) {
        console.log(error);
      }
    } else if (event.target.value === "completedImmu") {
      try {
        const response = await axios.get("http://localhost:8800/completedImmu");
        setChildren(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSort = (property) => {
    if (sortBy === property) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(property);
      setSortOrder("asc");
    }
  };

  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const currentDate = new Date();
    const ageInMilliseconds = currentDate - birthDate;
    const ageInMonths = Math.floor(
      ageInMilliseconds / (30.44 * 24 * 60 * 60 * 1000)
    );
    return ageInMonths;
  };

  // Filter children based on search query
  const filteredChildren = children
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "age") {
        const ageA = calculateAge(a.date_of_birth);
        const ageB = calculateAge(b.date_of_birth);
        return sortOrder === "asc" ? ageA - ageB : ageB - ageA;
      } else if (sortBy === "sex") {
        return sortOrder === "asc"
          ? a.sex.localeCompare(b.sex)
          : b.sex.localeCompare(a.sex);
      }
      return 0;
    })
    .filter((child) => child.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <section className="">
      <div className="flex items-center justify-between">
        <h3 className="px-6 py-2 font-semibold bg-white rounded-lg">
          Child Immunization Records
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
        {/* <NavLink to={"/addimmunization"}>
          <button className="flex items-center justify-center gap-1 text-white bg-C0076BE">
            <img src={addIcon} alt="" width={"25px"} /> Add New
          </button>
        </NavLink> */}
      </div>

      <table className="w-full mt-3 bg-white border border-collapse rounded-lg table-auto">
        <thead>
          <tr className="my-5 text-center border-b">
            <th>Child ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Sex</th>
            <th>Zone</th>
            <th>Status</th>
            <th className="text-right">
              <label className="font-medium">Filter By: </label>
              <select
                className="font-medium text-center border-2 border-white outline-none "
                onChange={handleFilterChange}
              >
                <option
                  value="activeImmu"
                  key="activeImmu"
                  className="border-none outline-none"
                >
                  Active
                </option>
                <option
                  value="completedImmu"
                  key="completedImmu"
                  className="border-none outline-none"
                >
                  Completed
                </option>
              </select>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredChildren.map((child, index) => {
            return (
              <tr key={index}>
                <td>CAB-UR-{child.child_id}</td>
                <td>{child.name}</td>
                <td>{child.age_in_months} month/s</td>
                <td>{child.sex}</td>
                <td>Zone {child.zone_number}</td>
                {(() => {
                  if (child.status === "Active") {
                    return <td className="text-C40BE04">{child.status}</td>;
                  } else if (child.status === "Inactive") {
                    return <td className="text-C1886C3">{child.status}</td>;
                  } else {
                    return <td className="text-C869EAC">{child.status}</td>;
                  }
                })()}
                <td className="text-blue-600 underline cursor-pointer ">
                  <div className="flex items-center justify-center gap-2">
                    <img src={info} alt="" width={"20px"} />
                    <NavLink to={`/viewimmunization/${child.child_id}`}>
                      View info
                    </NavLink>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
