import React, { useState } from "react";
import "../assets/CSS/pages.css";
import { Helmet } from "react-helmet";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Videos from "../Components/Videos";
import { useAuth } from "../Service/auth.jsx";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

const Categories = () => {
  const [movie, setMovie] = useState([]);
  const [currentPage, setCurrentPage] = useState(2);

  const { backendURL } = useAuth();

  const handleMovie = async (name) => {
    const response = await fetch(
      `${backendURL}/movie?category=${name}&pageNumber=${currentPage}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log("");

    if (response.ok) {
      setMovie(data.message.movies);
    }
  };

  console.log("Moive", movie);

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    handleMovie("action");
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
    handleMovie("action");
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
            <div className="d-flex justify-content-evenly">
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
        <section className="bg-black">
          <Container>
            <Row className="d-flex jusitfy-content-center">
              <Col md={12}>
                {movie.map((item, i) => {
                  return (
                    <div className="movieContainer" key={i}>
                      <Col
                        sm={10}
                        md={6}
                        lg={3}
                        className="d-flex justify-content-center"
                      >
                        <Card>
                          <Card.Img variant="top" src={item.titleImage} />
                          <Card.Body>
                            <Card.Title>{item.name}</Card.Title>
                            <Card.Text>
                              Some quick example text to build on the card title
                              and make up the bulk of the card's content.
                            </Card.Text>
                            <Button variant="primary">Go somewhere</Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    </div>
                  );
                })}
              </Col>
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
