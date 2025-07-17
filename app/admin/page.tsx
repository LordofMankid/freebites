import React from "react";

import Navbar from "../components/Navbar";
import AuthGuard from "../components/server/AuthGuard";
import SignoutButton from "../components/forms/SignoutButton";

export default function page() {
  return (
    <>
      <AuthGuard>
        <div className=" bg-orange-faint">
          <Navbar />
        </div>
        <div className="bg-orange-faint min-h-screen min-w-screen">
          <SignoutButton />
        </div>
      </AuthGuard>
    </>
  );
}
