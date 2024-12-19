import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Service/auth";
import { Button, Col, Container, Row } from "react-bootstrap";

const Videos = ({title}) => {
  const [film, setFilm] = useState([]);
  const { movies } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (movies) {
      setFilm(movies.message);
    }
  }, [movies]);

  const handleALlInfo = (id) => {
    navigate(`/Watch/${id}`);
  };
  return (
    <>
      <section className="pt-5 bg-black">
        <Container className="py-5">
          <Row className="allVideos">
            <Link to="/home" className="mt-3">
              <i className="bi bi-caret-left-fill"></i> Home
            </Link>
            <h1>{title}</h1>
          </Row>

          <Row className="my-4 d-flex justify-content-center flex-wrap">
            {film.map((movies, i) => {
              return (
                <Col
                  key={i}
                  sm={10}
                  md={4}
                  lg={3}
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
    </>
  );
};

export default Videos;
