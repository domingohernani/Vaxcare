import React, { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

export const Report = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine the active tab based on the current URL
  const activeTab = location.pathname.includes(
    "completed-and-completed-immunization"
  )
    ? "completed-and-completed-immunization"
    : location.pathname.includes("every-twenty-days")
    ? "every-twenty-days"
    : "summary";

  useEffect(() => {
    // Redirect to default tab if no sub-route is specified
    if (location.pathname === "/report") {
      navigate("/report/summary");
    }
  }, [location.pathname, navigate]);

  return (
    <section className="px-5 pt-2">
      <div className="mb-4 border-gray-200">
        <ul
          className="flex flex-wrap -mb-px text-sm text-center"
          role="tablist"
        >
          <li className="me-2">
            <button
              onClick={() => navigate("/report/summary")}
              className={`inline-block p-4 rounded-none font-medium bg-transparent border-b-2 ${
                activeTab === "summary"
                  ? "border-b-black text-black"
                  : "border-transparent text-black"
              }`}
            >
              Summary
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => navigate("/report/every-twenty-days")}
              className={`inline-block p-4 rounded-none font-medium bg-transparent border-b-2 ${
                activeTab === "every-twenty-days"
                  ? "border-b-black text-black"
                  : "border-transparent text-black"
              }`}
            >
              20-Day Vaccination Report
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() =>
                navigate("/report/completed-and-completed-immunization")
              }
              className={`inline-block p-4 rounded-none font-medium bg-transparent border-b-2 ${
                activeTab === "completed-and-completed-immunization"
                  ? "border-b-black text-black"
                  : "border-transparent text-black"
              }`}
            >
              Scheduled and Completed Immunization
            </button>
          </li>
        </ul>
      </div>

      {/* Render nested route content */}
      <div className="mt-4">
        <Outlet />
      </div>
    </section>
  );
};
