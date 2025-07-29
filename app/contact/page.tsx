"use client";
import React from "react";
import Navbar from "../components/Navbar";
import EmailForm from "../components/forms/EmailForm";

export default function page() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <EmailForm className="mt-16 lg:mt-32" />
    </div>
  );
}
