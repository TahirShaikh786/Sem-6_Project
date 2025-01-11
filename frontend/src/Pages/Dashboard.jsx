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

const Dashboard = () => {
  const { film, rated, history } = useAuth();
  const { WatchMovies } = useNavigateMovies();

  var settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
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
          <div className="slider-container">
            <Slider {...settings}>
              {film.message.map((movie, i) => {
                return (
                  <div className="VideosCard" key={i}>
                    <Card className="movieCards">
                      <Card.Img
                        variant="top"
                        src={movie.titleImage}
                        alt={movie.name}
                        onClick={() => WatchMovies(movie._id)}
                      />
                    </Card>
                  </div>
                );
              })}
            </Slider>
          </div>
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
                        src={movie.titleImage}
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

      <Footer />
    </>
  );
};

export default Dashboard;
