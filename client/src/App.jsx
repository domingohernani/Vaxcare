import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import DashBoard from "./pages/Dashboard";
import ListOfChildren from "./pages/ListOfChildren";
import BMITracking from "./pages/BMITracking";
import Immunization from "./pages/Immunization";
import Reminders from "./pages/Reminders";
import AddChildInfo from "./components/AddChildInfo";
import ViewBMITracking from "./components/ViewBMITracking";
import ViewImmunization from "./components/ViewImmunization";
import AddImmunization from "./components/AddImmunization";
import AddBMI from "./components/AddBMI";
import LogIn from "./pages/LogIn";
import AddMedicalHistory from "./components/AddMedicalHistory";
import ManageAccounts from "./pages/ManageAccounts";
import RemindersView from "./components/ReminderView";
import EnterId from "./pages/EnterId";
import PublicViewImmu from "./pages/PublicViewImmu";
import AddAdmin from "./components/AddAdmin";
import ViewMessage from "./components/ViewMessage";
import AddMessage from "./components/modals/AddMessage";
import Vaccines from "./pages/Vaccines";
import LoginParent from "./pages/LoginParent";
import ImmunizationViewing from "./pages/ImmunizationViewing";
import { Report } from "./pages/Report";
import PublicViewing from "./pages/PublicViewing";
import VaccinesInventory from "./pages/VaccinesInventory";
import VaccinesListing from "./pages/VaccinesListing";
import { Every20Days } from "./components/Every20Days";
import ScheduledCompletedVaccination from "./components/ScheduledCompletedVaccination";
import VaccinationsSummary from "./components/VaccinationsSummary";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* publicViewing outside of the main structure */}

        <Route path="/publicViewing" element={<PublicViewing />} />
        <Route path="/enterId" element={<EnterId />} />
        <Route path="/publicviewImmu/:childId" element={<PublicViewImmu />} />
        <Route path="/" element={<LoginParent />} />
        <Route path="/immunization-viewing" element={<ImmunizationViewing />} />

        {/* Main structure with NavBar, SideBar, and main content */}
        <Route
          path="/*"
          element={
            <>
              <section className="fixed z-10 w-full">
                <NavBar />
              </section>
              <main className="flex gap-1">
                <section className="invisible">
                  <SideBar />
                </section>
                <section className="fixed h-full pt-24 border-r">
                  <SideBar />
                </section>
                <section className="flex-1 px-3 mt-28">
                  <Routes>
                    {/* Rest of your routes */}
                    <Route path="/login" element={<LogIn />} />
                    <Route path="/dashboard" element={<DashBoard />} />
                    <Route
                      path="/listofchildren"
                      element={<ListOfChildren />}
                    />
                    <Route path="/bmitracking" element={<BMITracking />} />
                    <Route path="/addchildinfo" element={<AddChildInfo />} />
                    <Route
                      path="/viewbmitracking/:childId"
                      element={<ViewBMITracking />}
                    />
                    <Route
                      path="/viewbmitracking/addbmi/:childId"
                      element={<AddBMI />}
                    />
                    <Route
                      path="/viewbmitracking/addmedicalhistory/:childId"
                      element={<AddMedicalHistory />}
                    />
                    <Route path="/immunization" element={<Immunization />} />
                    <Route
                      path="/viewimmunization/:childId"
                      element={<ViewImmunization />}
                    />
                    <Route
                      path="/addimmunization"
                      element={<AddImmunization />}
                    />
                    <Route path="/vaccines" element={<Vaccines />}>
                      {/* Nested routes for Vaccines */}
                      <Route path="listing" element={<VaccinesListing />} />
                      <Route path="inventory" element={<VaccinesInventory />} />
                    </Route>

                    <Route path="/messages" element={<Reminders />} />
                    <Route path="/addMessage" element={<AddMessage />} />
                    <Route path="/remindersView" element={<RemindersView />} />
                    <Route
                      path="/viewMessages/:parentID/:childID"
                      element={<ViewMessage />}
                    />

                    <Route path="/report" element={<Report />}>
                      <Route
                        index
                        path="summary"
                        element={<VaccinationsSummary />}
                      />
                      <Route
                        path="every-twenty-days"
                        element={<Every20Days />}
                      />
                      <Route
                        path="completed-and-completed-immunization"
                        element={<ScheduledCompletedVaccination />}
                      />
                    </Route>
                    {/* Manage Accounts */}
                    <Route
                      path="/manageaccounts"
                      element={<ManageAccounts />}
                    />
                    <Route path="/addadmin" element={<AddAdmin />} />
                  </Routes>
                </section>
              </main>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
