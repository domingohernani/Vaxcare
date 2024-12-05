import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/vaxcare_logo.png";
import header1 from "../assets/generalIcons/header-1.png";
import header2 from "../assets/generalIcons/header-2.png";
import header3 from "../assets/generalIcons/header-3.png";
import logoutIcon from "../assets/generalIcons/logout.png";

export default function NavBar() {
  console.log("NavBar was rendered");

  const navigate = useNavigate();

  useEffect(() => {
    const result = localStorage.getItem("isLoggedIn");

    if (result !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  const logOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Log Out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/login");
      }
    });
  };

  return (
    <nav className="flex flex-row items-center justify-between px-8 py-3 border-b bg-red-30 bg-primary ">
      <section className="flex items-center gap-4">
        <div className="logo">
          <img src={logo} alt="Vaxcare" className="w-16 h-auto" />
        </div>
        <img src={header1} className="w-20 h-auto" />
      </section>
      <section className="flex items-center gap-8 text-white">
        <img src={header2} className="w-20 h-auto" />
        <div>
          <span className="text-3xl font-extrabold">Pag kumpleto,</span> <br />
          <span className="text-3xl font-extrabold">Protektado</span>
        </div>
        <img src={header3} className="w-20 h-auto" />
      </section>
      <div
        className="relative flex items-center justify-center w-12 h-12 rounded-full cursor-pointer bg-red"
        style={{ backgroundColor: "rgba(255, 0, 0, 0.59)" }}
        onClick={logOut}
      >
        <img src={logoutIcon} className="w-5 h-auto" />
      </div>
    </nav>
  );
}
