import React, { useState } from "react";
import "../assets/CSS/pages.css";
import Helmet from "react-helmet";
import { useAuth } from "../Service/auth";
import Footer from "../Components/Footer";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import sideImg from "../assets/img/titleImg.png";

const Profile = () => {
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [profile, setProfile] = useState(false);
  const [updateProfile, setUpdateProfile] = useState({
    userName: "",
    email: "",
    image: "",
  });
  const [updatePassword, setUpdatePassword] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const { user, backendURL, authorizationToken, userAuthentication } =
    useAuth();
  const formattedDate = new Date(user.createdAt).toLocaleDateString();
  const formattedTime = new Date(user.createdAt).toLocaleTimeString();

  const handleClose = () => {
    setShow(false);
    setProfile(false);
  };
  const handleShow = () => setShow(true);
  const handleProfileForm = () => setProfile(true);

  const handleProfile = async () => {
    const formData = new FormData();
    formData.append("userName", updateProfile.userName);
    formData.append("email", updateProfile.email);

    // If an image is selected, append it to the form data
    if (updateProfile.image) {
      formData.append("image", updateProfile.image);
    }

    try {
      const response = await fetch(`${backendURL}/auth/${user._id}`, {
        method: "PUT",
        headers: {
          Authorization: authorizationToken, // Authorization token is still required
        },
        body: formData, // Send the FormData as the body
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Your Profile has Been Updated");
        userAuthentication();
      } else {
        toast.error(data?.message || "Internal Server Error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating the profile.");
    }
  };

  const handlePassword = async () => {
    try {
      const response = await fetch(`${backendURL}/auth/password/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify(updatePassword),
      });

      const data = await response.json();
      console.log("dat", data);

      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {}
  };

  const handleDelete = async () => {
    const response = await fetch(`${backendURL}/auth/${user._id}`, {
      method: "DELETE",
      headers: {
        Authorization: authorizationToken,
      },
    });

    if (response.ok) {
      toast.success("Your Account was Deleted");
      userAuthentication();
    } else {
      toast.error("Internal Server Error");
    }
  };

  return (
    <>
      <Helmet>
        <title>{user.userName.toUpperCase()} Profile - Cine World</title>
      </Helmet>

      <section className="bg-black">
        <Container className="m-0 p-0">
          <Row className="m-0 p-0 w-100 d-flex flex-wrap justify-content-between">
            <Col lg={3} className="profileSide">
              <div className="btns">
                <img src={sideImg} alt="sideLogo" />
                <Link to="/home" className="btn bg-white text-black m-2">
                  Home
                </Link>
                <Link to="/allVideo" className="btn bg-white text-black m-2">
                  All Movies
                </Link>
                <Link to="/categories" className="btn bg-white text-black m-2">
                  Categories
                </Link>
                <Link
                  className="btn bg-info m-2"
                  onClick={() => handleProfileForm()}
                >
                  Update Profile
                </Link>
                <Link
                  className="btn bg-primary m-2"
                  onClick={() => handlePassword()}
                >
                  Update Password
                </Link>
                <Link to="/favourites" className="btn bg-success m-2">
                  Favourites
                </Link>
              </div>

              <div className="btns-dropdown">
                <div>
                  <img src={sideImg} alt="sideLogo" />
                </div>
                <div
                  className={
                    visible
                      ? "d-block d-flex flex-column flex-wrap justify-content-center align-items-center"
                      : "d-none"
                  }
                >
                  <Link
                    to="/categories"
                    className="btn bg-white text-black m-2"
                  >
                    Categories
                  </Link>
                  <Link
                    className="btn bg-info m-2"
                    onClick={() => handleProfileForm()}
                  >
                    Update Profile
                  </Link>
                  <Link
                    className="btn bg-primary m-2"
                    onClick={() => handlePassword()}
                  >
                    Update Password
                  </Link>
                  <Link to="/favourites" className="btn bg-success m-2">
                    Favourites
                  </Link>
                </div>
                <Button onClick={() => setVisible(!visible)}>
                  {visible ? (
                    <i className="bi bi-x-octagon"></i>
                  ) : (
                    <i className="bi bi-list"></i>
                  )}
                </Button>
              </div>
            </Col>
            <Col lg={8} className="m-2 d-flex justify-content-center">
              <div className="details">
                <div className="w-100 d-flex justify-content-end">
                  <img src={user.image} alt={user.userName} />
                </div>
                <h2 className="text-capitalize">
                  Name:- <span>{user.userName}</span>
                </h2>
                <h2>
                  Email:- <span>{user.email}</span>
                </h2>
                <h2>
                  Joined On :- <span>{formattedDate}</span>{" , "}
                  <span>{formattedTime}</span>
                </h2>
                <div className=" mt-4 d-flex justify-content-center">
                  <Link
                    className="btn bg-danger m-2"
                    onClick={() => handleShow()}
                  >
                    Delete Account
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Account Delete */}
      <Modal className="bg-black" show={show} onHide={handleClose} centered>
        <Modal.Header className="bg-black text-white" closeButton>
          <Modal.Title>{user.userName.toUpperCase()}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-black text-white">
          Are You Sure, you want to Delete Your Account
        </Modal.Body>
        <Modal.Footer className="bg-black text-white">
          <Button variant="info" className="text-white" onClick={handleClose}>
            No
          </Button>
          <Button variant="danger" onClick={() => handleDelete()}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update */}
      <Modal className="bg-black" show={profile} onHide={handleClose} centered>
        <Modal.Header className="bg-black text-white" closeButton>
          <Modal.Title>Update Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-black text-white">
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Enter Your UserName:- </Form.Label>
              <Form.Control
                type="text"
                placeholder="UserName"
                value={updateProfile.userName}
                onChange={(e) =>
                  setUpdateProfile({
                    ...updateProfile,
                    userName: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Enter Your Email:- </Form.Label>
              <Form.Control
                type="email"
                placeholder="example@example.com"
                value={updateProfile.email}
                onChange={(e) =>
                  setUpdateProfile({ ...updateProfile, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Upload Your Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) =>
                  setUpdateProfile({
                    ...updateProfile,
                    image: e.target.files[0],
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-black">
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={() => handleProfile()}>
            Update Profile
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default Profile;
