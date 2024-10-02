import React, { useEffect, useState } from "react";
import addIcon from "../assets/bmitrackingassets/plus.svg";
import axios from "axios";
import info from "../assets/bmitrackingassets/info.svg";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";

export default function ListOfChildren() {
  const [children, setChildren] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchAllChild = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8800/listofchildren"
        );
        setChildren(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllChild();
  }, []);

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

  const sortedChildren = [...children].sort((a, b) => {
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
  });

  const onDelete = async (childId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8800/deleteChild/${childId}`
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

  return (
    <section className="">
      <div className="flex items-center justify-center">
        <h3 className="px-6 py-2 font-semibold bg-white rounded-lg">
          List Of Children
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
        <NavLink to={"/addchildinfo"}>
          <button className="flex items-center justify-center gap-2 px-4 py-4 text-white rounded-none">
            <img src={addIcon} alt="" width={"14px"} />
            <span>Add Child</span>
          </button>
        </NavLink>
      </div>
      <table className="w-full mt-3 bg-white border border-collapse rounded-lg table-auto">
        <thead>
          <tr className="my-5 text-center border-b">
            <th
              onClick={() => handleSort("child_id")}
              className="cursor-pointer px-9"
              title="Sort by Child ID"
            >
              Child ID
            </th>
            <th
              onClick={() => handleSort("name")}
              className="cursor-pointer"
              title="Sort by name"
            >
              Name
            </th>
            <th
              onClick={() => handleSort("age")}
              className="cursor-pointer"
              title="Sort by age"
            >
              Age
            </th>
            <th
              onClick={() => handleSort("sex")}
              className="cursor-pointer"
              title="Sort by sex"
            >
              Sex
            </th>
            <th onClick={() => handleSort("address")}>Address</th>
            <th onClick={() => handleSort("status")}>Status</th>
            <th></th>
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
                  <td>VXCR-{child.child_id}</td>
                  <td>{child.name}</td>
                  <td>{calculateAge(child.date_of_birth)} month/s</td>
                  <td>{child.sex}</td>
                  <td>{child.address}</td>
                  {(() => {
                    if (child.status === "Active") {
                      return <td className="text-C40BE04">{child.status}</td>;
                    } else if (child.status === "Inactive") {
                      return <td className="text-C1886C3">{child.status}</td>;
                    } else if (child.status === "Underimmunization") {
                      return <td className="text-C869EAC">{child.status}</td>;
                    } else {
                      return <td className="text-C869EAC">{child.status}</td>;
                    }
                  })()}
                  <td className="text-sm text-center text-blue-600 underline cursor-pointer">
                    <div className="flex items-center justify-center gap-2">
                      <img src={info} alt="" width={"15px"} />
                      {child.status === "Underimmunization" ? (
                        <NavLink to={`/viewimmunization/${child.child_id}`}>
                          View info
                        </NavLink>
                      ) : (
                        <NavLink to={`/viewbmitracking/${child.child_id}`}>
                          View info
                        </NavLink>
                      )}
                    </div>
                  </td>
                  <td
                    className="cursor-pointer"
                    onClick={() => handleDelete(child.child_id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      width="14"
                      fill="red"
                      viewBox="0 0 448 512"
                    >
                      <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                    </svg>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </section>
  );
}
