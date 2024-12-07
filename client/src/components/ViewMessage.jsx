import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import empty from "../assets/empty.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewMessage = () => {
  const { parentID } = useParams();
  const [reminder, setReminder] = useState([]);
  const [message, setMessage] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentNumber, setParentNumber] = useState("");
  const navigate = useNavigate();

  // Fetch the parent's name separately
  useEffect(() => {
    const fetchParentName = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/getParentName/${parentID}`
        );
        setParentName(response.data[0].name);
        setParentNumber(response.data[0].phoneNo);
      } catch (error) {
        console.error("Error fetching parent name:", error);
      }
    };

    fetchParentName();
  }, [parentID]);

  // Fetch all reminders
  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/getAllMessages/${parentID}`
        );
        setReminder(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchAllMessages();
  }, [parentID]);

  const sendMessage = async () => {
    if (message.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please enter a valid input",
      });
      return;
    }

    const showSuccessAlert = () => {
      Swal.fire({
        icon: "success",
        title: "Great!",
        text: "The SMS has been sent successfully!",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      }).then(() => {
        success();
      });
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/message`,
        {
          message,
          recipient: parentNumber,
        }
      );
      console.log(response);
      showSuccessAlert();
    } catch (error) {
      console.error("Error sending message:", error);
    }

    const success = async () => {
      const currentDate = new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      let willReload = false;
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/insertReminder`,
          {
            message,
            currentDate,
            parentID,
          }
        );
        willReload = response.data.reloadPage;
      } catch (error) {
        console.error("Error inserting reminder:", error);
      }

      if (willReload) {
        window.location.reload();
        setTimeout(() => {
          navigate("/reminders");
        }, 3000);
      } else {
        window.alert("There is something wrong with sending the message!");
      }
    };
  };

  return (
    <section className="relative !bg-white h-screen w-full flex flex-col px-3 overflow-y-auto rounded-md">
      <div className="flex items-center w-full gap-3 ">
        <div
          className="w-10 h-10 p-1 cursor-pointer"
          onClick={() => navigate("/messages")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Outline"
            viewBox="0 0 24 24"
          >
            <path d="M10.6,12.71a1,1,0,0,1,0-1.42l4.59-4.58a1,1,0,0,0,0-1.42,1,1,0,0,0-1.41,0L9.19,9.88a3,3,0,0,0,0,4.24l4.59,4.59a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.42Z" />
          </svg>
        </div>
        <h3 className="flex-1 px-6 py-4 text-base font-normal text-left text-black rounded-lg k w-fit ">
          {parentName}
        </h3>
      </div>
      <hr />
      <div className="flex flex-col flex-1 py-14">
        {reminder.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <img src={empty} className="h-auto w-80" alt="No reminders" />
            <p>No messages right now</p>
          </div>
        ) : (
          reminder.map((remind, index) => (
            <React.Fragment key={index}>
              <span className="pt-4 mx-auto">
                {remind.dateSend
                  ? new Date(remind.dateSend).toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: false,
                    })
                  : ""}
              </span>
              {remind.message ? (
                <div className="flex flex-col items-end w-1/2 px-10 py-5 my-3 ml-auto mr-6 bg-white border border-black rounded-lg">
                  <span>{remind.message}</span>
                </div>
              ) : null}
            </React.Fragment>
          ))
        )}
      </div>
      <div className="flex items-center justify-center w-full gap-3 px-5 mb-5 bottom-3 textInputMessage">
        <input
          type="text "
          className="w-full px-3 py-3 bg-white border rounded-lg"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="px-10 text-white" onClick={sendMessage}>
          Send
        </button>
      </div>
    </section>
  );
};

export default ViewMessage;
