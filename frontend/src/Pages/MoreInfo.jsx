import React, { useEffect, useState } from "react";
import "../assets/CSS/pages.css";
import { useAuth } from "../Service/auth.jsx";
import { Link, useParams } from "react-router-dom";
import Header from "../Components/Header.jsx";
import { Helmet } from "react-helmet";
import ReactPlayer from "react-player";
import Slider from "react-slick";
import dummy from "/dummy.jpg";
import { Button, Col, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import Footer from "../Components/Footer.jsx";

const MoreInfo = () => {
  const [volume, setVolume] = useState(true);
  const [play, setPlay] = useState(true);
  const [like, setLike] = useState(false);
  const [comment, setComment] = useState([]);
  const [film, setFilm] = useState(null);
  const [review, setReview] = useState({
    comment: "",
    rating: 0,
  });

  const { id } = useParams();
  const { user, movies, userAuthentication, backendURL, authorizationToken, getAllUSer } =
    useAuth();
  const movie = movies.message.find((m) => m._id === id);

  useEffect(() => {
    if (movie && user) {
      setComment(movie.reviews || []);
    }
    if (user.likedMovies.includes(movie._id)) {
      setLike(true);
    }
    fetchMovieDetails();
    handleView();
  }, 100);

  const handleView = async () => {
    const response = await fetch(`${backendURL}/auth/viewHistory`,{
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
        Authorization : authorizationToken,
      },
      body: JSON.stringify({
        userId : user._id,
        movieId : movie._id,
        movieName : movie.name,
        category : movie.category
      }),
    })
    const data = await response.json();
    getAllUSer();
  }

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

  const handleLike = async (id) => {
    try {
      const response = await fetch(`${backendURL}/auth/favourites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authorizationToken}`,
        },
        body: JSON.stringify({ movieId: id }),
      });

      if (response.ok) {
        setLike(true);
        userAuthentication();
        toast.success("Added to favourites!");
      } else {
        toast.error("Failed to add to favourites.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const fetchMovieDetails = async () => {
    try {
      const response = await fetch(`${backendURL}/movie/${id}`);
      const data = await response.json();
      if (response.ok) {
        setFilm(data.message);
        setComment(data.message.reviews || []); // Update comments from backend
      } else {
        toast.error("Failed to fetch movie details.");
      }
    } catch (error) {
      console.error("Error fetching movie:", error);
      toast.error("Something went wrong.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${backendURL}/movie/${movie._id}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${authorizationToken}`,
      },
      body: JSON.stringify(review),
    });

    const data = await response.json();

    if (response.ok) {
      setReview({
        comment: "",
        rating: 0,
      });
      toast.success("Review Has been successfully Submitted");
      setComment(data.reviews);
      console.log("2", comment);
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
                  <Button
                    onClick={() => {
                      setPlay(!play);
                    }}
                  >
                    {play ? (
                      <i className="bi bi-pause-circle"></i>
                    ) : (
                      <i className="bi bi-play-circle"></i>
                    )}
                  </Button>
                  <Button onClick={() => handleLike(movie._id)}>
                    {like ? (
                      <i class="bi bi-suit-heart-fill"></i>
                    ) : (
                      <i className="bi bi-heart"></i>
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setVolume(!volume);
                    }}
                  >
                    {volume ? (
                      <i className="bi bi-volume-up"></i>
                    ) : (
                      <i className="bi bi-volume-mute-fill"></i>
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
              <form
                className="row my-3 d-flex flex-row justify-content-center"
                onSubmit={handleSubmit}
              >
                <div className="col-12 d-flex">
                  <input
                    type="text"
                    name="comment"
                    value={review.comment}
                    onChange={handleInput}
                    placeholder="Add Your Review"
                  />
                  <button type="submit">
                    <i className="bi bi-send-fill"></i>
                  </button>
                </div>
                <div className="col-6 d-flex justify-content-start">
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
              </form>
            </Col>
            <Col md={6} className="reviewsDisplay d-flex flex-wrap">
              {comment.map((review, i) => (
                <div className="d-flex my-3" key={i}>
                  <img src={dummy} alt={review.userName} />
                  <div className="d-flex flex-column px-4">
                    <h6>{review.userName || "Anonymous"}</h6>
                    <div className="d-flex flex-column">
                      <p className="d-flex  ">
                        Comment:- <h6 className="px-2">{review.comment}</h6>
                      </p>
                      <p>{"⭐".repeat(review.rating)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />
    </>
  );
};

export default MoreInfo;
