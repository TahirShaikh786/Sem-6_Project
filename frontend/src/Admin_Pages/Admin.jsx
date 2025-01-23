import React from "react";
import "../assets/CSS/admin.css";
import { useAuth } from "../Service/auth";
import { Navigate } from "react-router-dom";
import AdminHeader from "../Components/AdminHeader";
import Footer from "../Components/Footer";
import User from "./User";

const Admin = () => {
  const { user } = useAuth();

  if (!user.isAdmin) {
    return <Navigate to="/home" />;
  }

  return (
    <>
      <AdminHeader />

      <User />

      <Footer />
    </>
  );
};

export default Admin;
