import { useLocation } from "wouter";
import type { Trail } from "@/data/trails";

type TrailCardProps = {
  trail: Trail;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  unit: "km" | "mi";
};

export function distanceLabel(
  distanceKm: number | null | undefined,
  unit: "km" | "mi"
) {
  if (distanceKm == null) {
    return "N/D";
  }

  return unit === "km"
    ? `${distanceKm.toFixed(1)} km`
    : `${(distanceKm * 0.621371).toFixed(1)} mi`;
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
export function TrailCard({
  trail,
  isFavorite,
  onToggleFavorite,
  unit,
}: TrailCardProps) {
  const [, navigate] = useLocation();

  const distance = distanceLabel(
    trail.distanceKm,
    unit
  );

  const image =
    trail.image_url || trail.image;

  return (
    <div
      onClick={() =>
        navigate(`/trails/${trail.id}`)
      }
      style={{
        border: "1px solid #d9d9d9",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "16px",
        backgroundColor: "#ffffff",
        cursor: "pointer",
      }}
    >
      <h3>{trail.name}</h3>

      <p>
        📍 {trail.province || trail.region}
      </p>

      <p>📏 {distance}</p>

      <p>
        ⛰️{" "}
        {trail.elevationM != null
          ? `${trail.elevationM} m D+`
          : "N/D"}
      </p>

      <p>
        ⏱️ {trail.duration || "N/D"}
      </p>

      <p>
        🥾 {getDifficultyLabel(trail.difficulty)}
      </p>

      <p>
        ⭐{" "}
        {trail.rating != null
          ? trail.rating
          : "N/D"}
      </p>

      <button
        onClick={(event) => {
          event.stopPropagation();
          onToggleFavorite(trail.id);
        }}
      >
        {isFavorite
          ? "★ Preferito"
          : "☆ Salva"}
      </button>
    </div>
  );
}