import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useNavigateMovies = () => {
  const navigate = useNavigate();
  const WatchMovies = (id) => {
    navigate(`/Watch/${id}`);
  };
  return { WatchMovies };
};

export const getRandomMovies = async (backendURL, setFilm) => {
  try {
    const response = await fetch(`${backendURL}/movie/mix/random`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const movies = await response.json();
      setFilm(movies); // Save to the state using the setter
    } else {
      toast.error("Failed to fetch random movie data.");
    }
  } catch (error) {
    toast.error("Internal Server Error");
    console.log("Error while fetching random movie data:", error.message);
  }
};

export const getAllMovies = async (backendURL, setMovies) => {
  try {
    const response = await fetch(`${backendURL}/movie/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const movies = await response.json();
      setMovies(movies); // Save to the state using the setter
    } else {
      toast.error("Failed to fetch movie data.");
    }
  } catch (error) {
    toast.error("An error occurred while fetching all movies.");
    console.log("Error fetching all movies:", error.message);
  }
};

export const topRated = async (backendURL, setRated) => {
  try {
    const response = await fetch(`${backendURL}/movie/top/rated`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      setRated(data); // Save to the state using the setter
    } else {
      toast.error("Failed to fetch top-rated movies.");
    }
  } catch (error) {
    toast.error("An error occurred while fetching top-rated movies.");
    console.log("Error fetching top-rated movies:", error.message);
  }
};

export const historyMovie = (setHistory, user, movies) => {
  // Check if movies.message is an array
  if (Array.isArray(movies.message)) {
    // Filter the movies based on whether their name exists in the user's search history
    const searchHistoryMovies = movies.message.filter(
      (movie) => user.searchHistory.includes(movie.name)
    );
    setHistory(searchHistoryMovies);
  } else {
    setHistory([]); 
  }
};

export const userViewMovies = (setViewMovies, user, movies) => {
   const matchedMovies = movies.message.filter((movie) =>
    user.viewMovies.some(
      (viewMovie) => viewMovie.movieId?.toString() === movie._id?.toString()
    )
  );

  setViewMovies(matchedMovies);
};


export const collaborativeFilter = async (recommendURl, setColFilter, user, movies) => {
  try {
    const response = await fetch(`${recommendURl}/get_recommended_movies/${user._id}`, {
      method: "GET"
    });

    const data = await response.json();

    if (response.ok) {
      // Match recommended movies with the full movie list
      const matchedMovies = data.map(recMovie => {
        return movies.message.find(movie => movie._id === recMovie.movieId);
      }).filter(Boolean); // Remove any undefined results
      setColFilter(matchedMovies); // Update the state with matched movies
    } else {
      console.log("Error in Recommend", data);
    }
  } catch (error) {
    console.error("Error fetching recommendations:", error);
  }
};
