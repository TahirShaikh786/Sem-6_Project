import React from "react";
import "../assets/CSS/pages.css";
import { Helmet } from "react-helmet";
import microphone from "../assets/img/microphone.png";
import Header from "../Components/Header";
import HeroVideo from "../Components/HeroVideo";
import { useAuth } from "../Service/auth.jsx";
import { Button, Card } from "react-bootstrap";

const Dashboard = () => {
  const { film } = useAuth();
  return (
    <>
      <Helmet>
        <title>Dashboard | Cine World</title>
      </Helmet>

      <Header />

      <main className="position-relative">
        {/* Hero Videos */}
        <section>
          <HeroVideo />
        </section>

        {/* All Videos */}
        <section className="bg-black p-5">
          <div className="container m-0 p-0">
            <div className="row m-0 p-0 allVideosHead">
              <h2>All Movies</h2>
            </div>
            <div className="row m-0 p-0 d-flex justify-content-between">
              {film.message.map((movie, i) => {
                return (
                  <Card className="movieCards">
                    <Card.Img variant="top" src={movie.titleImage} />
                    <Card.Body>
                      <Card.Title>{movie.name}</Card.Title>
                      <Card.Text>
                        {movie.desc}
                      </Card.Text>
                      <Button variant="primary">More Info</Button>
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <aside>
          <img src={microphone} alt="microphone" />
        </aside>
      </main>
    </>
  );
};

export default Dashboard;
