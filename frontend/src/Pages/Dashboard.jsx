import React from "react";
import Slider from "react-slick";
import "../assets/CSS/pages.css";
import { Helmet } from "react-helmet";
import Header from "../Components/Header";
import HeroVideo from "../Components/HeroVideo";
import { useAuth } from "../Service/auth.jsx";
import { Card, Container, Row } from "react-bootstrap";
import Footer from "../Components/Footer.jsx";
import { useNavigateMovies } from "../Service/movies.jsx";
import {settings} from "../UsableComponents/settings.js"
import MovieSlider from "../Components/MovieSlider.jsx";

const Dashboard = () => {
  const { film, rated, colFilter } = useAuth();
  const { WatchMovies } = useNavigateMovies();

  return (
    <>
      <Helmet>
        <title>Dashboard | Cine World</title>
      </Helmet>

      <Header />

      <main className="position-relative">
        <HeroVideo />
      </main>

      {/* All Videos */}
      <section className="bg-black pt-5">
        <Container>
          <Row className="allVideosHead">
            <h2>All Movies</h2>
          </Row>
          <MovieSlider movies={film}/>
        </Container>
      </section>

      {/* Top Rated Movie */}
      <section className="bg-black">
        <Container>
          <Row className="allVideosHead">
            <h2>Rated </h2>
          </Row>
          <div className="slider-container">
            <Slider {...settings}>
              {rated.message.map((movie, i) => {
                return (
                  <div className="VideosCard" key={i}>
                    <Card className="movieCards">
                      <Card.Img
                        variant="top"
                        src={movie.image}
                        alt={movie.name}
                        onClick={() => WatchMovies(movie._id)}
                      />
                      <p className="card-rate">{movie.rate}</p>
                    </Card>
                  </div>
                );
              })}
            </Slider>
          </div>
        </Container>
      </section>

      {/* Recommend Movie */}
      <section className="bg-black">
        <Container>
          <Row className="allVideosHead">
            <h2>You Might also like this </h2>
          </Row>
          <MovieSlider movies={colFilter} />
        </Container>
      </section>

      <Footer />
    </>
  );
};

export default Dashboard;
