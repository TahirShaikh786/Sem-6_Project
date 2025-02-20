import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getRandomMovies, getAllMovies, topRated, historyMovie, collaborativeFilter, userViewMovies } from "./movies";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [allUser, setAllUser] = useState(null);
  const [film, setFilm] = useState([]);
  const [movies, setMovies] = useState([]);
  const [rated, setRated] = useState([]);
  const [history, setHistory] = useState([]);
  const [colFilter, setColFilter] = useState([]);
  const [viewMovies, setViewMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const authorizationToken = `Bearer ${token}`;
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const recommendURl = import.meta.env.VITE_RECOMMEND_URL;

  // Store token in LocalStorage
  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  // Logout user
  const logoutUser = async () => {
    try {
      const response = await fetch(`${backendURL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("Logout", data);
      if (response.ok) {
        toast.success(data.message);
        setToken("");
        setUser(null);
        localStorage.removeItem("token");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error in Logout", error.message);
    }
  };

  // Fetch user data from API
  const userAuthentication = async () => {
    try {
      const response = await fetch(`${backendURL}/auth/user`, {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.userData);
      } else {
        toast.error("Failed to fetch user data.");
        setUser(null);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
      console.log("Error fetching user data:", error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const getAllUSer = async () => {
    const response = await fetch(`${backendURL}/auth/admin`, {
      method: "GET",
      headers: {
        Authorization: authorizationToken,
      },
    });

    if(response.ok){
      const data = await response.json();
      setAllUser(data.message);
    }
  };

  // Fetch Movie data from Server
  useEffect(() => {
    if (token) {
      userAuthentication();
      getAllUSer();
      getRandomMovies(backendURL, setFilm);
      getAllMovies(backendURL, setMovies);
      topRated(backendURL, setRated);
      historyMovie(setHistory, user, movies);
      collaborativeFilter(recommendURl, setColFilter, user, movies);
    } else {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
  
    if (user?.viewMovies && movies?.message?.length > 0) {
      userViewMovies(setViewMovies, user, movies);
      historyMovie(setHistory, user, movies.message);
      collaborativeFilter(recommendURl, setColFilter, user, movies.message);
    } else {
      console.warn("❌ Skipping userViewMovies - Data not ready");
    }
  }, [user, movies]);
  

  return (
    <AuthContext.Provider
      value={{
        user,
        logoutUser,
        viewMovies,
        backendURL,
        storeTokenInLS,
        film,
        colFilter,
        rated,
        history,
        getAllMovies,
        getAllUSer,
        allUser,
        userAuthentication,
        historyMovie,
        movies,
        authorizationToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);

  if (!authContextValue) {
    throw new Error("useAuth must be used within the AuthProvider");
  }

  return authContextValue;
};

export { AuthContext };
