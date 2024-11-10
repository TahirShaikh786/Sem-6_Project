import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Please add a full Name"],
    },
    email: {
      type: String,
      required: [true, "Please add a Email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please add a Password"],
      minlength: [6, "Password must be atleast 6 character long"],
    },
    image: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    likedMovies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movies",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);