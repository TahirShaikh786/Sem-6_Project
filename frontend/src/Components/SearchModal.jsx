import React, { useEffect, useState } from "react";
import "../assets/CSS/components.css";
import Videos from "./Videos";
import { toast } from "react-toastify";
import { useAuth } from "../Service/auth";
import { Container, Row } from "react-bootstrap";
import { useNavigateMovies } from "../Service/movies";

const SearchModal = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [sdata, setSdata] = useState([]);
  const [history, setHistory] = useState([]);
  const { backendURL, user, movies, authorizationToken, userAuthentication, historyMovie } =
    useAuth();

  const {WatchMovies} = useNavigateMovies();

  useEffect(() => {
    if (user.searchHistory) {
      setHistory(user.searchHistory);
    }
  }, [user]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const response = await fetch(`${backendURL}/auth/${user._id}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${authorizationToken}`,
      },
      body: JSON.stringify({ query: searchQuery }),
    });
    const data = await response.json();
    setSdata(data.message);
    setVisible(false);

    if (response.ok) {
      userAuthentication();
      historyMovie();
    } else {
      toast.error("No search results found.");
    }
  };

  const handleHistory = async (item) => {
    const foundMovie = movies.message.find(
      (movie) => movie.name.toLowerCase() === item.toLowerCase()
    );
    if (foundMovie) {
      WatchMovies(foundMovie._id);
    } else {
      toast.error("No movie found with this name.");
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modalBox">
          <input
            type="text"
            name="search"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setVisible(true)}
            placeholder="Enter search term..."
          />
          <button onClick={handleSearch}>
            <i className="bi bi-search"></i>
          </button>
        </div>
        <div className="d-flex justify-content-center">
          {visible ? (
            <div className="searchHistory">
              {history.map((item, i) => {
                return (
                  <div key={i}>
                    <ul>
                      <li onClick={() => handleHistory(item)}>
                        <i class="bi bi-clock-history"></i> {item}
                      </li>
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      <section>
        <Container>
          <Row className="d-flex justify-content-center">
            {sdata.length == 0 ? (
              <div className="col-12 text-center ">
                <Videos />
              </div>
            ) : (
              sdata.map((item, i) => {
                return (
                  <div
                    className="col-12 col-md-6 col-lg-4 my-3 d-flex justify-content-center"
                    key={i}
                    onClick={() => WatchMovies(item._id)}
                  >
                    <div className="scard">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="card-img-top"
                      />
                      <div className="scard-body p-3">
                        <h5 className="scard-title">{item.name}</h5>
                        <p className="card-text">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default SearchModal;
