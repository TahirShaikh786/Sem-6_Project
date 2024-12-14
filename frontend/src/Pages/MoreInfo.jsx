import React, { useState } from "react";
import "../assets/CSS/pages.css";
import { useAuth } from "../Service/auth.jsx";
import { useParams } from "react-router-dom";
import Header from "../Components/Header.jsx";
import { Helmet } from "react-helmet";
import ReactPlayer from "react-player";
import Slider from "react-slick";
import dummy from "/dummy.jpg";
import { Button, Col, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";

const MoreInfo = () => {
  const [volume, setVolume] = useState(false);
  const [play, setPlay] = useState(true);
  const [comment, setComment] = useState(null);
  const [review, setReview] = useState({
    comment: "",
    rating: 0,
  });

  const { id } = useParams();
  const { movies, backendURL, authorizationToken } = useAuth();
  const movie = movies.message.find((m) => m._id === id);

  const handleVolume = () => {
    setVolume(!volume);
  };

  const handlePlay = () => {
    setPlay(!play);
  };

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setReview({
      ...review,
      [name]: value,
    });
  };

  const handleStarClick = (rating) => {
    setReview({
      ...review,
      rating,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${backendURL}/movie/${movie._id}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authorizationToken}`,
      },
      body: JSON.stringify(review),
    });

    const data = await response.json();
    setComment(data.reviews);

    if (response.ok) {
      setReview({
        comment: "",
        rating: 0,
      });
      toast.success("Review Has been successfully Submitted");
    } else {
      toast.error("You can Do only 1 Review");
    }
  };

  var settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    slidesToShow: 3,
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
        <title>{movie.name} - Cine World</title>
      </Helmet>
      <Header />

      <section className="bg-black py-5">
        <Container>
          <Row className="watchHead">
            <h1 className="text-center">{movie.name}</h1>
          </Row>
          <Row className="d-flex flex-wrap justify-content-center">
            <Col sm={10} md={6}>
              <div className="react-player">
                <ReactPlayer
                  url={movie.video}
                  playing={play}
                  loop={true}
                  muted={volume}
                  controls={true}
                  width="100%"
                  config={{
                    youtube: {
                      playerVars: {
                        showinfo: 0,
                        modestbranding: 1,
                        controls: 0,
                        rel: 0,
                      },
                    },
                  }}
                />
                <div className="video-overlay"></div>
                <div className="player-Controls">
                  <Button onClick={handlePlay}>
                    {play ? (
                      <i class="bi bi-pause-circle"></i>
                    ) : (
                      <i class="bi bi-play-circle"></i>
                    )}
                  </Button>
                  <Button onClick={handleVolume}>
                    {volume ? (
                      <i class="bi bi-volume-up"></i>
                    ) : (
                      <i class="bi bi-volume-mute-fill"></i>
                    )}
                  </Button>
                </div>
              </div>
            </Col>
            <Col sm={10} md={6} className="descBox">
              <h5>{movie.desc}</h5>
              <div className="d-flex justify-content-between">
                <h6>{movie.year}</h6>
                <h6>
                  <span>{movie.category}</span>, {movie.language}
                </h6>
              </div>
              <h6 className="d-flex flex-column">
                <img src={dummy} alt={movie.name} />
                <h6>
                  <span>Director:- </span>
                  {movie.director}
                </h6>
              </h6>
              <h6>
                <span>Overall Ratings:-</span>{" "}
                {"⭐".repeat(Number(movie.rate) || 0)}
              </h6>
              <span>Casts:-</span>
              <div className="slider-container px-4">
                <Slider {...settings}>
                  {movie.casts.map((cast, i) => (
                    <div
                      key={i}
                      className="d-flex justify-content-center align-items-center me-3"
                    >
                      <img
                        src={dummy}
                        alt={cast.name}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginRight: "8px",
                        }}
                      />
                      <span>{cast.name}</span>
                    </div>
                  ))}
                </Slider>
              </div>
            </Col>
          </Row>
          <Row className="d-flex flex-wrap justify-content-center my-2">
            <Col md={6} className="reviewAdd">
              <h5>Add Your Review</h5>
              <form
                class="row my-3 d-flex flex-row justify-content-center"
                onSubmit={handleSubmit}
              >
                <div className="col-12 d-flex justify-content-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <label key={star} className="star">
                      <input
                        type="radio"
                        name="rating"
                        value={star}
                        checked={review.rating === star}
                        onChange={() => handleStarClick(star)}
                      />
                      <i
                        className={`bi ${
                          star <= review.rating ? "bi-star-fill" : "bi-star"
                        }`}
                      ></i>
                    </label>
                  ))}
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="comment"
                    value={review.comment}
                    onChange={handleInput}
                    placeholder="Add Your Review"
                  />
                  <button type="submit">
                    <i class="bi bi-send-fill"></i>
                  </button>
                </div>
              </form>
            </Col>
            <Col md={6}>
              <h5>Reviews</h5>
              {comment.map((review) => (
                  <div key={review._id} className="reviewBox">
                    <div className="d-flex justify-content-between">
                      <h6>{review.userName || "Anonymous"}</h6>
                      <h6>{"⭐".repeat(Number(review.rating) || 0)}</h6>
                    </div>
                    <p>{review.comment}</p>
                  </div>
                ))}
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default MoreInfo;
