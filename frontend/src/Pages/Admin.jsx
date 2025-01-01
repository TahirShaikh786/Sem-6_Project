import React from 'react'
import { useAuth } from '../Service/auth';
import { Navigate } from 'react-router-dom';
import AdminHeader from '../Components/AdminHeader';

const Admin = () => {
  const {user} = useAuth();

  if(!user.isAdmin){
    return <Navigate to="/home" />
  }
  return (
    <>
      <AdminHeader />
    </>
  )
}

export default Admin