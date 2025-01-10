import React, { useEffect, useState } from "react";
import "../assets/CSS/info.css";
import { useParams } from "react-router-dom";
import { useAuth } from "../Service/auth";
import Footer from "../Components/Footer";
import AdminHeader from "../Components/AdminHeader";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigateMovies } from "../Service/movies";

const User = () => {
  const { id } = useParams();
  const { allUser, movies } = useAuth();
  const [matchUser, setMatchUser] = useState([]);
  const [favMovies, setFavMovies] = useState([]);

  const { WatchMovies } = useNavigateMovies();

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

  const makeAdmin = async (id) => {
    
  }

  return (
    <>
      <AdminHeader />

      <div className="mainPage">
        {matchUser ? (
          <>
            <Container>
              <Row>
                <Col md={6} className="d-flex justify-content-center">
                  <div className="userLeft">
                    <div className="d-flex justify-content-center my-3">
                      <img src={matchUser.image} alt={matchUser.userName} />
                    </div>
                    <h3 className="text-capitalize">
                      Name: <span>{matchUser.userName}</span>
                    </h3>
                    <h3>
                      Age: <span>{matchUser.age} Yrs</span>
                    </h3>
                    <h3>
                      Email: <span>{matchUser.email}</span>
                    </h3>
                    <h3>
                      Phone Number: <span>{matchUser.phone}</span>
                    </h3>
                    <h3>
                      Admin:{" "}
                      <span>
                        {matchUser.isAdmin ? (
                          "True"
                        ) : (
                          <>
                            <span>False</span>{" "}<Button onClick={() => makeAdmin(matchUser._id)}>Make Admin</Button>
                          </>
                        )}
                      </span>
                    </h3>

                    <h3 className="mt-3">Favourites:</h3>
                    <div>
                      <table className="table table-dark table-strih3ed">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Movie Name</th>
                            <th>Year</th>
                            <th>Language</th>
                            <th>View Movie</th>
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
                                <td>
                                  <Button
                                    onClick={() => WatchMovies(movie._id)}
                                  >
                                    Watch
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSh3an="4"
                                className="text-center text-white"
                              >
                                No favourite movies found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </>
        ) : (
          <h3>User not found or loading...</h3>
        )}
      </div>

      <Footer />
    </>
  );
};

export default User;
