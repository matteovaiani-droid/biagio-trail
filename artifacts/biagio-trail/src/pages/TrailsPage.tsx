import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { TrailCard } from "@/components/TrailCard";
import { getTrails } from "@/services/trailsService";
import { type Difficulty } from "@/data/trails";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "wouter";
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

type TrailsPageProps = {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  unit: "km" | "mi";
};

const filters = [
  "All",
  "T",
  "E",
  "EE",
  "EEA",
] as const;

const filterLabels = {
  All: "Tutti",
  T: "Facile (T)",
  E: "Moderato (E)",
  EE: "Impegnativo (EE)",
  EEA: "Molto impegnativo (EEA)",
};


function FitBounds({ trails }: { trails: any[] }) {
  const map = useMap();

  useEffect(() => {
    const points = trails
      .filter((trail) => trail.latitude && trail.longitude)
      .map((trail) => [Number(trail.latitude), Number(trail.longitude)]);

    if (points.length === 0) {
      return;
    }

    const bounds = L.latLngBounds(points as any);

    map.fitBounds(bounds, {
      padding: [50, 50],
    });
  }, [map, trails]);

  
  return null;

  
}
const greenIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconRetinaUrl: markerIcon2x,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
const yellowIcon = new L.Icon({
  iconUrl:
  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
  shadowUrl: markerShadow,
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
const orangeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl: markerShadow,
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: markerShadow,
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
function getMarkerIcon(difficulty?: string) {
  switch (difficulty) {
    case "T":
      return greenIcon;

    case "E":
      return yellowIcon;

    case "EE":
      return orangeIcon;

    case "EEA":
      return redIcon;

    default:
      return greenIcon;
  }
}

function getDifficultyLabel(difficulty?: string) {
  switch (difficulty) {
    case "T":
      return "Facile (T)";
    case "E":
      return "Moderato (E)";
    case "EE":
      return "Impegnativo (EE)";
    case "EEA":
      return "Molto impegnativo (EEA)";
    default:
      return difficulty ?? "N/D";
  }
}

export function TrailsPage({
  favorites,
  onToggleFavorite,
  unit,
}: TrailsPageProps) {
  const [search, setSearch] = useState("");

  const [difficulty, setDifficulty] = useState<
    "All" | "T" | "E" | "EE" | "EEA"
  >("All");

  const [selectedTrail, setSelectedTrail] = useState<any | null>(null);

  const [trails, setTrails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrails()
      .then((data: any) => {
        const mapped = (data ?? []).map((trail: any) => ({
          ...trail,
          distanceKm: trail.distance_km,
          elevationM: trail.elevation_m,
          reviewCount: trail.review_count,
          startPoint: trail.start_point,
        }));

        setTrails(mapped);
      })
      .catch((error: any) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return trails.filter((trail) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        `${trail.name} ${trail.region} ${trail.province}`
          .toLowerCase()
          .includes(query);

      return (
        matchesSearch &&
        (difficulty === "All" || trail.difficulty === difficulty)
      );
    });
  }, [trails, search, difficulty]);

  if (loading) {
    return <p>Caricamento sentieri...</p>;
  }

  return (
    <div>
      <h1
        style={{
          fontSize: "32px",
          marginBottom: "8px",
        }}
      >
        🏔️ Esplora i Sentieri d'Italia
      </h1>

      <p
        style={{
          color: "#64748b",
          marginBottom: "24px",
        }}
      >
        Trova il percorso perfetto per la tua prossima avventura tra montagne,
        laghi, boschi e panorami spettacolari.
      </p>

      <h2>🗺️ Mappa dei Sentieri</h2>
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "12px 16px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            minWidth: "140px",
          }}
        >
          <div
            style={{
              fontSize: "24px",
            }}
          >
            🏔️
          </div>

          <div
            style={{
              fontWeight: 700,
              fontSize: "22px",
            }}
          >
            {trails.length}
          </div>

          <div
            style={{
              color: "#64748b",
            }}
          >
            Sentieri
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: "12px 16px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            minWidth: "140px",
          }}
        >
          <div
            style={{
              fontSize: "24px",
            }}
          >
            📍
          </div>

          <div
            style={{
              fontWeight: 700,
              fontSize: "22px",
            }}
          >
            {new Set(trails.map((trail) => trail.province)).size}
          </div>

          <div
            style={{
              color: "#64748b",
            }}
          >
            Province
          </div>
        </div>
      </div>

      <div
  style={{
    display: "flex",
    gap: "12px",
    marginBottom: "12px",
    flexWrap: "wrap",
  }}
>
  <span
    style={{
      background: "#dcfce7",
      padding: "6px 12px",
      borderRadius: "999px",
    }}
  >
    🟢 Facile (T)
  </span>

  <span
    style={{
      background: "#fef3c7",
      padding: "6px 12px",
      borderRadius: "999px",
    }}
  >
    🟡 Moderato (E)
  </span>

  <span
    style={{
      background: "#fed7aa",
      padding: "6px 12px",
      borderRadius: "999px",
    }}
  >
    🟠 Impegnativo (EE)
  </span>

  <span
    style={{
      background: "#fecaca",
      padding: "6px 12px",
      borderRadius: "999px",
    }}
  >
    🔴 Molto impegnativo (EEA)
  </span>
</div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "white",
          padding: "12px 16px",
          borderRadius: "12px",
          marginBottom: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          maxWidth: "500px",
        }}
      >
        <Search size={18} color="#64748b" />

        <input
          type="search"
          value={search}
          placeholder="Cerca un sentiero..."
          onChange={(event) => setSearch(event.target.value)}
          style={{
            border: "none",
            outline: "none",
            width: "100%",
            fontSize: "16px",
            background: "transparent",
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setDifficulty(filter)}
            style={{
              marginRight: "8px",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              cursor: "pointer",
              backgroundColor: difficulty === filter ? "#2563eb" : "white",
              color: difficulty === filter ? "white" : "black",
            }}
          >
            {filterLabels[filter]}
          </button>
        ))}
      </div>

      <div
        style={{
          height: "500px",
          marginBottom: "24px",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <MapContainer
          center={[42.5, 12.5]}
          zoom={6}
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <FitBounds trails={filtered} />

          {filtered.map((trail) => {
            if (!trail.latitude || !trail.longitude) {
              return null;
            }

            return (
              <Marker
                key={trail.id}
                position={[Number(trail.latitude), Number(trail.longitude)]}
                icon={getMarkerIcon(trail.difficulty)}
              >
                <Popup>
                  <div
                    style={{
                      minWidth: "220px",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: "16px",
                      }}
                    >
                      {trail.name}
                    </h3>

                    <p style={{ margin: "4px 0" }}>📍 {trail.province}</p>

                    <p style={{ margin: "4px 0" }}>🥾 {getDifficultyLabel(trail.difficulty)}</p>

                    <p style={{ margin: "4px 0" }}>📏 {trail.distanceKm} km</p>

                    <p style={{ margin: "4px 0" }}>⛰️ {trail.elevationM} m</p>

                    {trail.rating && (
                      <p style={{ margin: "4px 0" }}>⭐ {trail.rating}</p>
                    )}

                    <div
                      style={{
                        marginTop: "10px",
                      }}
                    >
                      <Link to={`/trails/${trail.id}`}>
                        Apri scheda sentiero →
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
      <p>{filtered.length} sentieri trovati</p>

      {filtered.map((trail) => (
        <TrailCard
          key={trail.id}
          trail={trail}
          isFavorite={favorites.includes(trail.id)}
          onToggleFavorite={onToggleFavorite}
          unit={unit}
        />
      ))}
    </div>
  );
}
