import React from "react";
import logo from "../assets/vaxcare_logo.png";
import { Button, Drawer, Sidebar } from "flowbite-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const ParentNavigation = ({ parentId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // Use the navigate hook to programmatically navigate

  const handleClose = () => setIsOpen(false);

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.clear();

    // Show logout alert
    Swal.fire({
      title: "You logged out!",
      text: "You have been successfully logged out.",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      // Navigate to the home route after logout
      navigate("/");
    });
  };

  const handleLogoutClick = (event) => {
    event.preventDefault();

    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout(); // Call the updated handleLogout function
      }
    });
  };

  const handleAccountUpdate = (parentId) => {
    Swal.fire({
      title: `Update Account Credentials`,
      html: `
      <input type="text" id="username" class="swal2-input" placeholder="New Username" />
      <input type="password" id="password" class="swal2-input" placeholder="New Password" />
      <input type="password" id="confirm-password" class="swal2-input" placeholder="Confirm Password" />
    `,
      focusConfirm: false,
      preConfirm: () => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const confirmPassword =
          document.getElementById("confirm-password").value;

        if (!username || !password || !confirmPassword) {
          Swal.showValidationMessage("Please fill in all fields.");
          return;
        }

        if (password !== confirmPassword) {
          Swal.showValidationMessage("Passwords do not match.");
          return;
        }

        return { username, password };
      },
      showCancelButton: true,
      confirmButtonText: "Update",
    }).then((result) => {
      if (result.isConfirmed) {
        const { username, password } = result.value;

        axios
          .put(`http://localhost:8800/updateCredentials/${parentId}`, {
            username,
            password,
          })
          .then((response) => {
            Swal.fire({
              title: "Success!",
              text: "Your credentials have been updated successfully.",
              icon: "success",
            }).then(() => {
              sessionStorage.removeItem("childrenData");
              navigate("/");
            });
          })
          .catch((error) => {
            console.log(error);

            Swal.fire({
              title: "Error!",
              text:
                error.response?.data?.error ||
                "An error occurred while updating your credentials.",
              icon: "error",
            });
          });
      }
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <img src={logo} className="w-20 h-auto" />
        <div className="items-center justify-center ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Layer_1"
            data-name="Layer 1"
            viewBox="0 0 24 24"
            width="512"
            height="512"
            onClick={() => setIsOpen(true)}
            className="w-6 h-6 cursor-pointer"
          >
            <path d="M0,4c0-.55,.45-1,1-1H18c.55,0,1,.45,1,1s-.45,1-1,1H1c-.55,0-1-.45-1-1Zm18,15H1c-.55,0-1,.45-1,1s.45,1,1,1H18c.55,0,1-.45,1-1s-.45-1-1-1Zm5-8H6c-.55,0-1,.45-1,1s.45,1,1,1H23c.55,0,1-.45,1-1s-.45-1-1-1Z" />
          </svg>
        </div>
      </div>
      <Drawer open={isOpen} onClose={handleClose} position="right">
        <Drawer.Header title="MENU" titleIcon={() => <></>} />
        <Drawer.Items>
          <Sidebar
            aria-label="Sidebar with multi-level dropdown example"
            className="[&>div]:bg-transparent [&>div]:p-0"
          >
            <div className="flex flex-col justify-between h-full py-2">
              <div>
                <Sidebar.Items>
                  <Sidebar.ItemGroup>
                    <div className="flex flex-col gap-6">
                      <NavLink
                        className="flex items-center gap-3 text-black"
                        onClick={() => handleAccountUpdate(parentId)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          id="Outline"
                          viewBox="0 0 24 24"
                          width="512"
                          height="512"
                          className="w-6 h-6"
                        >
                          <path d="M12,12A6,6,0,1,0,6,6,6.006,6.006,0,0,0,12,12ZM12,2A4,4,0,1,1,8,6,4,4,0,0,1,12,2Z" />
                          <path d="M12,14a9.01,9.01,0,0,0-9,9,1,1,0,0,0,2,0,7,7,0,0,1,14,0,1,1,0,0,0,2,0A9.01,9.01,0,0,0,12,14Z" />
                        </svg>
                        Account
                      </NavLink>
                      <NavLink
                        className="flex items-center gap-3 text-black cursor-pointer"
                        onClick={handleLogoutClick} // Use the SweetAlert trigger function here
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          id="Layer_1"
                          data-name="Layer 1"
                          viewBox="0 0 24 24"
                          width="512"
                          height="512"
                          className="w-6 h-6"
                        >
                          <path d="M11.476,15a1,1,0,0,0-1,1v3a3,3,0,0,1-3,3H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2H7.476a3,3,0,0,1,3,3V8a1,1,0,0,0,2,0V5a5.006,5.006,0,0,0-5-5H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H7.476a5.006,5.006,0,0,0,5-5V16A1,1,0,0,0,11.476,15Z" />
                          <path d="M22.867,9.879,18.281,5.293a1,1,0,1,0-1.414,1.414l4.262,4.263L6,11a1,1,0,0,0,0,2H6l15.188-.031-4.323,4.324a1,1,0,1,0,1.414,1.414l4.586-4.586A3,3,0,0,0,22.867,9.879Z" />
                        </svg>
                        Logout
                      </NavLink>
                    </div>
                  </Sidebar.ItemGroup>
                </Sidebar.Items>
              </div>
            </div>
          </Sidebar>
        </Drawer.Items>
      </Drawer>
    </div>
  );
};

export default ParentNavigation;
