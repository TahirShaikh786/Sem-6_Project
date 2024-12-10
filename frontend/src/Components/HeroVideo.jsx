import React, { useState } from "react";
import "../assets/CSS/components.css";
import { useAuth } from "../Service/auth.jsx";
import ReactPlayer from "react-player";
import { Button } from "react-bootstrap";

const HeroVideo = () => {
  const [volume, setVolume] = useState(true)
  const { film } = useAuth();

  const handleSound = () => {
    setVolume(!volume);
  }

  const handleInfo = (id) => {
    const response = id;
    console.log('Response', response);
  }

  return (
    <>
      {film.message && film.message.length > 0 && (
        <div className="video-container">
          <ReactPlayer
            url={film.message[0].video}
            playing={true}
            loop={true}
            muted={volume}
            controls={false}
            width="100%"
            height="auto"
          />
          <div className="video-content">
            <h1>{film.message[0].name}</h1>
            <p>{film.message[0].desc}</p>
            <div className="buttons d-flex justify-content-between">
              <Button onClick={handleInfo(film.message[0]._id)}><i className="bi bi-info-circle-fill"></i> More Info</Button>
              <Button className="bg-dark bg-gradient" onClick={handleSound}>{volume ? <i className="bi bi-volume-mute-fill"></i>:<i class="bi bi-volume-up-fill"></i>}</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroVideo;
