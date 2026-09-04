import { readFileSync } from "node:fs";
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

function sleep(ms: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

async function runOverpass(query: string) {
  const response = await fetch(
    "https://overpass.kumi.systems/api/interpreter",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body:
        "data=" +
        encodeURIComponent(query),
    }
  );

  if (response.status === 429) {
    console.log(
      "⚠️ Rate limit Overpass, attendo..."
    );

    await sleep(60000);

    return runOverpass(query);
  }
  
  if (!response.ok) {
    throw new Error(
      `Overpass ${response.status}`
    );
  }

  return await response.json();
}

async function main() {
  const { data: trails, error } =
    await supabase
      .from("trails")
      .select("id,name,osm_id")
      .eq("source", "osm")
      .is("route_geojson", null)
      .limit(20);

  if (error) {
    throw error;
  }

  console.log(
    `Da processare: ${trails?.length ?? 0}`
  );

  let updated = 0;

  for (const trail of trails ?? []) {
    try {
      console.log(
        `➡️ ${trail.name} (${trail.osm_id})`
      );

      const query = `
[out:json][timeout:60];
relation(${trail.osm_id});
(._;>;);
out body;
`;

      const data =
        await runOverpass(query);

      const nodes =
        data.elements.filter(
          (e: any) =>
            e.type === "node"
        );

      const ways =
        data.elements.filter(
          (e: any) =>
            e.type === "way"
        );

      const nodeMap = new Map<
        number,
        number[]
      >();

      for (const node of nodes) {
        nodeMap.set(node.id, [
          node.lon,
          node.lat,
        ]);
      }

      const lines: number[][][] = [];

      for (const way of ways) {
        const line: number[][] = [];

        for (const ref of way.nodes ?? []) {
          const point =
            nodeMap.get(ref);

          if (point) {
            line.push(point);
          }
        }

        if (line.length > 1) {
          lines.push(line);
        }
      }

      if (!lines.length) {
        console.log(
          "⚠️ Nessuna geometria"
        );
        continue;
      }

      const firstPoint =
        lines[0]?.[0];

      if (!firstPoint) {
        console.log(
          "⚠️ Punto iniziale mancante"
        );
        continue;
      }

      const geojson = {
        type: "MultiLineString",
        coordinates: lines,
      };

      const {
        error: updateError,
      } = await supabase
        .from("trails")
        .update({
          route_geojson: geojson,
          latitude: firstPoint[1],
          longitude: firstPoint[0],
        })
        .eq("id", trail.id);

      if (updateError) {
        console.error(
          updateError
        );
        continue;
      }

      updated++;

      console.log(
        `✅ Aggiornato ${updated}`
      );

      await sleep(5000);

    } catch (err) {
      console.error(
        `❌ Errore ${trail.osm_id}`
      );

      console.error(err);

      await sleep(5000);
    }
  }

  console.log(
    `🎉 Completato. Aggiornati ${updated} sentieri`
  );
}

main().catch(console.error);