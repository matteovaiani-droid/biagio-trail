import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = readFileSync(".env", "utf8");

const url =
  env.match(/VITE_SUPABASE_URL=(.+)/)?.[1]?.trim();

const key =
  env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();

if (!url || !key) {
  throw new Error(
    "Variabili Supabase mancanti"
  );
}

const supabase = createClient(url, key);

async function main() {
  const { data: trails, error } =
    await supabase
      .from("trails")
      .select(
        "id,name,latitude,longitude,route_geojson"
      )
      .is("endpoint_a_lat", null);

  if (error) throw error;

  console.log(
    "Da processare:",
    trails?.length ?? 0
  );

    for (const trail of trails ?? []) {
      
    const coordinates =
      trail.route_geojson?.geometry?.coordinates ?? [];

    if (!coordinates.length) {
      continue;
    }

    if (!Array.isArray(coordinates)) {
      console.log(
        "Coordinate non valide:",
        trail.name
      );
      continue;
    }
    
    console.log(
      "Sentiero:",
      trail.name
    );

    console.log(
      "Tipo geometria:",
      trail.route_geojson?.geometry?.type
    );

    console.log(
      "Coordinate presenti:",
      coordinates.length
    );

    console.log(
      JSON.stringify(
        coordinates,
        null,
        2
      ).slice(0, 1500)
      
    );
    
    const points = coordinates.flat();
    if (points.length === 0) {
      console.log(
        "⚠️ Nessun punto:",
        trail.name
      );
      continue;
    }

    if (!points.length) {
      continue;
    }
    
    let endpointA = points[0];
    let endpointB = points[0];
    let maxDistance = 0;

      if (
        !Array.isArray(endpointA) ||
        !Array.isArray(endpointB)
      ) {
        console.log(
          "Formato coordinate non valido:",
          trail.id
        );
        continue;
      }

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx =
          points[i][0] - points[j][0];

        const dy =
          points[i][1] - points[j][1];

        const distance =
          dx * dx + dy * dy;

        if (distance > maxDistance) {
          maxDistance = distance;
          endpointA = points[i];
          endpointB = points[j];
        }
      }
    }
    
    console.log("\n================");
    console.log(trail.name);
    console.log("Endpoint A:", endpointA);
    console.log("Endpoint B:", endpointB);
    console.log(
      "Centro:",
      [trail.longitude, trail.latitude]
    );

    console.log(
      "Salvataggio endpoint:",
      trail.id
    );

    console.log(
  "UPDATE:",
  trail.id,
  endpointA,
  endpointB
);
    
    const { error: updateError } =
      await supabase
        .from("trails")
        .update({
          endpoint_a_lat: endpointA[1],
          endpoint_a_lon: endpointA[0],
          endpoint_b_lat: endpointB[1],
          endpoint_b_lon: endpointB[0],
        })
        .eq("id", trail.id);
    
      if (updateError) {
        console.error(
          "Errore update:",
          trail.id,
          updateError
        );
        continue;
      }

    console.log(
      "✅ Endpoint salvati"
    );
  }
  
}
main().catch(console.error);