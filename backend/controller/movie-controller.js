import { MoviesData } from "../Data/MoviesData.js";
import Movie from "../models/movie-model.js";

// Public Controller
const addMoviesToDB = async (req, res) => {
  try {
    await Movie.deleteMany({});
    const movies = await Movie.insertMany(MoviesData);
    return res.status(200).json({ success: true, message: movies });
  } catch (error) {
    console.log("Error while adding movies to database", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.status(200).json({ success: true, message: movies });
  } catch (error) {
    console.log("Error while getting movies");
    res.status(500).json({ success: true, message: "Internal Server Error" });
  }
};

const getMovies = async (req, res) => {
  try {
    const { category, time, language, rate, year, search } = req.query;
    let query = {
      ...(category && { category }),
      ...(time && { time }),
      ...(language && { language }),
      ...(rate && { rate }),
      ...(year && { year }),
      ...(search && { name: { $regex: search, $options: "i" } }),
    };

    const page = Number(req.query.pageNumber) || 1;
    const limit = undefined;
    const skip = (page - 1) * limit;

    const movies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const count = await Movie.countDocuments(query);

    res.status(200).json({
      success: true,
      message: {
        movies,
        page,
        pages: Math.ceil(count / limit),
        totalMovies: count,
      },
    });
  } catch (error) {
    console.log("Errot While getting Movies", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      res.status(200).json({ success: true, message: movie });
    } else {
      res.status(400).json({ success: false, message: "Movie Not Found" });
    }
  } catch (error) {
    console.log("Error while Getting Movies by Id", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server Error" });
  }
};

const getTopRatedMovies = async (req, res) => {
  try {
    const movies = await Movie.find({}).sort({ rate: -1 });
    res.status(200).json({ success: true, message: movies });
  } catch (error) {
    console.log("Error While Getting Top Rated Movies:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getRandomMovies = async (req, res) => {
  try {
    const movies = await Movie.aggregate([{ $sample: { size: 10 } }]);
    // const movies = await Movie.find({});
    res.status(200).json({ success: true, message: movies });
  } catch (error) {
    console.log("Error While Getting Random Movies:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getMovieReviews = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      return res.status(200).json({ success: true, message: movie.reviews });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Movie Not Found" });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Private Controller
const createMovieReview = async (req, res) => {
  const { rating, comment, image } = req.body; // Destructure the body
  if (!rating || !comment) {
    return res.status(400).json({
      success: false,
      message: "Rating and comment are required",
    });
  }

  try {
    // Find the movie by ID
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie Not Found",
      });
    }

    // Ensure reviews array exists
    if (!movie.reviews) {
      movie.reviews = [];
    }

    // Check if the user has already reviewed the movie
    // const alreadyReviewed = movie.reviews.find(
    //   (r) => String(r.userId) === String(req.user._id)
    // );

    // if (alreadyReviewed) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "You have already reviewed this movie",
    //   });
    // }

    // Create a new review
    const review = {
      userName: req.user.userName,
      userId: req.user._id,
      userImage: req.user.image || null, // Allow `userImage` to be optional
      rating: Number(rating),
      comment,
    };

    // Add the review to the movie
    movie.reviews.push(review);

    // Update the number of reviews
    movie.numOfReviews = movie.reviews.length;

    // Update the average rating
    movie.rate =
      movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
      movie.reviews.length;

    // Save the updated movie
    await movie.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      reviews: movie.reviews,
      rate: movie.rate,
      numOfReviews: movie.numOfReviews,
    });
  } catch (error) {
    console.error("Error while creating movie review:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Admin Controller
const updateMovie = async (req, res) => {
  try {
    const {
      name,
      desc,
      image,
      titleImage,
      rate,
      numberOfReviews,
      category,
      time,
      language,
      year,
      video,
      casts,
    } = req.body;

    const movie = await Movie.findById(req.params.id);

    if (movie) {
      movie.name = name || movie.name;
      movie.desc = desc || movie.desc;
      movie.image = image || movie.image;
      movie.titleImage = titleImage || movie.titleImage;
      movie.rate = rate || movie.rate;
      movie.numOfReviews = numberOfReviews || movie.numOfReviews;
      movie.category = category || movie.category;
      movie.time = time || movie.time;
      movie.language = language || movie.language;
      movie.year = year || movie.year;
      movie.video = video || movie.video;
      movie.casts = casts || movie.casts;

      const updateMovie = await movie.save();
      res.status(200).json({ success: true, message: updateMovie });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Movie Not Found" });
    }
  } catch (error) {
    console.log("Error while Updating Movie", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const movie = await findById(req.params.id);
    if (movie) {
      await movie.deleteOne();
      res
        .status(200)
        .json({ success: true, message: "Movie deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Movie Not Found" });
    }
  } catch (error) {
    console.log("Error while Deleting Movie", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const deleteAllMovie = async (req, res) => {
  try {
    await Movie.deleteMany();
    res.json({ success: true, message: "All Movie was removed from the list" });
  } catch (error) {
    console.log("Error while Deleting All Movies", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const createMovie = async (req, res) => {
  try {
    const {
      name,
      desc,
      category,
      language,
      year,
      time,
      video,
      director,
      platform,
      rate,
      numberOfReviews,
      forChild,
      casts,
    } = req.body;

    // Parse casts JSON (since it's sent as a string from the form)
    const parsedCasts = casts ? JSON.parse(casts) : [];

    const newMovie = new Movie({
      userID: req.user._id, // Assuming authenticated user is creating the movie
      name,
      desc,
      category,
      language,
      year,
      time,
      video,
      director,
      platform,
      rate,
      numberOfReviews,
      forChild: forChild === "true", // Convert string to boolean
      casts: parsedCasts,
      image: req.file ? `/${req.file.filename}` : null, // Handle uploaded image
    });

    const createdMovie = await newMovie.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Movie created successfully",
        data: createdMovie,
      });
  } catch (error) {
    console.error("Error creating movie:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export {
  addMoviesToDB,
  getMovies,
  getMovieById,
  getTopRatedMovies,
  getRandomMovies,
  createMovieReview,
  updateMovie,
  deleteMovie,
  deleteAllMovie,
  createMovie,
  getAllMovies,
  getMovieReviews,
};
