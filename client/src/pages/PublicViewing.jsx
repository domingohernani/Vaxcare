import React from "react";
import publicImg from "../assets/public.svg";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bg.png";

export default function PublicViewing() {
  const navigate = useNavigate();

  return (
    <>
    <img src={bg} alt="" className=" bg"/>
      <div className="flex flex-col items-center w-screen h-screen bg-white justify-evenly">
        <div>
          <h3 className="text-2xl font-semibold text-center">
            Barangay Child Health Monitoring System
          </h3>
          <p className="text-center">
            Barangay Cabaruan, Urdaneta City, Pangasinan
          </p>
        </div>
        <div>
          <h1 className="text-3xl text-center logo logoPublic">Medicore</h1>
          <img src={publicImg} alt="" />
        </div>
        <div>
          <button
            className="text-white"
            onClick={() => {
              navigate("/enterId");
            }}
          >
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}
