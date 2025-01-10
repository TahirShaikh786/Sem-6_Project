import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useAuth } from "../Service/auth";
import { Button, Col, Container, Row } from "react-bootstrap";

const Rated = () => {
  const { rated } = useAuth();
  
  return (
    <>
      <Header />

      <section className="bg-black">
        <Container>
          <Row className="allVideosHead">
            <h2 className="text-center text-white pt-5">Top Rated </h2>
          </Row>
          <Row className="my-4 d-flex justify-content-center flex-wrap">
            {rated.message.map((movies, i) => {
              return (
                <Col
                  key={i}
                  sm={10}
                  md={3}
                  lg={2}
                  className="m-2 d-flex justify-content-center flex-wrap"
                >
                  <div className="video">
                    <img src={movies.titleImage} alt={movies.name} />
                    <div className="play d-flex flex-column justify-content-center">
                      <h5>{movies.name}</h5>
                      <Button onClick={() => handleALlInfo(movies._id)}>
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

      <Footer />
    </>
  );
};

export default Rated;
