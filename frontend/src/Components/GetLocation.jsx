import React, { useEffect, useState } from "react";

const GetLocation = ({ setLocation }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (err) => setError(err.message),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, [setLocation]);

  // Display error if there is an issue
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return null; // Render nothing if no error
};

export default GetLocation;
