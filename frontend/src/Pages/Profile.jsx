import React from "react";
import "../assets/CSS/pages.css";
import Helmet from "react-helmet";
import { useAuth } from "../Service/auth";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  return (
    <>
      <Helmet>
        <title>{user.userName.toUpperCase()} Profile - Cine World</title>
      </Helmet>

      <Header />

      <section className="bg-black">
        <Container className="m-0 p-0">
          <Row className="m-0 p-0 d-flex justify-content-center">
            <Col md={5} className="d-flex justify-content-center">
              <div className="profile">
                <div className="d-flex flex-column details">
                  <img
                    src={user.image}
                    alt={`${user.userName.toUpperCase()} Image`}
                    loading="lazy"
                  />
                  <h4 className="pt-3">
                    Name:- <span>{user.userName}</span>
                  </h4>
                  <h5>
                    Email:- <span>{user.email}</span>
                  </h5>
                  <div className="btns py-3 d-flex flex-wrap justify-content-evenly">
                    <Link className="btn bg-primary m-2">Update Password</Link>
                    <Link className="btn bg-info m-2">Update Profile</Link>
                    <Link to="/favourites" className="btn bg-success m-2">Favourites</Link>
                    <Link className="btn bg-danger m-2">Delete Account</Link>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />
    </>
  );
};

export default Profile;
