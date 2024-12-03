// src/App.js

import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import axios from "axios";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 37.7749, // Default center (San Francisco)
  lng: -122.4194,
};

function App() {
  const [markers, setMarkers] = useState([]);
  const [optimizedRoute, setOptimizedRoute] = useState([]);

  const handleMapClick = async (event) => {
    const newMarker = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    setMarkers([...markers, newMarker]);

    // Save marker to the backend
    await axios.post("http://localhost:3001/api/locations", newMarker);
  };

  const fetchOptimizedRoute = async () => {
    const response = await axios.get(
      "http://localhost:3001/api/optimized-route"
    );
    setOptimizedRoute(response.data.route);
  };

  useEffect(() => {
    fetchOptimizedRoute();
  }, [markers]);

  return (
    <div>
      <h1>Route Optimization</h1>
      <LoadScript googleMapsApiKey="YOUR_API_KEY">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={10}
          onClick={handleMapClick}
        >
          {markers.map((marker, index) => (
            <Marker key={index} position={marker} />
          ))}
          {optimizedRoute.length > 0 && (
            <Polyline
              path={optimizedRoute}
              options={{
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
      <button onClick={fetchOptimizedRoute}>Show Optimized Route</button>
    </div>
  );
}

export default App;
