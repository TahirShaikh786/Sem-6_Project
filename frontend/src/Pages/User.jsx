import React, { useEffect, useState } from "react";
import "../assets/CSS/info.css";
import { useParams } from "react-router-dom";
import { useAuth } from "../Service/auth";
import Footer from "../Components/Footer";
import AdminHeader from "../Components/AdminHeader";

const User = () => {
  const { id } = useParams();
  const { allUser, movies } = useAuth();
  const [matchUser, setMatchUser] = useState([]);
  const [favMovies, setFavMovies] = useState([]);

  useEffect(() => {
    const user = allUser.find((user) => user._id === id);
    setMatchUser(user);
    if (user && user.likedMovies && movies) {
      const filteredFavMovies = movies.message.filter((movie) =>
        user.likedMovies.some(
          (likedMovieId) => likedMovieId.toString() === movie._id.toString()
        )
      );
      setFavMovies(filteredFavMovies);
    }
  }, [id, allUser]);
  console.log("Fav", favMovies);

  return (
    <>
      <AdminHeader />

      <div className="mainPage">
        {matchUser ? (
          <div>
            <img src={matchUser.image} alt={matchUser.userName} />
            <h3>Name: {matchUser.userName}</h3>
            <p>Age: {matchUser.age} Yrs</p>
            <p>Phone Number: {matchUser.phone}</p>
            <p>Email: {matchUser.email}</p>
            <p>Favourites:</p>
            <div>
              {favMovies.map((favMov, index) => (
                <div key={index}>
                  <p>{favMov.name}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>User not found or loading...</p>
        )}
      </div>

      <Footer />
    </>
  );
};

export default User;
