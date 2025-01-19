import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import GetLocation from "../Components/GetLocation";
import Footer from "../Components/Footer";
import L from "leaflet";
import { useNavigate } from "react-router-dom"; // React Router
import cinema from "../assets/img/cinema.png";
import { Container, Row } from "react-bootstrap";
import FixedHeader from "../Components/FixedHeader";

// Custom theater icon
const theaterIcon = new L.Icon({
  iconUrl: cinema, // Replace with your image path
  iconSize: [40, 40], // Size of the icon
  iconAnchor: [20, 40], // Anchor point of the icon (center bottom)
  popupAnchor: [0, -40], // Anchor for popups
});

const Maps = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [theaters, setTheaters] = useState([]);
  const navigate = useNavigate(); // To navigate to the booking page

  // Fetch nearby theaters
  useEffect(() => {
    if (userLocation) {
      const fetchTheaters = async () => {
        try {
          const endpoint = `https://nominatim.openstreetmap.org/search?format=json&q=cinema&bounded=1&limit=10&viewbox=${
            userLocation.lng - 0.1
          },${userLocation.lat + 0.1},${userLocation.lng + 0.1},${
            userLocation.lat - 0.1
          }`;
          const response = await axios.get(endpoint);
          setTheaters(response.data);
        } catch (error) {
          console.error("Error fetching theaters:", error);
        }
      };
      fetchTheaters();
    }
  }, [userLocation]);

  // Navigate to theater booking page
  const handleTheaterClick = (theater) => {
    navigate(`/booking/${theater.place_id}`, { state: { theater } }); // Pass theater data via route state
  };

  return (
    <>
      <FixedHeader />

      <section className="bg-black">
        <Container>
          <Row>
            <div style={{ height: "100vh", width: "100%", borderRadius: "10rem" }}>
              {/* Component to Get User's Location */}
              <GetLocation setLocation={setUserLocation} />

              {/* Show Loading or Error Message */}
              {!userLocation ? (
                <div style={{ textAlign: "center", marginTop: "20%" }}>
                  <h2>Fetching your location...</h2>
                </div>
              ) : (
                <MapContainer
                  center={[userLocation.lat, userLocation.lng]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  {/* User's Location */}
                  <Marker position={[userLocation.lat, userLocation.lng]}>
                    <Popup>You are here</Popup>
                  </Marker>

                  {/* Nearby Theaters */}
                  {theaters.map((theater, index) => (
                    <Marker
                      key={index}
                      position={[theater.lat, theater.lon]}
                      icon={theaterIcon} // Use custom theater icon
                      eventHandlers={{
                        click: () => handleTheaterClick(theater), // Handle click event
                      }}
                    >
                      <Popup>
                        <strong>{theater.display_name}</strong>
                        <br />
                        <button
                          onClick={() => handleTheaterClick(theater)}
                          style={{
                            background: "#007BFF",
                            color: "#FFF",
                            border: "none",
                            borderRadius: "5px",
                            padding: "5px 10px",
                            cursor: "pointer",
                          }}
                        >
                          Book Now
                        </button>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              )}
            </div>
          </Row>
        </Container>
      </section>

      <Footer />
    </>
  );
};

export default Maps;
