import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import dashboard from "../assets/primaryIcon/chart-pie-alt.svg";
import bmi from "../assets/primaryIcon/scale.svg";
import immunization from "../assets/primaryIcon/syringe.svg";
import listofchildren from "../assets/primaryIcon/child-head.svg";
import reminders from "../assets/sidebarassets/comment-dots.svg";
import manageaccount from "../assets/primaryIcon/user.svg";
import medicine from "../assets/sidebarassets/medicine.svg";
import report from "../assets/sidebarassets/newspaper.svg";

const isAdmin = () => {
  return localStorage.getItem("role") === "president" ? true : false;
};

export default function SideBar() {
  const location = useLocation();
  const [isVaccinesExpanded, setIsVaccinesExpanded] = useState(false);

  const sideBarLinkColor = ({ isActive }) => {
    return isActive ? " rounded-lg bg-C0076BE" : "rounded-lg";
  };

  const sideBarLinkColorImmu = ({ isActive }) => {
    const urlPattern = /^\/(?:viewimmunization(?:\/\d+)?|immunization)$/;
    if (location.pathname.match(urlPattern) || isActive) {
      return "rounded-lg bg-C0076BE";
    } else {
      return "rounded-lg";
    }
  };

  const sideBarLinkColorListOfChild = ({ isActive }) => {
    const urlPattern = /^\/addchildinfo$/;
    if (location.pathname.match(urlPattern) || isActive) {
      return "rounded-lg bg-C0076BE";
    } else {
      return "rounded-lg";
    }
  };

  const changeBgByUrl = ({ isActive }) => {
    const urlPattern =
      /^\/viewbmitracking(?:\/(?:addbmi|addmedicalhistory)\/\d+)?(?:\/\d+)?|\$/;
    if (location.pathname.match(urlPattern) || isActive) {
      return "rounded-lg bg-C0076BE";
    } else {
      return "rounded-lg";
    }
  };
  const changeBgByUrlAdmin = ({ isActive }) => {
    const urlPattern = /^\/addadmin$/;
    if (location.pathname.match(urlPattern) || isActive) {
      return "rounded-lg bg-C0076BE";
    } else {
      return "rounded-lg";
    }
  };

  const changeColor = ({ isActive }) => {
    const urlPatterns = [
      /^\/reminders$/,
      /^\/viewMessages\/\d+$/,
      /^\/remindersView$/,
    ];

    const isMatchingPattern = urlPatterns.some((pattern) =>
      location.pathname.match(pattern)
    );

    if (isMatchingPattern || isActive) {
      return "rounded-lg bg-C0076BE";
    } else {
      return "rounded-lg";
    }
  };

  const toggleVaccinesMenu = () => {
    setIsVaccinesExpanded(!isVaccinesExpanded);
  };

  return (
    <section className="flex flex-col h-full gap-5 px-5 py-5 bg-primary ">
      <NavLink to={"/dashboard"} className={sideBarLinkColor}>
        <div className="flex items-center gap-2 px-6 py-3 rounded-lg ">
          <img src={dashboard} alt="" className="h-6 w-7" />
          <span className="font-medium text-black">Dashboard</span>
        </div>
      </NavLink>
      <NavLink to={"/listofchildren"} className={sideBarLinkColorListOfChild}>
        <div className="flex items-center gap-2 px-6 py-3 rounded-lg">
          <img src={listofchildren} alt="" className="w-6 h-6" />
          <span className="font-medium text-black">Children</span>
        </div>
      </NavLink>
      <NavLink to={"/bmitracking"} className={changeBgByUrl}>
        <div className="flex items-center gap-2 px-6 py-3 rounded-lg">
          <img src={bmi} alt="" className="w-6 h-6" />
          <span className="font-medium text-black">BMI Tracking</span>
        </div>
      </NavLink>
      <NavLink to={"/immunization"} className={sideBarLinkColorImmu}>
        <div className="flex items-center gap-2 px-6 py-3 rounded-lg">
          <img src={immunization} alt="" className="w-6 h-6" />
          <span className="font-medium text-black">Immunization</span>
        </div>
      </NavLink>

      {/* Expandable Vaccines Menu */}
      <div>
        <div
          className="flex items-center gap-2 px-6 py-3 rounded-lg cursor-pointer"
          onClick={toggleVaccinesMenu}
        >
          <img src={medicine} alt="" className="w-6 h-6" />
          <span className="font-medium text-black">Vaccines</span>
          <span className="ml-auto">
            {isVaccinesExpanded ? "▲" : "▼"} {/* Arrow Icon */}
          </span>
        </div>

        {/* Sub-menu for Vaccines */}
        {isVaccinesExpanded && (
          <div className="mt-2 ml-8 space-y-2">
            <NavLink
              to="/vaccines/listing"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-2 px-6 py-3 hover:text-black rounded-lg bg-C0076BE text-black"
                  : "flex items-center gap-2 px-6 py-3 hover:text-black rounded-lg text-black"
              }
            >
              <span className="font-medium">Listing</span>
            </NavLink>
            <NavLink
              to="/vaccines/inventory"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-2 px-6 py-3 hover:text-black rounded-lg bg-C0076BE text-black"
                  : "flex items-center gap-2 px-6 py-3 hover:text-black rounded-lg text-black"
              }
            >
              <span className="font-medium">Inventory</span>
            </NavLink>
          </div>
        )}
      </div>

      <NavLink to={"/report/summary"} className={sideBarLinkColor}>
        <div className="flex items-center gap-2 px-6 py-3 rounded-lg">
          <img src={report} alt="" className="w-6 h-6" />
          <span className="font-medium text-black">Report</span>
        </div>
      </NavLink>
      <NavLink to={"/messages"} className={changeColor}>
        <div className="flex items-center gap-2 px-6 py-3 rounded-lg">
          <img src={reminders} alt="" className="w-6 h-6" />
          <span className="font-medium text-black">Reminder</span>
        </div>
      </NavLink>
      {isAdmin() ? (
        <NavLink to={"/manageaccounts"} className={changeBgByUrlAdmin}>
          <div className="flex items-center gap-2 px-6 py-3 rounded-lg">
            <img src={manageaccount} alt="" className="w-6 h-6" />
            <span className="font-medium text-black">Accounts</span>
          </div>
        </NavLink>
      ) : null}
    </section>
  );
}
