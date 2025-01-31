import User from "../models/user-model";

const booking = async (req, res) => {
  const { userId, theaterName, selectedSeats, movieName } = req.body;

  if (
    !Array.isArray(selectedSeats) ||
    selectedSeats.some((seat) => typeof seat.number !== "string")
  ) {
    return res.status(400).json({
      message: "Invalid seat format. Each seat must have a 'number' field.",
    });
  }

  // Validate incoming data
  if (!userId || !theaterName || !selectedSeats.length || !movieName) {
    return res.status(400).json({ message: "Invalid booking data" });
  }

  try {
    // Find the user and check for existing booking with the same movie and location
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the booking already exists for the same movie and location
    const existingBookingIndex = user.booking.findIndex(
      (booking) =>
        booking.movieName === movieName && booking.location === theaterName
    );

    if (existingBookingIndex !== -1) {
      // If the booking exists, update the seat numbers (prevent duplicates)
      const existingSeats = user.booking[existingBookingIndex].seatNo.map(
        (seat) => seat.number
      );

      const newSeats = selectedSeats.filter(
        (seat) => !existingSeats.includes(seat.number)
      );

      user.booking[existingBookingIndex].seatNo.push(...newSeats);
    } else {
      // If the booking doesn't exist, add a new entry
      user.booking.push({
        userId,
        movieName,
        seatNo: selectedSeats,
        location: theaterName,
        createdAt: new Date(),
      });
    }

    // Save the updated user document
    await user.save();

    return res.status(200).json({
      message: "Booking updated successfully",
      bookings: user.booking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return res.status(500).json({ message: "Failed to process booking" });
  }
};

export { booking };
