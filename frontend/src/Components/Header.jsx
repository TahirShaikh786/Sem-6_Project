import React, { useState } from "react";
import "../assets/CSS/components.css";
import headerLogo from "../assets/img/titleImg.png";
import { useAuth } from "../Service/auth.jsx";
import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

const Header = () => {
  const { user, logoutUser } = useAuth();
  const Img = (
    <img
      src={user.image}
      alt="custom-icon"
      style={{ width: "30px", height: "30px" }}
    />
  );

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <>
      <header className="header-fixed">
        <Container className="z-3 pb-1">
          <Navbar collapseOnSelect expand="lg" className="headerNavbar">
            <Container>
              <Navbar.Brand className="navLogo">
                <Link to="/home">
                  <img src={headerLogo} alt="header Logo" />
                </Link>
              </Navbar.Brand>
              <Navbar.Toggle
                aria-controls="responsive-navbar-nav"
                className="navbar-toggle-custom"
              >
                <img
                  src={user.image}
                  alt="custom-icon"
                  style={{
                    width: "30px",
                    height: "30px",
                  }}
                />
              </Navbar.Toggle>
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto"></Nav>
                <Nav className="d-flex flex-md-column flex-lg-row justify-content-center align-items-center">
                  <Link to="/home" className="m-2 links">
                    Home
                  </Link>
                  <Link to="/allVideo" className="m-2 links">
                    Movie
                  </Link>
                  <Link to="/categories" className="m-2 links">
                    Categories
                  </Link>
                  <Link to='/search' className="m-2 links">Search</Link>
                  <Link to='/profile' className="m-2 links d-sm-block d-lg-none">
                    Profile
                  </Link>
                  <Button
                    className="bg-danger d-sm-block d-lg-none"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                  <NavDropdown
                    className="nav-dropdown d-none d-lg-block"
                    title={Img}
                    id="collapsible-nav-dropdown"
                  >
                    <NavDropdown.Item className="text-center">
                      <Link to="/profile" className="drop_Links">
                        <i class="bi bi-file-earmark-person"></i> Profile
                      </Link>
                    </NavDropdown.Item>
                    <hr className="text-white m-0 p-0" />
                    <NavDropdown.Item className="text-center">
                      <Link to="/favourites" className="drop_Links">
                      <i class="bi bi-heart-fill"></i> Favourites
                      </Link>
                    </NavDropdown.Item>
                    <hr className="text-white m-0 p-0" />
                    <NavDropdown.Item className="m-0 p-0 d-flex justify-content-center">
                      <Button className="bg-danger w-100" onClick={handleLogout}>
                        Logout
                      </Button>
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </Container>
      </header>
    </>
  );
};

export default Header;
