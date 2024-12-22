import React from "react";

import { useAuth } from "../Service/auth";

const UserProfile = () => {
  const {user} = useAuth();
  return (
    <>
      <div className="innerProfile">
        <img src={user.image} alt={user.userName} />
        <div className="userDetails">
          <h5 className="text-transform-capitalize"><span>Name:-</span>{" "}{user.userName}</h5>
          <h5><span>Email:-</span>{" "}{user.email}</h5>
          <h5><span>Account Created:- </span>{new Date(user.createdAt).toLocaleString()}</h5>
          <div className="profileBtn">
            <button className="btn btn-primary">Edit Profile</button>
            <button className="btn btn-success">Change Password</button>
            <button className="btn btn-danger">Delete Account</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
