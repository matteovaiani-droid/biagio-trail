import { useEffect, useState } from "react";
import { useParams } from "wouter";

import { distanceLabel } from "@/components/TrailCard";
import { getTrails, getTrailById,} from "@/services/trailsService";
import { getOrCreateGeometry } from "@/services/geometryService";
import {  getWeather,  getWeatherDescription,} from "@/services/weatherService";
import {  MapContainer,  TileLayer,  Marker,  Popup,} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.css";


type TrailDetailPageProps = {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  unit: "km" | "mi";

};

export function TrailDetailPage({
  favorites,
  onToggleFavorite,
  unit,
}: TrailDetailPageProps) {
  const params = useParams<{ id: string }>();

  const [trail, setTrail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] =
    useState<any>(null);

        getTrailById(params.id)
        .then((found: any) => {

        if (!found) {
          setTrail(null);
          return;
        }

        setTrail({
          ...found,
          distanceKm: found.distance_km,
          elevationM: found.elevation_m,
          startPoint: found.start_point,
          reviewCount: found.review_count,
        });
        if (found.coordinates) {
          getWeather(found.coordinates)
            .then(setWeather)
            .catch(console.error);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        Caricamento...
      </div>
    );
  }

  if (!trail) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Sentiero non trovato</h2>
      </div>
    );
  }

  const isFavorite = favorites.includes(
    trail.id
  );

  const latitude = Number(
    trail.latitude
  );

  const longitude = Number(
    trail.longitude
  );
  const position: [number, number] = [
    latitude,
    longitude,
  ];
  const difficultyLabel = (
    difficulty: string
  ) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "🟢 Facile";

      case "medium":
        return "🟠 Media";

      case "hard":
        return "🔴 Difficile";

      case "expert":
        return "⚫ Esperto";

      default:
        return difficulty;
    }
  };
  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "180px 1fr 320px",
          alignItems: "center",
          marginBottom: "40px",
          gap: "20px",
        }}
      >
        <div>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              background: "#ffffff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Torna indietro
          </button>
        </div>

           <div>
             <h1
               style={{
                 margin: 0,
                 textAlign: "center",
                 color: "#0f2d5c",
                 fontSize: "2.8rem",
                 fontWeight: 800,
               }}
             >
               {trail.name}
             </h1>

             <p
               style={{
                 textAlign: "center",
                 marginTop: "8px",
               }}
             >
               {trail.region} - {trail.province}
             </p>
             </div>
            
             </div>

             <div
               style={{
                 textAlign: "right",
                 fontSize: "20px",
                 fontWeight: 600,
                 lineHeight: 1.8,
               }}
             >
           
  {weather?.current && (
    <>
      <div>
        {getWeatherDescription(
          weather.current.weather_code
        )}
      </div>

      <div>
        🌡️ {weather.current.temperature_2m}°C
      </div>

      <div>
        💨 {weather.current.wind_speed_10m} km/h
      </div>
    </>
  )}
</div>

      <hr />

      <p>
        📏 Distanza:{" "}
        {distanceLabel(
          trail.distanceKm,
          unit
        )}
      </p>

      <p>
        ⛰️ Dislivello: {trail.elevationM} m
      </p>
      {trail.difficulty && (
        <div
          style={{
            display: "inline-block",
            padding: "6px 12px",
            borderRadius: "999px",
            backgroundColor:
              trail.difficulty === "easy"
                ? "#dcfce7"
                : trail.difficulty === "medium"
                ? "#fef3c7"
                : "#fee2e2",
            marginBottom: "12px",
            fontWeight: "bold",
          }}
        >
          🥾 {difficultyLabel(trail.difficulty)}
        </div>
      )}
      
      <p>
        ⏱️ Durata: {trail.duration}
      </p>

      <p>
        ⭐ Rating: {trail.rating}
      </p>

      {trail.coordinates && (
        <p>
          📍 Coordinate:{" "}
          {trail.coordinates}
        </p>
      )}


      {trail.startPoint && (
        <p>
          🚩 Partenza:{" "}
          {trail.startPoint}
        </p>
      )}

{trail.latitude && trail.longitude && (
  <>
    <h3>🗺️ Posizione</h3>

    <div
      style={{
        height: "400px",
        marginBottom: "20px",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <a
        href={`https://www.google.com/maps?q=${latitude},${longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          marginBottom: "20px",
          padding: "10px 16px",
          backgroundColor: "#2563eb",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
          fontWeight: "bold",
        }}
      >
        
        <a
          href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginLeft: "10px",
            marginBottom: "20px",
          }}
        >
          🗺️ Apri in OpenStreetMap
        </a>
        📍 Apri in Google Maps
      </a>
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={[latitude, longitude]}
        >
          <Popup>
            {trail.name}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  </>
)}
      {trail.description && (
        <>
          <h3>Descrizione</h3>
          <p>{trail.description}</p>
        </>
      )}

            <button
              onClick={() =>
                onToggleFavorite(trail.id)
              }
            >
              {isFavorite
                ? "★ Preferito"
                : "☆ Salva"}
            </button>
            </div>
            );
            }