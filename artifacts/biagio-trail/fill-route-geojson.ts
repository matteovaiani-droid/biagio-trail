import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";

const env = readFileSync(".env", "utf8");

const url =
  env.match(/VITE_SUPABASE_URL=(.+)/)?.[1]?.trim();

const key =
  env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();

if (!url || !key) {
  throw new Error(
    "Variabili Supabase non trovate nel file .env"
  );
}

const supabase = createClient(url, key);

function runOverpass(query: string) {
  const result = execSync(
    `curl -s -X POST https://overpass-api.de/api/interpreter --data '${query}'`,
    {
      encoding: "utf8",
      maxBuffer: 100 * 1024 * 1024,
    }
  );

  return JSON.parse(result);
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const { data: trails, error } =
    await supabase
      .from("trails")
      .select("id,name,osm_id")
      .eq("source", "openstreetmap")
      .is("route_geojson", null);

  if (error) throw error;

  console.log(
    `Sentieri da aggiornare: ${trails?.length ?? 0}`
  );

  let updated = 0;

  for (const trail of trails ?? []) {
    try {
      console.log(
        `➡️ ${trail.name} (${trail.osm_id})`
      );

      const query = `
[out:json][timeout:120];
relation(${trail.osm_id});
(._;>;);
out body;
`;

      const data = runOverpass(query);

      const nodes = data.elements.filter(
        (e: any) => e.type === "node"
      );

      const ways = data.elements.filter(
        (e: any) => e.type === "way"
      );

      const nodeMap = new Map();

      for (const node of nodes) {
        nodeMap.set(node.id, [
          node.lon,
          node.lat,
        ]);
      }

      const coordinates: number[][] = [];

      for (const way of ways) {
        for (const ref of way.nodes ?? []) {
          const point = nodeMap.get(ref);

          if (point) {
            coordinates.push(point);
          }
        }
      }

      if (!coordinates.length) {
        console.log("⚠️ Nessuna geometria");
        continue;
      }

      const geojson = {
        type: "LineString",
        coordinates,
      };

      const { error: updateError } =
        await supabase
          .from("trails")
          .update({
            route_geojson: geojson,
          })
          .eq("id", trail.id);

      if (updateError) {
        console.error(updateError);
        continue;
      }

      updated++;

      console.log(
        `✅ Aggiornato ${updated}`
      );

      await sleep(1500);
    } catch (err) {
      console.error(
        `❌ Errore ${trail.osm_id}`,
        err
      );

      await sleep(5000);
    }
  }

  console.log(
    `🎉 Completato. Aggiornati ${updated} sentieri`
  );
}

main().catch(console.error);
