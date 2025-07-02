"use client";
import React from "react";
import Navbar from "../components/Navbar";

export default function page() {
  return (
    <>
      <div className=" bg-orange-faint">
        <Navbar />
      </div>
      <div className="bg-orange-faint min-h-screen min-w-screen"> </div>
    </>
  );
}
