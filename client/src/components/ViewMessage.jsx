import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import back from "../assets/bmitrackingassets/back.svg";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ViewMessage = () => {
  const { parentID, childID } = useParams();
  const [reminder, setReminder] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllMessage = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/getAllMessages/${parentID}`
        );
        console.log(response);
        const data = response.data;
        setReminder(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllMessage();
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
      const response = axios.post("http://localhost:8800/message", {
        message,
      });
      console.log(response);
      showSuccessAlert();
    } catch (error) {
      showErrorAlert();
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
          "http://localhost:8800/insertReminder",
          {
            message,
            currentDate,
            parentID,
            childID,
          }
        );
        willReload = response.data.reloadPage;
      } catch (error) {
        console.log(error);
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
    <section className="relative z-40 flex flex-col px-3 overflow-y-auto bg-white rounded-md reminderScreen">
      <div className="fixed flex items-center gap-3 bg-white border-b textInputMessage">
        <div
          className="p-1 rounded-full cursor-pointer w-fit"
          onClick={() => navigate("/reminders")}
        >
          <img src={back} alt="" width={"40px"} />
        </div>
        <h3 className="flex-1 px-6 py-4 text-lg font-normal text-left text-blue-600 bg-white rounded-lg w-fit ">
          {reminder.length > 0 ? `${reminder[0].name}` : ""}
        </h3>
      </div>
      <hr />
      <div className="flex flex-col flex-1 py-14">
        {reminder.map((remind, index) => {
          return (
            <>
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
              ) : (
                ""
              )}
            </>
          );
        })}
      </div>
      <div className="fixed flex items-center justify-center gap-3 bg-white w-96 bottom-3 textInputMessage">
        <input
          type="text "
          className="w-full px-3 py-3 bg-white border rounded-lg border-blue-950"
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
