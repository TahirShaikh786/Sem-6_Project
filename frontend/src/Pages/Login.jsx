import React, { useState } from "react";
import "../assets/CSS/auth.css";
import { useAuth } from "../Service/auth.jsx";
import { Col, Container, Row } from "react-bootstrap";
import HelmetExport from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { backendURL, storeTokenInLS } = useAuth();

  const navigate = useNavigate();

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();

      if (response.ok) {
        storeTokenInLS(data.message.token);
        toast.success("Login Succeeded");
        setTimeout(() => {
          navigate("/home");
        }, 100);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);

      toast.error("Internal Server error");
    }
  };
  return (
    <>
      <HelmetExport>
        <title>Login | Cine World</title>
      </HelmetExport>
      <section className="authBG">
        <Container>
          <Row className="center innerContainer">
            <Col md={4} className="innerCol bg-light-black">
              <h2>Login</h2>

              <form
                className="row g-3 needs-validation d-flex flex-column align-items-center"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="col-10 my-2">
                  <label htmlFor="validationCustom01" className="form-label">
                    Email:-
                  </label>
                  <input
                    type="email"
                    name="email"
                    onChange={handleInput}
                    value={user.email}
                    className="form-control"
                    id="validationCustom01"
                    placeholder="Enter Your Email Address Here..."
                    required
                  />
                  <div className="valid-feedback">Looks good!</div>
                </div>
                <div className="col-10 my-2">
                  <label htmlFor="validationCustom02" className="form-label">
                    Password:-
                  </label>
                  <input
                    type="password"
                    name="password"
                    onChange={handleInput}
                    value={user.password}
                    className="form-control"
                    id="validationCustom02"
                    placeholder="Enter Your Password Here..."
                    required
                  />
                  <div className="valid-feedback">Looks good!</div>
                </div>
                <div className="col-10 text-center">
                  <p>
                    Don't have an Account?{" "}
                    <Link to="/register">Register Now</Link>
                  </p>
                </div>
                <div className="col-10 d-flex justify-content-center">
                  <button type="submit">Submit form</button>
                </div>
              </form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Login;
