import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    usedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    seatNo: [
      {
        number: {
          type: String,
          required: true,
        },
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('booking', bookingSchema);