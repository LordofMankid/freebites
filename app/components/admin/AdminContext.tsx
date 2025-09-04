// components/admin/AdminContext.tsx
"use client"; // only needed if you plan to use it in client components

import React, { createContext, useContext } from "react";
import { School, UserRole } from "@freebites/freebites-types";

type AdminContextType = {
  adminSchool: School;
  role: UserRole;
};

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminProvider>");
  return ctx;
};

export const AdminProvider = ({
  value,
  children,
}: {
  value: AdminContextType;
  children: React.ReactNode;
}) => <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
