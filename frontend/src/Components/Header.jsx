import React from "react";
import "../assets/CSS/components.css";
import headerLogo from "../assets/img/titleImg.png";
import { useAuth } from "../Service/auth.jsx";
import {
  Button,
  Container,
  Form,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.info("Search functionality is not implemented yet!");
  };

  return (
    <>
      <header>
        <Container className="z-3 pb-1">
          <Navbar collapseOnSelect expand="lg" className="headerNavbar">
            <Container>
              <Navbar.Brand className="navLogo">
                <img src={headerLogo} alt="header Logo" />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" className="navbar-toggle-custom">
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
                  <Link className="m-2 links">All Movies</Link>
                  <Link className="m-2 links">Categories</Link>
                  <Link className="m-2 links">Reviews</Link>
                  <Link className="m-2 links">Search</Link>
                  <Link className="m-2 links d-sm-block d-lg-none">
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
                      <Link className="drop_Links">
                        <i class="bi bi-file-earmark-person"></i> Profile
                      </Link>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item className="d-flex justify-content-center">
                      <Button className="bg-danger" onClick={handleLogout}>
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
