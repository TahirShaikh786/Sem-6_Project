import React, { useEffect, useState } from "react";
import { useAuth } from "../Service/auth";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

const User = () => {
  const { user, allUser } = useAuth();
  const [all, setAll] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setAll(allUser);
  }, [allUser]); // Add dependency to update when allUser changes

  const handleUser = (id) => {
    navigate(`/admin/user/${id}`);
  };
  return (
    <>
      <section className="bg-black py-5">
        <Container>
          <Row className="d-flex justify-content-center">
            <h2 className="text-center text-white fst-italic mb-3">
              All Users
            </h2>
            {all.map((user, item) => (
              <Col key={item} md={3}>
                <Card className="adminUserCard">
                  <Card.Img variant="top" src={user.image} />
                  <Card.Body className="adminUserBody">
                    <h5>{user.userName}</h5>
                    <p>{user.email}</p>
                    <Button
                      className="text-white"
                      variant="info"
                      onClick={() => handleUser(user._id)}
                    >
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default User;
