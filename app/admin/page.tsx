import React from "react";

import Navbar from "../components/Navbar";
import AuthGuard from "../components/server/AuthGuard";
import AdminHeader from "../components/admin/AdminHeader";
import AdminPostList from "../components/admin/AdminPostList";

// note: this page can't have use client or else the AuthGuard won't work properly.
export default function page() {
  return (
    <>
      <AuthGuard>
        <div className=" bg-orange-faint">
          <Navbar />
        </div>
        <div className="bg-orange-faint min-h-screen min-w-screen ">
          <div className="mx-20">
            <AdminHeader />
            <AdminPostList />
          </div>
        </div>
      </AuthGuard>
    </>
  );
}
