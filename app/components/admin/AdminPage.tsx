"use client";
import React, { useState } from "react";
import Navbar from "../Navbar";
import AdminHeader from "./AdminHeader";
import AdminPostList from "./AdminPostList";
import { AdminViewType } from "@/lib/util/types";
import AdminTableHeader from "./AdminTableHeader";

function AdminPage() {
  const [adminViewState, setAdminViewState] = useState<AdminViewType>(
    AdminViewType.POST_REPORTS
  );
  return (
    <>
      <div className=" bg-orange-faint">
        <Navbar />
      </div>
      <div className="bg-orange-faint min-h-screen min-w-screen pt-16 lg:pt-32">
        <div className="mx-20 mt-16">
          <AdminHeader school="Tufts University" />
          <hr className="border-t border-gray-300 mt-8 mb-5" />
          <AdminTableHeader
            viewState={adminViewState}
            setViewState={setAdminViewState}
          />

          <AdminPostList viewState={adminViewState} />
        </div>
      </div>
    </>
  );
}

export default AdminPage;
