import type { Trail } from "@/data/trails";

type TrailCardProps = {
  trail: Trail;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  unit: "km" | "mi";
};

export function distanceLabel(
  distanceKm: number,
  unit: "km" | "mi"
) {
  return unit === "km"
    ? `${distanceKm.toFixed(1)} km`
    : `${(distanceKm * 0.621371).toFixed(1)} mi`;
}

export function TrailCard({
  trail,
  isFavorite,
  onToggleFavorite,
  unit,
}: TrailCardProps) {
  const distance = distanceLabel(
    trail.distanceKm,
    unit
  );

  return (
    <div
      style={{
        border: "1px solid #d9d9d9",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "16px",
        backgroundColor: "#ffffff",
      }}
    >
      <h3>{trail.name}</h3>

      <p>
        {trail.region} - {trail.province}
      </p>

      <p>📏 {distance}</p>

      <p>⛰️ {trail.elevationM} m</p>

      <p>⏱️ {trail.duration}</p>

      <p>⭐ {trail.rating}</p>

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