import { useEffect, useState } from "react";
import { useParams } from "wouter";

import { getTrailById } from "@/services/trailsService";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
} from "react-leaflet";

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

  useEffect(() => {
    if (!params.id) return;

    getTrailById(params.id)
      .then((data) => {
        setTrail(data);
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        Caricamento...
      </div>
    );
  }

  if (!trail) {
    return (
      <div style={{ padding: 20 }}>
        Sentiero non trovato
      </div>
    );
  }

  const isFavorite =
    favorites.includes(trail.id);

  const latitude = Number(
    trail.latitude
  );

  const longitude = Number(
    trail.longitude
  );

  const showMap =
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude);

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <button
        onClick={() =>
          window.history.back()
        }
      >
        ← Torna indietro
      </button>

      <h1>{trail.name}</h1>

      <p>
        {trail.region} - {trail.province}
      </p>

      <hr />

      {trail.distance_km && (
        <p>
          📏 Distanza:{" "}
          {trail.distance_km} km
        </p>
      )}

      {trail.elevation_m && (
        <p>
          ⛰️ Dislivello:{" "}
          {trail.elevation_m} m
        </p>
      )}

      {trail.duration && (
        <p>
          ⏱️ Durata: {trail.duration}
        </p>
      )}

      {trail.difficulty && (
        <p>
          🥾 Difficoltà:{" "}
          {trail.difficulty}
        </p>
      )}

      {trail.rating && (
        <p>
          ⭐ Rating: {trail.rating}
        </p>
      )}

      {trail.start_point && (
        <p>
          🚩 Partenza:{" "}
          {trail.start_point}
        </p>
      )}

      {trail.description && (
        <>
          <h3>Descrizione</h3>
          <p>{trail.description}</p>
        </>
      )}

      <button
        onClick={() =>
          onToggleFavorite

          (trail.id)
                  }
                >
                  {isFavorite
                    ? "★ Preferito"
                    : "☆ Salva"}
                </button>

                {showMap && (
                  <>
                    <h3>🗺️ Mappa</h3>

                    <div
                      style={{
                        height: "450px",
                        marginTop: "20px",
                      }}
                    >
                      <MapContainer
                        center={[
                          latitude,
                          longitude,
                        ]}
                        zoom={13}
                        style={{
                          height: "100%",
                          width: "100%",
                        }}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {trail.route_geojson && (
                          <GeoJSON
                            data={trail.route_geojson}
                            style={{
                              color: "#2563eb",
                              weight: 4,
                            }}
                          />
                        )}

                        <Marker
                          position={[
                            latitude,
                            longitude,
                          ]}
                        >
                          <Popup>
                            {trail.name}
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </>
                )}
              </div>
            );
          }
