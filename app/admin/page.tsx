import React from "react";
import Navbar from "../components/Navbar";
import AuthGuard from "../components/server/AuthGuard";

export default function page() {
  return (
    <>
      <AuthGuard>
        <div className=" bg-orange-faint">
          <Navbar />
        </div>
        <div className="bg-orange-faint min-h-screen min-w-screen"> </div>
      </AuthGuard>
    </>
  );
}
