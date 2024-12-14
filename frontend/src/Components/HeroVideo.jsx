import React, { useState } from "react";
import "../assets/CSS/components.css";
import { useAuth } from "../Service/auth.jsx";
import ReactPlayer from "react-player";
import { Button } from "react-bootstrap";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { useNavigate } from "react-router-dom";

const HeroVideo = () => {
  const [volume, setVolume] = useState(true);
  const { film } = useAuth();
  const navigate = useNavigate();

  const [text] = useTypewriter({
    words: film?.message?.length > 0 ? [film.message[0].name] : ["Loading..."],
    loop: {},
  });

  const handleSound = () => {
    setVolume(!volume);
  };

  const handleVideo = () => {
    navigate("/allVideo");
  };

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
            height="100vh"
            className="react-player"
          />
          <div className="overlayBG"></div>
          <div className="video-content">
            <h1>
              <span className="typeText">{text}</span>
              <span className="cursor">
                <Cursor />
              </span>
            </h1>
            <p>{film.message[0].desc}</p>
            <div className="buttons d-flex justify-content-between">
              <Button className="bg-dark bg-gradient" onClick={handleVideo}>
                <i className="bi bi-info-circle-fill"></i> Watch More
              </Button>
              <Button className="bg-dark bg-gradient" onClick={handleSound}>
                {volume ? (
                  <i className="bi bi-volume-mute-fill"></i>
                ) : (
                  <i class="bi bi-volume-up-fill"></i>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroVideo;
