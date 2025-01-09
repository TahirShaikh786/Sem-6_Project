import React, { useEffect, useState } from "react";
import "../assets/CSS/admin.css";
import { useAuth } from "../Service/auth";
import { Navigate, useNavigate } from "react-router-dom";
import AdminHeader from "../Components/AdminHeader";
import Footer from "../Components/Footer";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

const Admin = () => {
  const { user, allUser } = useAuth();
  const [all, setAll] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setAll(allUser);
  }, [allUser]); // Add dependency to update when allUser changes

  if (!user.isAdmin) {
    return <Navigate to="/home" />;
  }

  const handleUser = (id) => {
    navigate(`/admin/user/${id}`);
  }

  return (
    <>
      <AdminHeader />

      <section className="bg-black py-5">
        <Container>
          <Row>
            <h2>All Users</h2>
            {all.map((user, item) => (
              <Col key={item} md={3}>
                <Card className="adminUserCard">
                  <Card.Img variant="top" src={user.image} />
                  <Card.Body className="adminUserBody">
                    <h5>{user.userName}</h5>
                    <p>{user.email}</p>
                    <Button className="text-white" variant="info" onClick={() => handleUser(user._id)}>View Details</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <Footer />
    </>
  );
};

export default Admin;
