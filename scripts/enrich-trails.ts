/// <reference types="node" />

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
);

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function estimateValues(altitude: number) {
  let distance_km;
  let elevation_m;

  if (altitude < 600) {
    distance_km = 7;
    elevation_m = 250;
  } else if (altitude < 1200) {
    distance_km = 12;
    elevation_m = 600;
  } else if (altitude < 1800) {
    distance_km = 16;
    elevation_m = 900;
  } else {
    distance_km = 22;
    elevation_m = 1300;
  }

  const altitude_min = Math.max(
    Math.round(altitude - elevation_m * 0.4),
    0,
  );

  const altitude_max = Math.round(
    altitude + elevation_m * 0.6,
  );

  const hours =
    distance_km / 4 +
    elevation_m / 300;

  const h = Math.floor(hours);

  const m = Math.round(
    (hours - h) * 60,
  );

  const duration = `${h}h ${m}m`;

  let difficulty = "E";

  if (
    distance_km < 8 &&
    elevation_m < 300
  ) {
    difficulty = "T";
  } else if (
    distance_km < 15 &&
    elevation_m < 700
  ) {
    difficulty = "E";
  } else if (
    distance_km < 25 &&
    elevation_m < 1200
  ) {
    difficulty = "EE";
  } else {
    difficulty = "EEA";
  }

  let best_season =
    "Tutto l'anno";

  if (altitude_max > 2000) {
    best_season = "Estate";
  } else if (
    altitude_max > 1200
  ) {
    best_season =
      "Primavera, Estate, Autunno";
  }

  return {
    distance_km,
    elevation_m,
    altitude_min,
    altitude_max,
    duration,
    difficulty,
    best_season,
    family_friendly:
      distance_km < 8 &&
      elevation_m < 300,
    dog_friendly: true,
    loop_route: false,
  };
}

async function getElevation(
  latitude: number,
  longitude: number,
) {
  try {
    const response =
      await fetch(
        `https://api.open-elevation.com/api/v1/lookup?locations=${latitude},${longitude}`,
      );

    if (!response.ok) {
      return null;
    }

    const data =
      await response.json();

    return (
      data.results?.[0]
        ?.elevation ?? null
    );
  } catch {
    return null;
  }
}

async function main() {
  const { data, error } =
    await supabase
      .from("trails")
      .select(
        "id,name,latitude,longitude",
      )
      .eq(
        "source",
        "openstreetmap",
      );

  if (error) {
    throw error;
  }

  console.log(
    `Sentieri trovati: ${data?.length}`,
  );

  let updated = 0;

  for (const trail of data ?? []) {
    try {
      console.log(
        `🚶 ${trail.name}`,
      );

      const altitude =
        await getElevation(
          Number(trail.latitude),
          Number(trail.longitude),
        );

      if (
        altitude === null
      ) {
        console.log(
          "⚠️ quota non disponibile",
        );

        continue;
      }

      const values =
        estimateValues(
          altitude,
        );

      const {
        error: updateError,
      } = await supabase
        .from("trails")
        .update(values)
        .eq(
          "id",
          trail.id,
        );

      if (updateError) {
        console.error(
          updateError,
        );
        continue;
      }

      updated++;

      console.log(
        `✅ aggiornato ${updated}`,
      );

      await sleep(1000);
    } catch (err) {
      console.error(
        `❌ ${trail.name}`,
        err,
      );
    }
  }

  console.log(
    `🎉 Aggiornati ${updated} sentieri`,
  );
}

main().catch(console.error);