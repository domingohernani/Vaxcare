import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useSearchParams } from "react-router-dom";
import ViewImmunization from "../components/ViewImmunization";
import { useNavigate } from "react-router-dom";

export default function RemindersView() {
  const [search, setSearch] = useState("");
  const [reminders, setReminders] = useState([]);
  const [filteredReminders, setFilteredReminders] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllReminder = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8800/getAllRemindersWithParent"
        );
        console.log(response.data);
        setReminders(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllReminder();
  }, []);

  useEffect(() => {
    const filteredList = reminders.filter(
      (reminder) =>
        reminder.parent.toLowerCase().includes(search.toLowerCase()) ||
        reminder.child.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredReminders(filteredList);
  }, [search, reminders]);

  return (
    <div className="">
      <div className="flex items-center justify-center ">
        <h3 className="px-6 py-2 font-semibold bg-white rounded-lg">
          Reminder Messages
        </h3>
        <div className="flex items-center flex-1 gap-2 h-fit">
          <input
            type="text"
            className="w-2/3 h-full py-4 pl-3 border focus:outline-none"
            placeholder="Search by name..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
      </div>
      <section className="rounded-md">
        {filteredReminders.map((reminder, index) => (
          <div
            key={index}
            className="relative p-4 my-3  hover:bg-slate-100 rounded-md cursor-pointer"
            onClick={() =>
              navigate(`/viewMessages/${reminder.parentID}/${reminder.childID}`)
            }
          >
            <span className="font-bold">{index + 1}. </span>
            <div className="flex gap-5">
              <h3 className="flex-1 font-semibold">
                Parent:{" "}
                <span className="font-normal -z-20">{reminder.parent}</span>
              </h3>
            </div>
            <h3 className="mr-10 font-semibold">
              Child: <span className="font-normal -z-20">{reminder.child}</span>
            </h3>

            <p className="text-sm text-right text-gray-400">
              Date:{" "}
              {new Date(reminder.dateSend).toLocaleDateString() != "1/1/1970"
                ? new Date(reminder.dateSend).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
