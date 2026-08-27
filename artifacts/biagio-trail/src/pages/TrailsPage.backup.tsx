import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { TrailCard } from "@/components/TrailCard";
import { trails, type Difficulty } from "@/data/trails";

type TrailsPageProps = {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  unit: "km" | "mi";
};

const filters: Array<"All" | Difficulty> = [
  "All",
  "Easy",
  "Moderate",
  "Demanding",
];

const filterLabels: Record<"All" | Difficulty, string> = {
  All: "Tutti",
  Easy: "Facili",
  Moderate: "Moderati",
  Demanding: "Impegnativi",
};

export function TrailsPage({
  favorites,
  onToggleFavorite,
  unit,
}: TrailsPageProps) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] =
    useState<"All" | Difficulty>("All");

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
        (difficulty === "All" ||
          trail.difficulty === difficulty)
      );
    });
  }, [search, difficulty]);

  return (
    <div>
      <h1>Sentieri</h1>

      <div style={{ marginBottom: "16px" }}>
        <Search size={16} />

        <input
          type="search"
          value={search}
          placeholder="Cerca sentiero..."
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() =>
              setDifficulty(filter)
            }
            style={{
              marginRight: "8px",
            }}
          >
            {filterLabels[filter]}
          </button>
        ))}
      </div>

      <p>{filtered.length} sentieri trovati</p>

      {filtered.map((trail) => (
        <TrailCard
          key={trail.id}
          trail={trail}
          isFavorite={favorites.includes(
            trail.id
          )}
          onToggleFavorite={onToggleFavorite}
          unit={unit}
        />
      ))}
    </div>
  );
}