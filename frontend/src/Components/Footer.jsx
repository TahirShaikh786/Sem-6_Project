import React from "react";
import "../assets/CSS/pages.css";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  const handleCategory = (name) => {
    navigate(`/categories/${name}`)
  }
  return (
    <footer className="text-center text-lg-start">
      <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
        <div className="me-5 d-none d-lg-block text-white">
          <span>Get connected with us on social networks:</span>
        </div>

        <div>
          <a href="#" className="me-4 text-white">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="#" className="me-4 text-white">
            <i className="bi bi-twitter-x"></i>
          </a>
          <a href="#" className="me-4 text-white">
            <i className="bi bi-google"></i>
          </a>
          <a href="#" className="me-4 text-white">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="#" className="me-4 text-white">
            <i className="bi bi-linkedin"></i>
          </a>
          <a href="#" className="me-4 text-white">
            <i className="bi bi-github"></i>
          </a>
        </div>
      </section>

      <section className="">
        <Container className="text-center text-md-start mt-5">
          <Row className="mt-3">
            <Col md={3} lg={4} xl={3} className="mx-auto mb-4">
              <h6 className="text-uppercase text-white fw-bold mb-4">
                <i className="bi bi-film"></i> CineWorld
              </h6>
              <p>
                Cine World is a movie review website, offering a platform for
                users to explore, rate, and review movies. It provides detailed
                movie pages with trailers, descriptions, cast information, and
                user ratings, ensuring an immersive experience for movie
                enthusiasts.
              </p>
            </Col>
            {/* Grid column */}

            {/* Grid column */}
            <Col md={2} lg={2} xl={2} className="mx-auto mb-4">
              {/* Links */}
              <h6 className="text-uppercase fw-bold mb-4">Links</h6>
              <p>
                <Link to="/admin" className="text-reset">
                  Admin Login
                </Link>
              </p>
              <p>
                <Link to="/home" className="text-reset">
                  Dashboard
                </Link>
              </p>
              <p>
                <Link to="/allVideo" className="text-reset">
                  All Movies
                </Link>
              </p>
              <p>
                <Link to="/maps" className="text-reset">
                  Maps
                </Link>
              </p>
            </Col>

            <Col md={2} lg={2} xl={2} className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Useful links</h6>
              <p>
                <li onClick={() => handleCategory("Action")} className="text-reset text-decoration-underline">
                  Action
                </li>
              </p>
              <p>
                <li onClick={() => handleCategory("Sci-Fi")} className="text-reset text-decoration-underline">
                  Sci-Fi
                </li>
              </p>
              <p>
                <li onClick={() => handleCategory("Horror")} className="text-reset text-decoration-underline">
                  Horror
                </li>
              </p>
              <p>
                <li onClick={() => handleCategory("Drama")} className="text-reset text-decoration-underline">
                  Drama
                </li>
              </p>
            </Col>

            <Col md={4} lg={3} xl={3} className="mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
              <p>
                <i className="fas fa-home me-3"></i> New York, NY 10012, US
              </p>
              <p>
                <i className="fas fa-envelope me-3"></i> tahirshaikh@gmail.com
              </p>
              <p>
                <i className="fas fa-phone me-3"></i> +91 8591***199
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <div className="text-center text-white p-4">
        © 2024 Copyright:{" "}
        <a className="text-reset fw-bold" href="https://mdbootstrap.com/">
          Tahir Shaikh
        </a>
      </div>
    </footer>
  );
}
