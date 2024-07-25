import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";

import axios from "axios";
import addIcon from "../assets/bmitrackingassets/plus.svg";
import DeleteAdmin from "../components/modals/DeleteAdmin";
import UpdateAdminModal from "../components/modals/UpdateAdminModal";

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

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const result = await axios.get("http://localhost:8800/allAdmin");
        setAdmins(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAdmins();
  }, []);

  const showModal = () => {
    setDeleteModal(!deleteModal);
  };

  const showUpdateModal = () => {
    setUpdateAdminModal(!updateAdminModal);
  };

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
      <div className="flex items-center justify-center">
        <h3 className="px-6 py-2 font-semibold bg-white rounded-lg">
          Manage Accounts
        </h3>
        <div className="flex items-center flex-1 gap-2 h-fit">
          <input
            type="text"
            className="w-2/3 h-full py-4 pl-3 border focus:outline-none"
            placeholder="Search by username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <NavLink to={"/addadmin"}>
          <button className="flex items-center justify-center gap-2 px-4 py-4 text-white rounded-none">
            <img src={addIcon} alt="" width={"14px"} />
            <span>Add Account</span>
          </button>
        </NavLink>
      </div>

      <section className="flex flex-col mx-auto mt-3 font-semibold bg-white rounded-lg">
        <table className="w-full bg-white border rounded-lg table-auto">
          <thead>
            <tr className="py-2 text-center border-b">
              <th>Username</th>
              <th className="relative">
                Password
                {hideNewPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="14"
                    width="18"
                    viewBox="0 0 640 512"
                    fill="black"
                    className="absolute cursor-pointer right-20 bottom-3"
                    onClick={() => setHideNewPassword(false)}
                  >
                    <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="14"
                    width="18"
                    viewBox="0 0 576 512"
                    fill="black"
                    className="absolute cursor-pointer right-20 bottom-3"
                    onClick={() => setHideNewPassword(true)}
                  >
                    <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                  </svg>
                )}
              </th>
              <th>Role</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {admins
              .filter((admin) => {
                return admin.admin_username
                  .toLowerCase()
                  .includes(search.toLowerCase());
              })
              .map((admin, index) =>
                admin.role !== "president" ? (
                  <>
                    <tr key={index} className="font-normal">
                      <td>{admin.admin_username}</td>
                      <td className="text-center">
                        <input
                          type={hideNewPassword ? "password" : "text"}
                          value={admin.admin_password}
                          className="focus:ring-0 focus:outline-none"
                        />
                      </td>
                      <td>
                        <span>{admin.role}</span>
                      </td>
                      <td
                        className="cursor-pointer"
                        onClick={() => {
                          setAdminIdToBePassed(admin.admin_id);
                          setNameToBePassed(admin.admin_username);
                          setPasswordToBePassed(admin.admin_password);
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

                      <td
                        className="cursor-pointer"
                        onClick={() => {
                          setAdminIdToBePassed(admin.admin_id);
                          showModal();
                        }}
                      >
                        <div className="flex items-center gap-2 text-red-600">
                          <span>Delete</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="16"
                            width="14"
                            fill="red"
                            viewBox="0 0 448 512"
                          >
                            <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                          </svg>
                        </div>
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr>
                      <td>Super Admin</td>
                    </tr>
                    <tr key={index} className="font-normal">
                      <td>{admin.admin_username}</td>
                      <td className="text-center ">
                        <input
                          type={hideNewPassword ? "password" : "text"}
                          value={admin.admin_password}
                          className="focus:ring-0 focus:outline-none"
                        />
                      </td>
                      <td>
                        <span>{admin.role}</span>
                      </td>

                      <td
                        className="cursor-pointer"
                        onClick={() => {
                          setAdminIdToBePassed(admin.admin_id);
                          setNameToBePassed(admin.admin_username);
                          setPasswordToBePassed(admin.admin_password);
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
                      <td
                        className="cursor-pointer"
                        onClick={() => console.log(admin.admin_id)}
                      ></td>
                    </tr>
                    <tr>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Admin(s)</td>
                    </tr>
                  </>
                )
              )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
