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
  };

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
                  <Col
                    key={i}
                    sm={10}
                    md={3}
                    lg={2}
                    className="m-2 d-flex justify-content-center flex-wrap"
                  >
                    <div className="video">
                      <img src={item.titleImage} alt={item.name} />
                      <div className="play d-flex flex-column justify-content-center">
                        <h5>{item.name}</h5>
                        <Button onClick={() => handleWatch(item._id)}>
                          <i className="bi bi-play-circle"></i> Play
                        </Button>
                      </div>
                    </div>
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
