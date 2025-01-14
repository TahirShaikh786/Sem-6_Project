import React, { useState } from "react";
import AdminHeader from "../Components/AdminHeader";
import Footer from "../Components/Footer";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useAuth } from "../Service/auth";

const Movies = () => {
  const { backendURL, authorizationToken } = useAuth();
  const [createMovies, setCreateMovie] = useState({
    name: "",
    desc: "",
    image: "",
    titleImage: "",
    rate: "",
    numberOfReviews: "",
    category: "",
    time: "",
    language: "",
    year: "",
    video: "",
    casts: [""], // Initialize with one empty field for casts
  });

  // Handle input change for the main fields (name, description, etc.)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreateMovie({
      ...createMovies,
      [name]: value,
    });
  };

  // Handle change for the cast fields (where we have an array of values)
  const handleCastChange = (e, index) => {
    const { value } = e.target;
    const updatedCasts = [...createMovies.casts];
    updatedCasts[index] = value; // Update the cast member at the given index
    setCreateMovie({
      ...createMovies,
      casts: updatedCasts,
    });
  };

  // Add a new empty cast input field
  const handleAddCast = () => {
    setCreateMovie({
      ...createMovies,
      casts: [...createMovies.casts, ""], // Add a new empty string to the casts array
    });
  };

  // Remove a cast input field at the specified index
  const handleRemoveCast = (index) => {
    const updatedCasts = createMovies.casts.filter((_, i) => i !== index); // Remove cast at the given index
    setCreateMovie({
      ...createMovies,
      casts: updatedCasts,
    });
  };

  // Handle file change for movie image and title image
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setCreateMovie({
      ...createMovies,
      [name]: files[0], // Assign the first file to the state
    });
  };

  // Submit movie data
  const createMovie = async () => {
    const formData = new FormData();
    Object.keys(createMovies).forEach((key) => {
      if (key === "casts") {
        // Append each cast individually as an array of casts
        createMovies.casts.forEach((cast) => formData.append("casts[]", cast));
      } else {
        formData.append(key, createMovies[key]);
      }
    });

    const response = await fetch(`${backendURL}/movie`, {
      method: "POST",
      headers: {
        Authorization: authorizationToken,
      },
      body: formData,
    });

    const data = await response.json();
    console.log("data ", data);
  };

  return (
    <>
      <AdminHeader />
      <section className="bg-black py-3">
        <Container>
          <Row>
            <h1>Add Movie</h1>
          </Row>
          <Row className="d-flex justify-content-center">
            <Col md={6}>
              <Form>
                <Form.Group className="mb-3" controlId="movieName">
                  <Form.Label>Movie Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={createMovies.name}
                    onChange={handleInputChange}
                    placeholder="Enter Movie Name..."
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="movieDescription">
                  <Form.Label>Movie Description</Form.Label>
                  <Form.Control
                    type="text"
                    name="desc"
                    value={createMovies.desc}
                    onChange={handleInputChange}
                    placeholder="Enter some information about the movie..."
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="movieImage">
                  <Form.Label>Movie Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="movieTitleImage">
                  <Form.Label>Movie Title Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="titleImage"
                    onChange={handleFileChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="movieRate">
                  <Form.Label>Movie Rate</Form.Label>
                  <Form.Control
                    type="number"
                    name="rate"
                    value={createMovies.rate}
                    onChange={handleInputChange}
                    placeholder="Enter movie rating..."
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="movieReviews">
                  <Form.Label>Number of Reviews</Form.Label>
                  <Form.Control
                    type="number"
                    name="numberOfReviews"
                    value={createMovies.numberOfReviews}
                    onChange={handleInputChange}
                    placeholder="Enter number of reviews..."
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="movieCategory">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={createMovies.category}
                    onChange={handleInputChange}
                    placeholder="Enter movie category..."
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="movieTime">
                  <Form.Label>Movie Duration (in minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    name="time"
                    value={createMovies.time}
                    onChange={handleInputChange}
                    placeholder="Enter movie duration..."
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="movieLanguage">
                  <Form.Label>Language</Form.Label>
                  <Form.Control
                    type="text"
                    name="language"
                    value={createMovies.language}
                    onChange={handleInputChange}
                    placeholder="Enter movie language..."
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="movieYear">
                  <Form.Label>Release Year</Form.Label>
                  <Form.Control
                    type="number"
                    name="year"
                    value={createMovies.year}
                    onChange={handleInputChange}
                    placeholder="Enter release year..."
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="movieVideo">
                  <Form.Label>Movie Video URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="video"
                    value={createMovies.video}
                    onChange={handleInputChange}
                    placeholder="Enter video URL..."
                  />
                </Form.Group>

                {/* Render dynamic cast fields */}
                <Form.Group className="mb-3">
                  <Form.Label>Cast Members</Form.Label>
                  {createMovies.casts.map((cast, index) => (
                    <div key={index} className="d-flex mb-2">
                      <Form.Control
                        type="text"
                        name="casts"
                        value={cast}
                        onChange={(e) => handleCastChange(e, index)} // Ensure this targets the correct cast
                        placeholder={`Enter cast member ${index + 1}`}
                      />
                      <Button
                        variant="danger"
                        onClick={() => handleRemoveCast(index)}
                        className="ms-2"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button variant="secondary" onClick={handleAddCast}>
                    Add Cast
                  </Button>
                </Form.Group>

                <Button variant="primary" onClick={createMovie}>
                  Create Movie
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />
    </>
  );
};

export default Movies;
