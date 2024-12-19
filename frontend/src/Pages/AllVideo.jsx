import React from "react";
import Helmet from "react-helmet";
import "../assets/CSS/videos.css";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Videos from "../Components/Videos";

const AllVideo = () => {
  return (
    <>
      <Helmet>
        <title>All Video - Cine World</title>
      </Helmet>

      <Header />

      <Videos title={"Movies"} />

      <Footer />
    </>
  );
};

export default AllVideo;
