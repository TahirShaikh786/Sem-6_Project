import React from "react";
import "../assets/CSS/pages.css";
import { Helmet } from "react-helmet";
import microphone from "../assets/img/microphone.png";
import Header from "../Components/Header";
import HeroVideo from "../Components/HeroVideo";
// import { Container } from "react-bootstrap";

const Dashboard = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard | Cine World</title>
      </Helmet>

      <Header />

      <main className="position-relative">
        <section>
          <HeroVideo />
        </section>
        <aside>
          <img src={microphone} alt="microphone" />
        </aside>
      </main>
    </>
  );
};

export default Dashboard;
