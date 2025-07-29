"use client";

import React from "react";
import Navbar from "../components/Navbar";
import PartnerForm from "../components/forms/PartnerForm";

export default function page() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <PartnerForm className="mt-16 lg:mt-32" />
    </div>
  );
}
