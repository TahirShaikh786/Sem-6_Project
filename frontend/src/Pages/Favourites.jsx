import React, { useEffect, useState } from "react";
import "../assets/CSS/pages.css";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useAuth } from "../Service/auth";
import { Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

const Favourites = () => {
  const { user, movies, backendURL, authorizationToken, userAuthentication } = useAuth();
  const [favMovies, setFavMovies] = useState([]);

  useEffect(() => {
    if (user && user.likedMovies && movies) {
      const filteredFavMovies = movies.message.filter((movie) =>
        user.likedMovies.some(
          (likedMovieId) => likedMovieId.toString() === movie._id.toString()
        )
      );
      setFavMovies(filteredFavMovies);
    }
  }, [user, movies]);

  const handleAllDelete = async () => {
    const response = await fetch(`${backendURL}/auth/favourites/empty`,{
      method: 'DELETE',
      headers:{
        Authorization: authorizationToken
      }
    });
    if(response.ok){
      toast.success("Your Favourite List is Empty")
      userAuthentication();
    }else{
      toast.error("Internal Server Error")
    }
  }

  return (
    <>
      <Helmet>
        <title>Favourites - Cine World</title>
      </Helmet>
      <Header />

      <section className="bg-black py-5 favourites">
        <Container>
          <Row>
            <h1 className="text-white text-center">Your Favourites</h1>
          </Row>
          <Row className="my-4">
            <div className="d-flex justify-content-end favouriteTrah">
              <h1 className="bg-danger text-white text-center fs-2 p-1 rounded" onClick={() => handleAllDelete()}>
                <i className="bi bi-trash"></i>
              </h1>
            </div>
            <table className="table table-dark table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Movie Name</th>
                  <th>Year</th>
                  <th>Language</th>
                </tr>
              </thead>
              <tbody>
                {favMovies.length > 0 ? (
                  favMovies.map((movie, index) => (
                    <tr key={movie._id}>
                      <td>{index + 1}</td>
                      <td>{movie.name}</td>
                      <td>{movie.year}</td>
                      <td>{movie.language}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-white">
                      No favourite movies found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Row>
        </Container>
      </section>

      <Footer />
    </>
  );
};

export default Favourites;
