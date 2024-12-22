import React, { useState } from "react";
import "../assets/CSS/pages.css";
import { Helmet } from "react-helmet";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Videos from "../Components/Videos";
import { useAuth } from "../Service/auth.jsx";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [movie, setMovie] = useState([]);
  const [category, setCategory] = useState("");

  const { backendURL } = useAuth();
  const navigate = useNavigate();

  const handleMovie = async (name) => {
    setCategory(name);
    const response = await fetch(`${backendURL}/movie?category=${name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Data", data.message.movies);

    if (response.ok) {
      setMovie(data.message.movies);
    }
  };

  const handleWatch = (id) => {
    navigate(`/Watch/${id}`);
  }

  return (
    <>
      <Helmet>
        <title>Categories - Cine World</title>
      </Helmet>

      <Header />

      <section className="bg-black pt-5">
        <Container className="pt-5 mt-5">
          <Row className="d-flex justify-content-center">
            <div className="categoryBtn d-flex justify-content-evenly">
              <Button onClick={() => handleMovie("Action")}>Action</Button>
              <Button onClick={() => handleMovie("Horror")}>Horror</Button>
              <Button onClick={() => handleMovie("Sci-Fi")}>Sci-Fi</Button>
              <Button onClick={() => handleMovie("Drama")}>Drama</Button>
              <Button onClick={() => handleMovie("Crime")}>Crime</Button>
              <Button onClick={() => handleMovie("Comedy")}>Comedy</Button>
              <Button onClick={() => handleMovie("Animation")}>
                Animation
              </Button>
            </div>
          </Row>
        </Container>
      </section>

      {movie.length > 0 ? (
        <section className="bg-black py-5">
          <Container>
            <Row>
              <h2 className="text-center text-white fst-italic">{category}</h2>
            </Row>
            <Row className="d-flex justify-content-center">
              {movie.map((item, i) => {
                return (
                  <Col md={4} sm={6} xs={12} key={i} className="mb-4">
                    <Card
                      className="movieCard"
                      onClick={() => {
                        handleWatch(item._id);
                      }}
                    >
                      <Card.Img src={item.titleImage} />
                      <Card.Body>
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Text>{item.desc}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Container>
        </section>
      ) : (
        <Videos title={"Categories"} />
      )}

      <Footer />
    </>
  );
};

export default Categories;
