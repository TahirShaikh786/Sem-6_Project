import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const authorizationToken = `Bearer ${token}`;
  const backendURL = import.meta.env.VITE_BACKEND_URL;

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

  // Fetch Movie data from Server
  const getRandomMovies = async () => {
    try {
      const movie = await fetch(`${backendURL}/movie/mix/random`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (movie.ok) {
        const movies = await movie.json();
        setFilm(movies);
      } else {
        toast.error("Failed to fetch movie data.");
      }
    } catch (error) {
      console.log("Error while fetching movie", error.message);
      toast.error("Internal Server Error");
    }
  };

  useEffect(() => {
    if (token) {
      userAuthentication();
      getRandomMovies();
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        logoutUser,
        backendURL,
        storeTokenInLS,
        film,
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
