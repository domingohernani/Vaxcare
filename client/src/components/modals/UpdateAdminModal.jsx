import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

export default function UpdateAdminModal({
  showUpdateModal,
  admin_id,
  adminName,
  oldPassword,
}) {
  const [username, setUsername] = useState(adminName);
  const [newPassword, setNewPassword] = useState(oldPassword);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

  const confirmUpdate = async () => {
    if (admin_id === 1) {
      const result = await Swal.fire({
        title: "Warning!",
        text: "This action involves a Super Admin account. Please ensure that you have backed up all necessary data. Proceeding without a backup may result in the loss of access to the entire system. Are you sure you want to proceed?",
        icon: "warning",
        position: "top",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, proceed!",
      });

      if (!result.isConfirmed) {
        return;
      }
    }

    try {
      const result = await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/updateAdmin/${admin_id}`,
        {
          username,
          newPassword,
        }
      );
      if (result.data.refresh) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return ReactDOM.createPortal(
    <section
      className="fixed top-0 z-10 flex items-center justify-center w-full h-full bg-opacity-50 alertModal bg-CD9D9D9"
      id="deactivationModal"
    >
      <div className="flex flex-col items-center w-3/6 gap-8 px-8 py-8 bg-white rounded-lg ">
        <h6 className="font-semibold text-center">UPDATE ACCOUNT</h6>
        <div className="flex items-center w-full gap-3">
          <label>Username: </label>
          <input
            type="text"
            className="w-full px-3 py-2 font-normal border-2 rounded-lg"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="flex items-center w-full gap-3">
          <label>Password: </label>
          <div class="flex justify-end items-center relative w-full">
            <input
              class=" p-4 w-full px-3 py-2 font-normal border-2 rounded-lg"
              value={newPassword}
              type={hideNewPassword ? "password" : "text"}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {hideNewPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="18"
                viewBox="0 0 640 512"
                fill="gray"
                className="absolute cursor-pointer right-5"
                onClick={() => setHideNewPassword(false)}
              >
                <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="18"
                viewBox="0 0 576 512"
                fill="gray"
                className="absolute cursor-pointer right-5"
                onClick={() => setHideNewPassword(true)}
              >
                <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
              </svg>
            )}
          </div>
        </div>

        <div className="flex items-center w-full gap-3">
          <label className="">Re-Type Password: </label>
          <div class="flex justify-end items-center relative w-full">
            <input
              class=" p-4 w-full px-3 py-2 font-normal border-2 rounded-lg"
              value={confirmPassword}
              type={hideConfirmPassword ? "password" : "text"}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {hideConfirmPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="18"
                viewBox="0 0 640 512"
                fill="gray"
                className="absolute cursor-pointer right-5"
                onClick={() => setHideConfirmPassword(false)}
              >
                <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="18"
                viewBox="0 0 576 512"
                fill="gray"
                className="absolute cursor-pointer right-5"
                onClick={() => setHideConfirmPassword(true)}
              >
                <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
              </svg>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-5 mt-3">
          <button
            className="px-10 text-white bg-C0D3E5A"
            onClick={() => {
              setUsername(username.trim());
              setNewPassword(newPassword.trim());
              setConfirmPassword(confirmPassword.trim());

              if (!username || !newPassword || !confirmPassword) {
                Swal.fire({
                  icon: "error",
                  position: "top",
                  title: "Oops...",
                  text: "Invalid input. Please provide a valid input.",
                  confirmButtonText: "Ok",
                });
              } else if (newPassword !== confirmPassword) {
                Swal.fire({
                  icon: "error",
                  position: "top",
                  title: "Oops...",
                  text: "The password did not match",
                  confirmButtonText: "Ok",
                });
              } else {
                confirmUpdate();
              }
            }}
          >
            Update
          </button>
          <button
            className="px-10 text-white bg-C1886C3"
            onClick={() => showUpdateModal()}
          >
            Cancel
          </button>
        </div>
      </div>
    </section>,
    document.getElementById("deactivationModal")
  );
}
