import React from "react";
import Slider from "react-slick";
import "../assets/CSS/pages.css";
import { Helmet } from "react-helmet";
import microphone from "../assets/img/microphone.png";
import Header from "../Components/Header";
import HeroVideo from "../Components/HeroVideo";
import { useAuth } from "../Service/auth.jsx";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { film } = useAuth();
  const navigate = useNavigate();
  const handleInfo = (id) => {
    console.log("ID: " + id);

    navigate(`/Watch/${id}`);
  };

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
      <section className="bg-black p-5">
        <div className="container m-0 p-0">
          <div className="row m-0 p-0 allVideosHead">
            <h2>All Movies</h2>
          </div>
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
                        onClick={() => handleInfo(movie._id)}
                      />
                    </Card>
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>
      </section>

      <aside>
        <img src={microphone} alt="microphone" />
      </aside>
    </>
  );
};

export default Dashboard;
