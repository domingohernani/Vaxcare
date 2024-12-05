import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const Vaccines = () => {
  return (
    <div className="flex flex-col h-full">
      {/* <nav className="mt-2 mb-4"> */}
      {/* </nav> */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Vaccines;
