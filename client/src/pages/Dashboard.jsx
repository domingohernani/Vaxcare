import React, { useState } from "react";
import { useEffect } from "react";
import WelcomeIllustration from "../assets/dashboardassets/welcomeillustration.svg";
import graph from "../assets/bmi.svg";
import axios from "axios";
import BMIChart from "../components/BMIChart ";

export default function Dashboard() {
  const [actives, setActives] = useState(0);
  const [under, setUnder] = useState(0);
  const [complete, setComplete] = useState(0);

  useEffect(() => {
    const fetchAllActive = async () => {
      try {
        const response = await axios.get("http://localhost:8800/activeBMI");
        console.log(response.data.length);
        setActives(response.data.length);
      } catch (error) {
        console.log(error);
      }
      try {
        const responseUnderImmu = await axios.get(
          "http://localhost:8800/getUnderImmunization"
        );
        setUnder(responseUnderImmu.data[0].number);
      } catch (error) {
        console.log(error);
      }
      try {
        const responseCom = await axios.get(
          "http://localhost:8800/getCompleted"
        );
        setComplete(responseCom.data.length);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllActive();
  }, []);

  return (
    <main className="">
      <div className="flex flex-row gap-3 mx-auto mb-3">
        <div className="flex-1 p-5 text-center bg-C0076BE rounded-xl">
          <h1>{actives}</h1>
          <p>Total number of active children</p>
        </div>
        <div className="flex-1 p-5 text-center bg-C0076BE rounded-xl">
          <h1>{under}</h1>
          <p>Total number of children undergoing immunization</p>
        </div>
        <div className="flex-1 p-5 text-center bg-C0076BE rounded-xl">
          <h1>{complete}</h1>
          <p>Total number of children with complete immunization</p>
        </div>
      </div>
      <div className="w-full">
        <BMIChart></BMIChart>
      </div>
    </main>
  );
}
