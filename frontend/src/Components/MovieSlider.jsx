import React from "react";
import Slider from "react-slick";
import { Card } from "react-bootstrap";
import { settings } from "../UsableComponents/settings";


const MovieSlider = ({movies}) => {
  return (
    <>
      <div className="slider-container">
        <Slider {...settings}>
          {movies.map((movie, i) => {
            return (
              <div className="VideosCard" key={i}>
                <Card className="movieCards">
                  <Card.Img
                    variant="top"
                    src={movie.image}
                    alt={movie.name}
                    onClick={() => WatchMovies(movie._id)}
                  />
                </Card>
              </div>
            );
          })}
        </Slider>
      </div>
    </>
  );
};

export default MovieSlider;
