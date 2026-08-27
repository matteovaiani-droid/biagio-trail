/// <reference types="node" />

import "dotenv/config";
import { execSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
);

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

function runOverpass(query: string) {
  const result = execSync(
    `curl -s -X POST https://overpass-api.de/api/interpreter --data '${query}'`,
    {
      encoding: "utf8",
      maxBuffer: 50 * 1024 * 1024,
    }
  );

  return JSON.parse(result);
  
  }

async function main() {
  console.log("🚀 Avvio sincronizzazione Lombardia...");

  const query = `
[out:json][timeout:120];

area["name"="Lombardia"]->.searchArea;

(
  relation["route"="hiking"](area.searchArea);
);

out tags center;
`;

  const data = runOverpass(query);

  console.log(
    `📍 Elementi ricevuti: ${data.elements.length}`,
  );

  const trails = data.elements
    .filter(
      (item: any) =>
        item.tags?.name &&
        item.id,
    )
    .map((item: any) => ({
      id: `osm-${item.id}`,

      osm_id: String(item.id),

      source: "openstreetmap",

      name: item.tags.name,

      description:
        item.tags.description ??
        `${item.tags.name} è un percorso escursionistico della Lombardia.`,

      region: "Lombardia",

      province: "N/D",

      latitude:
        item.center?.lat ??
        null,

      longitude:
        item.center?.lon ??
        null,

      coordinates:
        item.center
          ? `${item.center.lat},${item.center.lon}`
          : null,

      distance_km: null,

      elevation_m: null,

      duration: null,

      difficulty: "Moderate",

      start_point: null,

      weather: "N/D",

      rating: 0,

      review_count: 0,

      website:
        item.tags.website ??
        null,

      loop_route: false,

      family_friendly: false,

      dog_friendly: false,

      best_season: null,

      altitude_min: null,

      altitude_max: null,

      gpx_url: null,

      image_url: null,

      imported_at: new Date()
        .toISOString(),
    }));

  console.log(
    `✅ Record validi: ${trails.length}`,
  );

  const { error } = await supabase
    .from("trails")
    .upsert(trails, {
      onConflict: "osm_id",
    });

  if (error) {
    console.error(
      "❌ Errore Supabase:",
      error,
    );
    process.exit(1);
  }

  console.log(
    `🎉 Sincronizzati ${trails.length} sentieri`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});