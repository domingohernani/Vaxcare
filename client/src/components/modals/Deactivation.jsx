import React, { useState } from "react";
import ReactDOM from "react-dom";
import Alert from "../modals/alert.svg";
import Choose from "../modals/chooseActionIcon.svg";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

export default function Deactivation({
  toggleDeactivationModal,
  childId,
  status,
}) {
  const [showModal, setShowModal] = useState(true);
  const [showInactiveModal, setShowInactiveModal] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showActiveModal, setShowActiveModal] = useState(false);
  const navigate = useNavigate();

  const handleUpdateStatus = async (status) => {
    try {
      const response = await axios.put(
        `http://localhost:8800/updateStatusInactive/${childId}/${status}`
      );
      toggleDeactivationModal();
      console.log(response);
      location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return ReactDOM.createPortal(
    <section
      className="fixed top-0 z-50 flex items-center justify-center w-full h-full bg-opacity-50 alertModal bg-CD9D9D9"
      id="deactivationModal"
    >
      {status === "Active" ? (
        <div className="relative flex flex-col w-5/12 gap-2 px-8 py-12 text-black bg-white shadow">
          <div className="absolute w-8 h-8 top-4 right-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="Outline"
              viewBox="0 0 24 24"
            >
              <path d="M18,6h0a1,1,0,0,0-1.414,0L12,10.586,7.414,6A1,1,0,0,0,6,6H6A1,1,0,0,0,6,7.414L10.586,12,6,16.586A1,1,0,0,0,6,18H6a1,1,0,0,0,1.414,0L12,13.414,16.586,18A1,1,0,0,0,18,18h0a1,1,0,0,0,0-1.414L13.414,12,18,7.414A1,1,0,0,0,18,6Z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold">Marking Child as Inactive</h4>
          <p>Are you certain you want to mark this child as inactive?</p>
          <div className="flex gap-3 mt-3 ml-auto w-fit">
            <button
              className="flex-1 py-2 text-black bg-white border border-gray-400 rounded-none px-14"
              onClick={toggleDeactivationModal}
            >
              No
            </button>
            <button
              className="flex-1 py-2 text-white bg-blue-600 rounded-none px-14"
              onClick={() => handleUpdateStatus("Inactive")}
            >
              Yes
            </button>
          </div>
        </div>
      ) : null}
      {status === "Inactive" ? (
        <div className="relative flex flex-col w-5/12 gap-2 px-8 py-12 text-black bg-white shadow">
          <div className="absolute w-8 h-8 top-4 right-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="Outline"
              viewBox="0 0 24 24"
            >
              <path d="M18,6h0a1,1,0,0,0-1.414,0L12,10.586,7.414,6A1,1,0,0,0,6,6H6A1,1,0,0,0,6,7.414L10.586,12,6,16.586A1,1,0,0,0,6,18H6a1,1,0,0,0,1.414,0L12,13.414,16.586,18A1,1,0,0,0,18,18h0a1,1,0,0,0,0-1.414L13.414,12,18,7.414A1,1,0,0,0,18,6Z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold">Marking Child as Active</h4>
          <p>Are you certain you want to mark this child as active?</p>
          <div className="flex gap-3 mt-3 ml-auto w-fit">
            <button
              className="flex-1 py-2 text-black bg-white border border-gray-400 rounded-none px-14"
              onClick={toggleDeactivationModal}
            >
              No
            </button>
            <button
              className="flex-1 py-2 text-white bg-blue-600 rounded-none px-14"
              onClick={() => handleUpdateStatus("Active")}
            >
              Yes
            </button>
          </div>
        </div>
      ) : null}
    </section>,
    document.getElementById("deactivationModal")
  );
}
