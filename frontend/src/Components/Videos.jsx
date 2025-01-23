import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Service/auth";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigateMovies } from "../Service/movies";

const Videos = ({title}) => {
  const [film, setFilm] = useState([]);
  const { movies } = useAuth();
  const {WatchMovies} = useNavigateMovies();

  const navigate = useNavigate();

  useEffect(() => {
    if (movies) {
      setFilm(movies.message);
    }
  }, [movies]);
  return (
    <>
      <section className="pt-5 bg-black">
        <Container className="py-5">
          <Row className="allVideos">
            <h1>{title}</h1>
          </Row>

          <Row className="my-4 d-flex justify-content-center flex-wrap">
            {film.map((movies, i) => {
              return (
                <Col
                  key={i}
                  sm={10}
                  md={3}
                  lg={2}
                  className="m-2 d-flex justify-content-center flex-wrap"
                >
                  <div className="video">
                    {console.log(movies.image)
                    }
                    <img src={movies.image} alt={movies.name} />
                    <div className="play d-flex flex-column justify-content-center">
                      <h5>{movies.name}</h5>
                      <Button onClick={() => WatchMovies(movies._id)}>
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
