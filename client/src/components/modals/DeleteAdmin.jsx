import React, { useState } from "react";
import ReactDOM from "react-dom";
import Alert from "../modals/alert.svg";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

export default function DeleteAdmin({ showModal, admin_id }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/deleteAdmin/${admin_id}`
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

  return ReactDOM.createPortal(
    <section
      className="fixed top-0 z-10 flex items-center justify-center w-full h-full bg-opacity-50 alertModal bg-CD9D9D9"
      id="deactivationModal"
    >
      <div className="flex flex-col items-center w-5/12 gap-2 px-8 py-12 bg-white rounded-lg">
        <img src={Alert} alt="illustration" width="100px" />
        <h4 className="text-lg font-semibold">
          Are you sure you want to delete?
        </h4>
        <div className="flex gap-3 mt-3">
          <button
            className="flex-1 px-10 py-1 text-white bg-C0D3E5A"
            onClick={() => {
              handleDelete();
            }}
          >
            Delete
          </button>
          <button
            className="flex-1 px-10 py-1 text-white bg-C1886C3"
            onClick={showModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </section>,
    document.getElementById("deactivationModal")
  );
}
