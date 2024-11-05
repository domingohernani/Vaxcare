import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import addIcon from "../assets/bmitrackingassets/plus.svg";
import DeleteAdmin from "../components/modals/DeleteAdmin";
import UpdateAdminModal from "../components/modals/UpdateAdminModal";
import UserAccountTable from "../components/UserAccountTable";

export default function ManageAccounts() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [adminIdToBePassed, setAdminIdToBePassed] = useState("");
  const [nameToBePassed, setNameToBePassed] = useState("");
  const [passwordToBePassed, setPasswordToBePassed] = useState("");
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [updateAdminModal, setUpdateAdminModal] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true); // New state for checking first load

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("hasReloaded");
    if (!hasReloaded) {
      // If not reloaded before, set the flag and reload
      sessionStorage.setItem("hasReloaded", "true");
      window.location.reload(); // Reload only once
    } else {
      // If already reloaded, fetch the admin data
      const fetchAdmins = async () => {
        try {
          const result = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/allAdmin`);
          setAdmins(result.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchAdmins();
      setIsFirstLoad(false); // Now that it's loaded, it's no longer the first load
    }
  }, []);

  // If it's still loading after the first load, show loading or empty content
  if (isFirstLoad) {
    return <div>Loading...</div>; // Show loading or some placeholder
  }

  const showModal = () => {
    setDeleteModal(!deleteModal);
  };

  const showUpdateModal = () => {
    setUpdateAdminModal(!updateAdminModal);
  };

  // Filter to get only the Super Admin
  const superAdmin = admins.find((admin) => admin.role === "president");

  return (
    <div className="">
      {deleteModal && (
        <DeleteAdmin showModal={showModal} admin_id={adminIdToBePassed} />
      )}
      {updateAdminModal && (
        <UpdateAdminModal
          showUpdateModal={showUpdateModal}
          admin_id={adminIdToBePassed}
          adminName={nameToBePassed}
          oldPassword={passwordToBePassed}
        />
      )}

      {/* Display Super Admin */}
      <section className="flex flex-col mx-auto mt-3 font-semibold bg-white rounded-lg">
        <h3 className="px-6 py-2 font-semibold bg-white rounded-lg">
          Midwife Account
        </h3>

        <table className="w-full bg-white border rounded-lg table-auto">
          <thead>
            <tr className="py-2 text-center border-b">
              <th>Username</th>
              <th className="relative">Password</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {superAdmin && (
              <tr className="font-normal">
                <td>{superAdmin.admin_username}</td>
                <td className="text-center">
                  <input
                    type={hideNewPassword ? "password" : "text"}
                    value={superAdmin.admin_password}
                    className="border-none focus:ring-0 focus:outline-none"
                  />
                </td>
                <td>
                  <span>{superAdmin.role}</span>
                </td>
                <td
                  className="cursor-pointer"
                  onClick={() => {
                    setAdminIdToBePassed(superAdmin.admin_id);
                    setNameToBePassed(superAdmin.admin_username);
                    setPasswordToBePassed(superAdmin.admin_password);
                    showUpdateModal();
                  }}
                >
                  <div className="flex items-center gap-2 text-blue-600">
                    <span>Update</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      width="16"
                      fill="blue"
                      viewBox="0 0 512 512"
                    >
                      <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                    </svg>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="pt-4">
        <h3 className="px-6 py-2 font-semibold bg-white rounded-lg">
          Parent Accounts
        </h3>
        <UserAccountTable />
      </section>
    </div>
  );
}
