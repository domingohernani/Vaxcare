import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const UserAccountTable = () => {
  const [rowData, setRowData] = useState([]);
  const [columnDefs] = useState([
    {
      headerName: "Name",
      field: "parent_name",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Relationship",
      field: "relationship",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Username",
      field: "username",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Password",
      field: "password",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Child Name",
      field: "child_name",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Actions",
      flex: 1,
      cellRenderer: (params) => {
        return (
          <div
            className="underline cursor-pointer underline-offset-4"
            onClick={() => handleSetCredentials(params.data)}
          >
            Set Credentials
          </div>
        );
      },
    },
  ]);

  const MySwal = withReactContent(Swal);

  const handleSetCredentials = (parentData) => {
    // Use existing username and password if they exist, otherwise generate new ones
    const existingUsername =
      parentData.username || `user${parentData.parent_id}`;
    const existingPassword =
      parentData.password || `pass${Math.floor(Math.random() * 10000)}`;

    MySwal.fire({
      title: "Set Credentials",
      html: `
        <input id="username" class="swal2-input" placeholder="Username" value="${existingUsername}" />
        <input id="password" type="text" class="swal2-input" placeholder="Password" value="${existingPassword}" />
      `,
      showCancelButton: true,
      confirmButtonText: "Create",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        if (!username || !password) {
          MySwal.showValidationMessage(
            `Please enter both username and password`
          );
        } else {
          return { username, password };
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Send PUT request to update credentials
        const { username, password } = result.value;
        axios
          .put(
            `http://localhost:8800/updateCredentials/${parentData.parent_id}`,
            {
              username,
              password,
            }
          )
          .then((response) => {
            // Update the rowData state after success
            setRowData((prevData) =>
              prevData.map((item) =>
                item.parent_id === parentData.parent_id
                  ? { ...item, username, password }
                  : item
              )
            );
            MySwal.fire(
              "Success",
              "Credentials updated successfully",
              "success"
            );
          })
          .catch((error) => {
            console.error("Error updating credentials:", error);
            MySwal.fire(
              "Error",
              "There was a problem updating the credentials",
              "error"
            );
          });
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the /allAccounts API endpoint
        const result = await axios.get("http://localhost:8800/allAccounts");
        setRowData(result.data);
        console.log(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="ag-theme-quartz" style={{ height: 600, width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50]}
      />
    </div>
  );
};

export default UserAccountTable;
