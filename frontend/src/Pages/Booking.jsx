import React, { useState } from "react";
import "../assets/CSS/components.css";
import { useLocation } from "react-router-dom";
import Footer from "../Components/Footer";
import FixedHeader from "../Components/FixedHeader";
import { Col, Container, Row, Modal, Button, Form } from "react-bootstrap";
import { useAuth } from "../Service/auth";

const BookingPage = () => {
  const { user, backendURL, authorizationToken } = useAuth();
  const location = useLocation();
  const theater = location.state?.theater; // Retrieve theater data
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]); // Selected seats state
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",
  });
  const [errors, setErrors] = useState({}); // To track form errors

  // Sample seat layout
  const seatLayout = [
    ["A1", "A2", "A3", "A4", "A5"],
    ["B1", "B2", "B3", "B4", "B5"],
    ["C1", "C2", "C3", "C4", "C5"],
  ];

  // Handle seat selection
  const handleSeatSelection = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat)); // Deselect seat
    } else {
      setSelectedSeats([...selectedSeats, seat]); // Select seat
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    if (!formData.cardNumber || formData.cardNumber.length !== 16) {
      newErrors.cardNumber = "Card number must be 16 digits.";
    }
    if (!formData.expiryDate) {
      newErrors.expiryDate = "Expiry date is required.";
    }
    if (!formData.cvv || formData.cvv.length !== 3) {
      newErrors.cvv = "CVV must be 3 digits.";
    }
    if (!formData.cardHolder) {
      newErrors.cardHolder = "Cardholder name is required.";
    }
    if (selectedSeats.length === 0) {
      newErrors.seats = "Please select at least one seat.";
    }
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      try {
        // Prepare the data to send to the backend
        const bookingData = {
          userId: user._id, // Assuming `user` contains the logged-in user details
          theaterName: theater.display_name, // Assuming `theater` has an ID field
          selectedSeats: selectedSeats.map((seat) => ({ number: seat })),
          movieName: selectedMovie, // You need to manage `selectedMovie` from the dropdown
        };

        // Send the booking data to the backend
        const response = await fetch(`${backendURL}/auth/booking`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorizationToken, // Assuming `authorizationToken` is available
          },
          body: JSON.stringify(bookingData),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Booking Successful!");
          setShowModal(false); // Close modal
          // Optionally, redirect or reset states here
        } else {
          alert(`Booking Failed: ${result.message}`);
        }
      } catch (error) {
        console.error("Error submitting booking:", error);
        alert("An error occurred while processing your booking.");
      }
    } else {
      setErrors(newErrors); // Show validation errors
    }
  };

  // Handle Proceed to Payment button click
  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat before proceeding.");
      return;
    }
    setShowModal(true); // Show the modal when the button is clicked
  };

  if (!theater) {
    return <h2>No theater data available</h2>;
  }

  return (
    <>
      <FixedHeader />

      {/* Modal for Card Details */}
      <Modal show={showModal} backdrop="static" keyboard={false} centered>
        <Modal.Header>
          <Modal.Title>Enter Card Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                maxLength="16"
                value={formData.cardNumber}
                onChange={(e) =>
                  setFormData({ ...formData, cardNumber: e.target.value })
                }
                isInvalid={!!errors.cardNumber}
              />
              <Form.Control.Feedback type="invalid">
                {errors.cardNumber}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control
                type="month"
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
                isInvalid={!!errors.expiryDate}
              />
              <Form.Control.Feedback type="invalid">
                {errors.expiryDate}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>CVV</Form.Label>
              <Form.Control
                type="password"
                maxLength="3"
                value={formData.cvv}
                onChange={(e) =>
                  setFormData({ ...formData, cvv: e.target.value })
                }
                isInvalid={!!errors.cvv}
              />
              <Form.Control.Feedback type="invalid">
                {errors.cvv}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cardholder Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.cardHolder}
                onChange={(e) =>
                  setFormData({ ...formData, cardHolder: e.target.value })
                }
                isInvalid={!!errors.cardHolder}
              />
              <Form.Control.Feedback type="invalid">
                {errors.cardHolder}
              </Form.Control.Feedback>
            </Form.Group>

            {errors.seats && (
              <div className="text-danger mb-3">{errors.seats}</div>
            )}

            <Button type="submit" variant="primary" className="w-100">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <section className="bg-black">
        <Container>
          <Row className="d-flex justify-content-center">
            <Col md={6}>
              <div className="bookingContainer">
                <h1>Book Tickets</h1>
                <div className="mb-3">
                  <label htmlFor="theaterLocation" className="form-label">
                    Location
                  </label>
                  <input
                    type="text"
                    value={theater.display_name}
                    className="form-control"
                    id="theaterLocation"
                    placeholder="Theater Location"
                    readOnly
                  />
                </div>

                <div>
                  <select
                    className="form-select"
                    aria-label="Select Movie"
                    onChange={(e) => setSelectedMovie(e.target.value)}
                  >
                    <option value="">Select Movie</option>
                    <option value="Avengers End Game">Avengers End Game</option>
                    <option value="Bagheera">Bagheera</option>
                    <option value="Lucky Baskhar">Lucky Baskhar</option>
                  </select>
                </div>

                <h4 className="text-white">Select Your Seats:</h4>
                <div className="seatLayout">
                  {seatLayout.map((row, rowIndex) => (
                    <div key={rowIndex} className="seatRow">
                      {row.map((seat) => (
                        <button
                          key={seat}
                          className={`seat ${
                            selectedSeats.includes(seat) ? "selected" : ""
                          }`}
                          onClick={() => handleSeatSelection(seat)}
                        >
                          {seat}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>

                <Button onClick={handleProceedToPayment}>
                  Proceed to Payment
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />
    </>
  );
};

export default BookingPage;
