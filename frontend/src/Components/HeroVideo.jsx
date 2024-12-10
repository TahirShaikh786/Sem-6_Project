import React from 'react';
import "../assets/CSS/components.css"
import {useAuth} from "../Service/auth.jsx"

const HeroVideo = () => {
    const { film} = useAuth();
    
  return (
    <>
        {film.message && film.message.length > 0 && (
        <div className="div">
          <h1>{film.message[0].name}</h1>
          <video src controls>
            <source src={film.message[0].video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </>
  )
}

export default HeroVideo