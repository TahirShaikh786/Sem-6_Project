import React, { useState } from "react";
import "../assets/CSS/pages.css";
import Helmet from "react-helmet";
import { useAuth } from "../Service/auth";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const [show, setShow] = useState(false);
  const [profile, setProfile] = useState(false);
  const { user, backendURL, authorizationToken, userAuthentication } =
    useAuth();
  const formattedDate = new Date(user.createdAt).toLocaleDateString();
  const formattedTime = new Date(user.createdAt).toLocaleTimeString();

  const handleClose = () => {
    setShow(false)
    setProfile(false)
  };
  const handleShow = () => setShow(true);
  const handleProfileForm = () => setProfile(true);

  const handleProfile = async () => {
    const response = await fetch(`${backendURL}/auth/${user._id}`,{
      method: "PUT",
      headers: {
        Authorization: authorizationToken
      }
    })
    if(response.ok){
      toast.success("Your Profile has Been Updated")
      userAuthentication()
    }else{
      toast.error("Internal Server Error")
    }
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

      <Header />

      <section className="bg-black">
        <Container className="m-0 p-0">
          <Row className="m-0 p-0 d-flex justify-content-center">
            <Col md={12} className="profileSide">
              <div className="btns">
                <Link
                  className="btn bg-info m-2"
                  onClick={() => handleProfileForm()}
                >
                  Update Profile
                </Link>
                <Link className="btn bg-primary m-2">Update Password</Link>
                <Link to="/favourites" className="btn bg-success m-2">
                  Favourites
                </Link>
                <Link
                  className="btn bg-danger m-2"
                  onClick={() => handleShow()}
                >
                  Delete Account
                </Link>
              </div>
            </Col>
            <Col md={5} className="d-flex justify-content-center">
              <div className="d-flex flex-column details">
                <div className="w-100 d-flex justify-content-center">
                  <img
                    src={user.image}
                    alt={`${user.userName.toUpperCase()} Image`}
                    loading="lazy"
                  />
                </div>
                <h4 className="pt-3">
                  Name:- <span>{user.userName}</span>
                </h4>
                <h5>
                  Email:- <span>{user.email}</span>
                </h5>
                <h5>
                  Joined On:-{" "}
                  <span>
                    {formattedDate}, {formattedTime}
                  </span>
                </h5>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

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

      <Modal className="bg-black" show={profile} onHide={handleClose} centered>
        <Modal.Header className="bg-black text-white" closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-black text-white">
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Enter Your UserName:- </Form.Label>
              <Form.Control
                type="text"
                placeholder="UserName"
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Enter Your Email:- </Form.Label>
              <Form.Control
                type="email"
                placeholder="example@example.com"
                autoFocus
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Example textarea</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-black">
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={() => handleProfile()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default Profile;
