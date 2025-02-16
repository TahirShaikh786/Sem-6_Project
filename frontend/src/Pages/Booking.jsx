import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useAuth } from "../Service/auth";
import { toast } from "react-toastify";
import { loadRazorpay } from "../UsableComponents/payment";

const BookingPage = () => {
  const { user, allUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const razorKey = import.meta.env.VITE_RAZOR_KEY;

  const theater = location.state?.theater;
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);

  const moviePrices = {
    "Avengers End Game": 500,
    "Bagheera": 250,
    "Lucky Baskhar": 350,
    "IT": 1
  };

  const seatLayout = [
    ["A1", "A2", "A3", "A4", "A5"],
    ["B1", "B2", "B3", "B4", "B5"],
    ["C1", "C2", "C3", "C4", "C5"],
  ];

  const bookedSeats = new Set();
  if (allUser && Array.isArray(allUser)) {
    allUser.forEach((user) => {
      user.booking?.forEach((booking) => {
        if (booking.location === theater?.display_name) {
          booking.seatNo?.forEach((seat) => bookedSeats.add(seat.number));
        }
      });
    });
  }

  const handleSeatSelection = (seat) => {
    setSelectedSeats((prevSeats) =>
      prevSeats.includes(seat)
        ? prevSeats.filter((s) => s !== seat)
        : [...prevSeats, seat]
    );
  };

  const totalPrice = selectedSeats.length * (moviePrices[selectedMovie] || 0);

  const handlePayment = async () => {
    if (!selectedMovie || selectedSeats.length === 0) {
      toast.error("Please select a movie and at least one seat.");
      return;
    }

    const res = await loadRazorpay(); // Ensure Razorpay script is loaded

    if (!res) {
      toast.error(
        "Razorpay SDK failed to load. Please check your internet connection."
      );
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZOR_KEY,
      amount: totalPrice * 100,
      currency: "INR",
      name: "CineWorld",
      description: `Booking for ${selectedMovie}`,
      handler: (response) => {
        toast.success("Payment Successful! Redirecting...");

        // Navigate to success page after payment
        navigate("/success", {
          state: {
            username: user?.name || "Guest",
            movie: selectedMovie,
            theater: theater.display_name,
            amount: totalPrice,
            seats: selectedSeats,
            paymentId: response.razorpay_payment_id,
          },
        });
      },
      prefill: {
        name: user?.name || "Guest",
        email: user?.email || "guest@example.com",
      },
      theme: {
        color: "#F37254",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  if (!theater) return <h2>No theater data available</h2>;

  return (
    <>
      <Container>
        <Row className="d-flex justify-content-center">
          <Col md={6}>
            <div className="bookingContainer">
              <h1>Book Tickets</h1>
              <input
                type="text"
                value={theater.display_name}
                className="form-control"
                readOnly
              />

              <select
                className="form-select mt-2"
                onChange={(e) => setSelectedMovie(e.target.value)}
              >
                <option value="">Select Movie</option>
                {Object.entries(moviePrices).map(([movie, price]) => (
                  <option key={movie} value={movie}>
                    ₹ {price}/- {movie}
                  </option>
                ))}
              </select>

              <h4 className="text-white mt-3">Select Your Seats:</h4>
              <div className="seatLayout">
                {seatLayout.map((row, rowIndex) => (
                  <div key={rowIndex} className="seatRow">
                    {row.map((seat) => (
                      <button
                        key={seat}
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

              <h5 className="text-white mt-3">Total Price: ₹{totalPrice}</h5>
              <Button onClick={handlePayment} className="mt-2">
                Proceed to Payment
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default BookingPage;
