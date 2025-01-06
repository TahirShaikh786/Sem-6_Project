import React from "react";
import "../assets/CSS/admin.css";
import { useAuth } from "../Service/auth";
import { Navigate } from "react-router-dom";
import AdminHeader from "../Components/AdminHeader";
import Footer from "../Components/Footer";
import BarChart from "../Components/BarChart";
import { Col, Container, Row } from "react-bootstrap";

const Admin = () => {
  const { user } = useAuth();

  if (!user.isAdmin) {
    return <Navigate to="/home" />;
  }
  return (
    <>
      <AdminHeader />

      <section className="bg-black">
        <Container>
          <Row>
            <select name="" id=""></select>
          </Row>
          <Row>
            <Col>
              <div className="bar">
                <BarChart />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />
    </>
  );
};

export default Admin;
