import React, { useEffect, useState } from "react";
import "../assets/CSS/pages.css";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useAuth } from "../Service/auth";
import { Container, Row } from "react-bootstrap";

const Favourites = () => {
  const favMovie = [];
  const { user, movies } = useAuth(); // Access user and movies from context or service

  

  return (
    <>
      <Header />

      <section className="bg-black py-5 favourites">
        <Container>
          <Row>
            <h1 className="text-white text-center">Your Favourites</h1>
          </Row>
          <Row className="my-4">
            <div className="d-flex justify-content-end">
              <h1 className="bg-danger text-white text-center fs-2 p-1 rounded">
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
                {favMovie.length > 0 ? (
                  favMovie.map((movie, index) => (
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
