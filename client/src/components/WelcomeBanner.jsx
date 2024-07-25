import React, { useState, useEffect } from "react";
import WelcomeIllustration from "../assets/dashboardassets/welcomeillustration.svg";
import logo from "../assets/vaxcare_logo.png"

const WelcomeBanner = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const month = currentDate.toLocaleString("en-US", { month: "long" }).toUpperCase();
  const day = currentDate.toLocaleString("en-US", { day: "numeric" }); 
  return (
    <section className="flex gap-3">
      <div className="relative flex flex-col items-start justify-center py-10 pl-6 rounded-lg -z-10 outline outline-1 outline-C0076BE bg-C0076BE/20 basis-8/12 min-h-max">
        <h1 className="text-5xl welcomeText text-blue-950">
          Welcome to Vaxcare
          <img src={logo} alt="Vaxcare" />
        </h1>
        <p className="text-blue-950">Barangay Child Health Monitoring System</p>
        <img
          src={WelcomeIllustration}
          alt=""
          className="absolute right-0 h-auto w-60 top-5 -z-10"
        />
      </div>

      <div className="flex flex-col flex-1 p-4 text-lg text-white rounded-lg bg-C0076BE">
        <div className="">
          <p className="mb-2">Today</p>
          <hr />
        </div>
        <hr className="currentDateHr"/>
        <div className="flex flex-col items-center justify-center flex-1 text-xl ">
          <h2>{month}</h2>
          <h3>{day}</h3>
        </div>
      </div>
    </section>
  );
};

export default WelcomeBanner;
