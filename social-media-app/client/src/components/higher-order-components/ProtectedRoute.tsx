"use client";
import useUser from "@/hooks/useUser";
import { getCookie } from "cookies-next";
import React from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  
  useUser({
    redirectTo: "/login",
    token: getCookie("token") || "",
  });

  return <div>{children}</div>;
};

export default ProtectedRoute;
