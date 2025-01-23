import React, { useState } from "react";
import "../assets/CSS/components.css";
import { useLocation } from "react-router-dom";
import Footer from "../Components/Footer";
import FixedHeader from "../Components/FixedHeader";
import { Col, Container, Row, Modal, Button, Form } from "react-bootstrap";
import { useAuth } from "../Service/auth";
import { jsPDF } from "jspdf";
import { toast } from "react-toastify";

const BookingPage = () => {
  const { user, backendURL, authorizationToken, allUser, getAllUSer } =
    useAuth();
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

  const bookedSeats = new Set();
  allUser.forEach((user) => {
    user.booking.forEach((booking) => {
      if (booking.location === theater.display_name) {
        booking.seatNo.forEach((seat) => {
          bookedSeats.add(seat.number); // Add booked seat number to the set
        });
      }
    });
  });

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
          setShowModal(false); // Close modal
          toast.success("Booking Successful!");
          generateTicketPDF(bookingData);
        } else {
          toast.error(`Booking Failed: ${result.message}`);
        }
      } catch (error) {
        console.error("Error submitting booking:", error);
        alert("An error occurred while processing your booking.");
      }
    } else {
      setErrors(newErrors); // Show validation errors
    }
  };

  // Function to generate the PDF ticket
  const generateTicketPDF = (bookingData) => {
    const { movieName, selectedSeats, theaterName } = bookingData;

    const doc = new jsPDF();

    // Simulating a gradient using rectangles
    const gradientColors = ["#6a11cb", "#9b40e8"]; // Example gradient colors
    const steps = 100; // Number of gradient steps
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const stepHeight = pageHeight / steps;

    // Draw the gradient background
    for (let i = 0; i < steps; i++) {
      const color = interpolateColor(
        gradientColors[0],
        gradientColors[1],
        i / steps
      );
      doc.setFillColor(color);
      doc.rect(0, i * stepHeight, pageWidth, stepHeight, "F");
    }

    // Set text color to white
    doc.setTextColor(255, 255, 255);

    // Add Ticket Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Ticket Booking Confirmation", 60, 20);

    // Add Theater Information
    doc.setFontSize(12);
    doc.text(`Theater: ${theaterName}`, 20, 30);

    // Add Movie Inmformation
    doc.text(`Movie:-  ${movieName}`, 20, 40);

    // Handle selectedSeats: Extract seat numbers
    const seatNumbers = selectedSeats.map((seat) => {
      return seat.number;
    });

    // Add Seat Information
    const seatsText = seatNumbers.join(", ");
    doc.text(`Seats: ${seatsText}`, 20, 50);

    // Add Cardholder Name (for demo, this can be modified according to user data)
    doc.text(`Cardholder: ${formData.cardHolder}`, 20, 60);

    // Add a Thank You note
    doc.text("Thank you for your booking! Enjoy your movie!", 20, 70);

    // Save the PDF file as a ticket
    doc.save("movie_ticket.pdf");
  };

  // Helper function to interpolate between two colors
  const interpolateColor = (color1, color2, factor) => {
    const hexToRgb = (hex) => {
      const bigint = parseInt(hex.replace("#", ""), 16);
      return [bigint >> 16, (bigint >> 8) & 255, bigint & 255];
    };

    const rgbToHex = (r, g, b) => {
      return `#${[r, g, b]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")}`;
    };

    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * factor);
    const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * factor);
    const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * factor);

    return rgbToHex(r, g, b);
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

            <Button
              type="submit"
              onClick={() => getAllUSer()}
              variant="primary"
              className="w-100"
            >
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
                      {row.map((seat, index) => (
                        <button
                          key={index}
                          className={`seatBtn ${
                            bookedSeats.has(seat) ? "booked" : ""
                          } ${selectedSeats.includes(seat) ? "selected" : ""}`}
                          onClick={() =>
                            !bookedSeats.has(seat) && handleSeatSelection(seat)
                          }
                          disabled={bookedSeats.has(seat)}
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
