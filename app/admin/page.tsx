import React from "react";
import AuthGuard from "../components/server/AuthGuard";
import AdminPage from "../components/admin/AdminPage";
// note: this page can't have use client or else the AuthGuard won't work properly.
export default function page() {
  return (
    <>
      <AuthGuard>
        <AdminPage />
      </AuthGuard>
    </>
  );
}
