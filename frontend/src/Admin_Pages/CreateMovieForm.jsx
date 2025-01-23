import React, { useState } from "react";
import "../assets/CSS/admin.css";
import AdminHeader from "../Components/AdminHeader";
import Footer from "../Components/Footer";
import { Col, Container, Row } from "react-bootstrap";
import { useAuth } from "../Service/auth";
import { toast } from "react-toastify";

const CreateMovieForm = () => {
  const { backendURL, authorizationToken, getAllMovies } = useAuth();
  const [movieData, setMovieData] = useState({
    name: "",
    desc: "",
    category: "",
    language: "",
    year: "",
    time: "",
    video: "",
    director: "",
    platform: "",
    rate: 0,
    numberOfReviews: 0,
    forChild: false,
  });

  const [image, setImage] = useState(null);
  const [casts, setCasts] = useState([{ name: "" }]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMovieData({ ...movieData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setMovieData({ ...movieData, forChild: e.target.checked });
  };

  const handleCastChange = (index, value) => {
    const updatedCasts = [...casts];
    updatedCasts[index].name = value;
    setCasts(updatedCasts);
  };

  const addCast = () => {
    setCasts([...casts, { name: "" }]);
  };

  const removeCast = (index) => {
    const updatedCasts = casts.filter((_, i) => i !== index);
    setCasts(updatedCasts);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", movieData.name);
    formData.append("desc", movieData.desc);
    formData.append("category", movieData.category);
    formData.append("language", movieData.language);
    formData.append("year", movieData.year);
    formData.append("time", movieData.time);
    formData.append("video", movieData.video);
    formData.append("director", movieData.director);
    formData.append("platform", movieData.platform);
    formData.append("rate", movieData.rate);
    formData.append("numberOfReviews", movieData.numberOfReviews);
    formData.append("forChild", movieData.forChild);
    formData.append("casts", JSON.stringify(casts)); // Serialize casts array
    if (image) formData.append("image", image);

    try {
      const response = await fetch(`${backendURL}/movie/`, {
        method: "POST",
        headers: {
          Authorization: authorizationToken, // Keep only the Authorization header
        },
        body: formData, // Send FormData directly
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Movie Created Successfully");
        getAllMovies();
      } else {
        toast.error(data.message || "Internal Server Error");
      }
    } catch (error) {
      console.error("Error creating movie:", error);
      toast.error(error.message || "Something went wrong!");
    }
  };

  return (
    <>
      <AdminHeader />

      <section className="bg-black py-5">
        <Container>
          <Row className="d-flex justify-content-center">
            <Col md={7} className="movieForm">
              <h1>Create Movie</h1>
              <form className="movie-form" onSubmit={handleSubmit}>
                <div className="grid-container">
                  <div>
                    <label>Enter Movie Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={movieData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Category:</label>
                    <input
                      type="text"
                      name="category"
                      value={movieData.category}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Language:</label>
                    <input
                      type="text"
                      name="language"
                      value={movieData.language}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Year:</label>
                    <input
                      type="number"
                      name="year"
                      value={movieData.year}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Time (in Hours):</label>
                    <input
                      type="number"
                      name="time"
                      value={movieData.time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Director:</label>
                    <input
                      type="text"
                      name="director"
                      value={movieData.director}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Platform:</label>
                    <input
                      type="text"
                      name="platform"
                      value={movieData.platform}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Rate:</label>
                    <input
                      type="number"
                      name="rate"
                      value={movieData.rate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Number of Reviews:</label>
                    <input
                      type="number"
                      name="numberOfReviews"
                      value={movieData.numberOfReviews}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="full-width">
                    <label>Video URL:</label>
                    <input
                      type="url"
                      name="video"
                      value={movieData.video}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="full-width">
                    <label>Description:</label>
                    <textarea
                      name="desc"
                      value={movieData.desc}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="full-width">
                    <label>Image:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="full-width">
                    <label>Casts:</label>
                    {casts.map((cast, index) => (
                      <div className="cast-field" key={index}>
                        <input
                          type="text"
                          placeholder="Enter cast name"
                          value={cast.name}
                          onChange={(e) =>
                            handleCastChange(index, e.target.value)
                          }
                        />
                        <button type="button" className="bg-danger" onClick={() => removeCast(index)}>
                          Remove
                        </button>
                      </div>
                    ))}
                    <button type="button" className="bg-info" onClick={addCast}>
                      Add Cast
                    </button>
                  </div>

                  <div className="full-width checkbox-container">
                    <input
                      type="checkbox"
                      checked={movieData.forChild}
                      onChange={handleCheckboxChange}
                    />
                    <label>For Child:</label>
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <button type="submit" className="submit-button">
                    Create Movie
                  </button>
                </div>
              </form>
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />
    </>
  );
};

export default CreateMovieForm;
