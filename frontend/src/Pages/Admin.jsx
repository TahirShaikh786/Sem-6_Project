import React from 'react'
import { useAuth } from '../Service/auth';
import { Navigate } from 'react-router-dom';
import AdminHeader from '../Components/AdminHeader';
import Footer from '../Components/Footer';

const Admin = () => {
  const {user} = useAuth();

  if(!user.isAdmin){
    return <Navigate to="/home" />
  }
  return (
    <>
      <AdminHeader />

      <Footer />
    </>
  )
}

export default Admin