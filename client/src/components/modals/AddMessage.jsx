import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Alert from "../modals/alert.svg";
import Choose from "../modals/chooseActionIcon.svg";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

export default function AddMessage() {
  const [showModal, setShowModal] = useState(true);
  const [showInactiveModal, setShowInactiveModal] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showActiveModal, setShowActiveModal] = useState(false);
  const navigate = useNavigate();

  const [parentInput, setParentInput] = useState("");

  useEffect(() => {}, [parentInput]);

  return ReactDOM.createPortal(
    <section
      className="fixed flex items-center justify-center w-full h-full bg-opacity-50 alertModal bg-CD9D9D9"
      id="deactivationModal"
    >
      <div className="flex flex-col items-center w-5/12 gap-2 px-5 py-12 bg-white rounded-lg">
        <h4 className="text-lg font-semibold">Send new message</h4>
        <div className="flex items-center w-full gap-2">
          <div className="flex gap-1">
            <span>Search </span>
            <span>parent </span>
          </div>
          <input
            type="text"
            className="w-full px-2 py-2 border rounded-lg"
            value={parentInput}
            onChange={(e) => setParentInput(e.target.value)}
          />
        </div>
      </div>
    </section>,
    document.getElementById("deactivationModal")
  );
}
