import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./auth.jsx";

const ProtectRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default ProtectRoutes;
