import axios from "axios";
import React, { useEffect, useState } from "react";
const Vaccines = () => {
  const [vaccines, setVaccines] = useState([]);

  // Fetch the vaccine data from the backend API
  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8800/getAllVaccines"
        );
        console.log(response.data); // Check the data structure
        setVaccines(response.data); // Store the fetched data into the state
      } catch (error) {
        console.error("Error fetching vaccines:", error);
      }
    };

    fetchVaccines();
  }, []);

  return (
    <div>
      <table className="w-full mt-3 bg-white border border-collapse rounded-lg table-auto">
        <thead>
          <tr className="my-5 text-center border-b">
            <th>Vaccine ID</th>
            <th>Name</th>
            <th>Doses Required</th>
            <th>Recommended Schedule</th>
            {/* <th>Action</th> */}
          </tr>
        </thead>
        <tbody>
          {vaccines.length > 0 ? (
            vaccines.map((vaccine) => (
              <tr key={vaccine.vaccine_id} className="text-center">
                <td>VAC-{vaccine.vaccine_id}</td>
                <td>{vaccine.name}</td>
                <td>{vaccine.doses_required}</td>
                <td>{vaccine.recommended_schedule}</td>
                <td>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="16"
                    width="14"
                    fill="red"
                    viewBox="0 0 448 512"
                    className="mx-auto cursor-pointer"
                  >
                    <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                  </svg>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No vaccines available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Vaccines;
