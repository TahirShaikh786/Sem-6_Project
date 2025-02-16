import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Container, Card } from "react-bootstrap";
import { jsPDF } from "jspdf";
import { Helmet } from "react-helmet";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state;

  if (!bookingDetails) {
    return <h2>No booking details available</h2>;
  }

  const { username, movie, theater, amount, seats, paymentId } = bookingDetails;

  const handleDownloadTicket = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("🎟️ CineWorld Movie Ticket", 20, 20);
    doc.setFontSize(14);
    doc.text(`👤 Name: ${username}`, 20, 40);
    doc.text(`🎬 Movie: ${movie}`, 20, 50);
    doc.text(`📍 Theater: ${theater}`, 20, 60);
    doc.text(`💺 Seats: ${seats.join(", ")}`, 20, 70);
    doc.text(`💰 Amount Paid: ₹${amount}`, 20, 80);
    doc.text(`🆔 Payment ID: ${paymentId}`, 20, 90);
    doc.text("Enjoy your movie! 🍿", 20, 110);

    doc.save("Movie_Ticket.pdf");
  };

  return (
    <>
    <Helmet>
      <title>Payment Done - Cine World</title>
    </Helmet>
    <section className="bg-black">
      
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="p-4 bg-gradient">
          <h2 className="text-success text-center fw-bold fst-italic">✅ Payment Successful!</h2>
          <p>
            <strong>Name:</strong> {username}
          </p>
          <p>
            <strong>Movie:</strong> {movie}
          </p>
          <p>
            <strong>Seats:</strong> {seats.join(", ")}
          </p>
          <p>
            <strong>Total Paid:</strong> ₹{amount}
          </p>
          <p>
            <strong>Payment ID:</strong> {paymentId}
          </p>
          <p>
            <strong>Theater:</strong> {theater}
          </p>
          <Button
            variant="primary"
            onClick={handleDownloadTicket}
            className="mt-3"
          >
            📥 Download Ticket
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/home")}
            className="mt-3"
          >
            🏠 Go to Home
          </Button>
        </Card>
      </Container>
    </section>
    </>
  );
};

export default Success;
