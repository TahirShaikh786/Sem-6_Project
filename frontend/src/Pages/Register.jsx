import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {useAuth} from "../Service/auth.jsx";

const Register = () => {
  const [user, setUser] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { storetokenInLS, backendURL } = useAuth();

  const [step, setStep] = useState(1);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  const handleBack = (e) => {
    e.preventDefault();
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendURL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (response.ok) {
        storetokenInLS(data.token);
        navigate("/");
        toast.success("User registered successfully!");
      } else {
        toast.error(data.message || "Registration failed!");
      }
    } catch (error) {
      toast.error("An error occurred during registration.");
      console.error(error.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>Register | Cine World</title>
      </Helmet>

      <section className="authBG">
        <Container>
          <Row className="center innerContainer">
            <Col md={4} className="innerCol bg-light-black">
              <h2>Register</h2>

              <form
                className="row g-3 needs-validation d-flex flex-column align-items-center"
                onSubmit={step === 4 ? handleSubmit : handleNext}
                noValidate
              >
                {step === 1 && (
                  <div className="col-10 my-2">
                    <label htmlFor="validationCustom01" className="form-label">
                      Username:
                    </label>
                    <input
                      type="text"
                      name="userName"
                      onChange={handleInput}
                      value={user.userName}
                      className="form-control"
                      id="validationCustom01"
                      placeholder="Enter Your Username..."
                      required
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="col-10 my-2">
                    <label htmlFor="validationCustom02" className="form-label">
                      Email:
                    </label>
                    <input
                      type="email"
                      name="email"
                      onChange={handleInput}
                      value={user.email}
                      className="form-control"
                      id="validationCustom02"
                      placeholder="Enter Your Email..."
                      required
                    />
                  </div>
                )}

                {step === 3 && (
                  <div className="col-10 my-2">
                    <label htmlFor="validationCustom03" className="form-label">
                      Password:
                    </label>
                    <input
                      type="password"
                      name="password"
                      onChange={handleInput}
                      value={user.password}
                      className="form-control"
                      id="validationCustom03"
                      placeholder="Enter Your Password..."
                      required
                    />
                  </div>
                )}

                <div className="col-10 d-flex justify-content-between">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="btn btn-secondary"
                    >
                      Back
                    </button>
                  )}
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn btn-primary"
                    >
                      Next
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-success">
                      Submit
                    </button>
                  )}
                </div>

                <div className="col-10 text-center mt-3">
                  <p>
                    Already have an account? <Link to="/">Login</Link>
                  </p>
                </div>
              </form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Register;
