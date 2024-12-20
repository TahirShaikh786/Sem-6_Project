import React, { useEffect, useRef, useState } from "react";
import "../assets/CSS/components.css";
import { toast } from "react-toastify";
import { useAuth } from "../Service/auth";
import { Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SearchModal = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [sdata, setSdata] = useState([]);
  const [history, setHistory] = useState([]);
  const { backendURL, user, authorizationToken, userAuthentication } =
    useAuth();

  const navigate = useNavigate();

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
    } else {
      toast.error("No search results found.");
    }
  };

  const handleMovie = (id) => {
    navigate(`/Watch/${id}`);
  };

  return (
    <>
      <div
        className="modal-overlay"
        onClick={() => {
          setVisible(false);
        }}
      >
        <div className="modalBox">
          <input
            type="text"
            name="search"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => {
              setVisible(true);
            }}
            placeholder="Enter search term..."
          />
          <button onClick={handleSearch}>
            <i className="bi bi-search"></i>
          </button>
        </div>
        {visible ? (
          <div className="searchHistory ">
            {history.map((item, i) => {
              return (
                <div key={i}>
                  <ul>
                    <li>{item}</li>
                  </ul>
                </div>
              );
            })}
          </div>
        ) : (
          ""
        )}
      </div>

      <section>
        <Container>
          <Row className="d-flex justify-content-center">
            {sdata.length == 0 ? (
              <div className="col-12 text-center">
                <h2 className="text-white fst-italic"></h2>
              </div>
            ) : (
              sdata.map((item, i) => {
                return (
                  <div
                    className="col-12 col-md-6 col-lg-4 my-3 d-flex justify-content-center"
                    key={i}
                    onClick={() => handleMovie(item._id)}
                  >
                    <div className="scard">
                      <img
                        src={item.titleImage}
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
