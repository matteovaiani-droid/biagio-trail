import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = readFileSync(".env", "utf8");

const url =
  env.match(/VITE_SUPABASE_URL=(.+)/)?.[1]?.trim();

const key =
  env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();

if (!url || !key) {
  throw new Error("Variabili Supabase mancanti");
}

const supabase = createClient(url, key);

function sleep(ms: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

async function findNearestParking(
  lat: number,
  lon: number
) {
  const radii = [500, 1000, 2000];

  for (const radius of radii) {
  const query = `
  [out:json][timeout:25];
  (
  node["amenity"="parking"](around:${radius},${lat},${lon});
  {lat},${lon};
  );
  out center;
  `;

    

    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body: `data=${encodeURIComponent(query)}`,
      }
    );

    console.log(
      "OVERPASS STATUS:",
      response.status
    );
    

    if (!response.ok) {
      throw new Error(
        `Overpass ${response.status}`
      );
    }

    const data = await response.json();

    const elements = data.elements ?? [];

    if (elements.length === 0) {
      continue;
    }

    const nearest = elements
      .map((e: any) => {
        const plat =
          e.lat ?? e.center?.lat;

        const plon =
          e.lon ?? e.center?.lon;

        const distance =
          Math.pow(plat - lat, 2) +
          Math.pow(plon - lon, 2);

        return {
          name:
            e.tags?.name ??
            "Parcheggio senza nome",
          lat: plat,
          lon: plon,
          distance,
        };
      })
      .sort(
        (a: any, b: any) =>
          a.distance - b.distance
      )[0];

    return nearest;
  }

  return null;
}

async function main() {
  const { data: trails, error } =
    await supabase
      .from("trails")
      .select(
        `
        id,
        name,
        endpoint_a_lat,
        endpoint_a_lon
      `
      )
      .not("endpoint_a_lat", "is", null)
      .is("parking_a_lat", null)
      .limit(10);

  if (error) {
    throw error;
  }

  console.log(
    `Sentieri da processare: ${
      trails?.length ?? 0
    }`
  );

  for (const trail of trails ?? []) {
    try {
      console.log(
        `PROCESSING: ${trail.name}`
      );

      const parking =
        await findNearestParking(
          Number(trail.endpoint_a_lat),
          Number(trail.endpoint_a_lon)
        );

      if (!parking) {
        console.log(
          "NESSUN PARCHEGGIO TROVATO"
        );
        continue;
      }

      console.log(
        `PARKING TROVATO: ${parking.name}`
      );

        const { error: updateError } =
          await supabase
            .from("trails")
            .update({
              parking_a_name: parking.name,
              parking_a_lat: parking.lat,
              parking_a_lon: parking.lon,
            })
            .eq("id", trail.id);
      
      if (updateError) {
          throw updateError;
        }
      console.log("SALVATO");

      await sleep(1000);
    
    } catch (err) {
        console.error(
          `ERRORE SU ${trail.name}`,
          err
        );
        }

      }
    }

main().catch(console.error);
