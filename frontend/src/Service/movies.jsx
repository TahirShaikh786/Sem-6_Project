// src/Service/movieUtils.js
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
