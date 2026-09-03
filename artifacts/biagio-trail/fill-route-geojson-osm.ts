import { readFileSync } from "node:fs";
import { XMLParser } from "/home/runner/workspace/node_modules/.pnpm/fast-xml-parser@5.11.1/node_modules/fast-xml-parser/src/fxp.js";
import { createClient } from "@supabase/supabase-js";

const env = readFileSync(".env", "utf8");

const url =
  env.match(/VITE_SUPABASE_URL=(.+)/)?.[1]?.trim();

const key =
  env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();

if (!url || !key) {
  throw new Error(
    "Variabili Supabase mancanti nel file .env"
  );
}

const supabase = createClient(url, key);

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
});

async function sleep(ms: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

async function downloadRelation(
  osmId: string
) {
  const response = await fetch(
    `https://www.openstreetmap.org/api/0.6/relation/${osmId}/full`,
    {
      headers: {
        "User-Agent":
          "BiagioTrail/1.0",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `OSM ${response.status}`
    );
  }

  return await response.text();
}

function buildGeoJson(xml: string) {
  const doc = parser.parse(xml);

  const osm = doc.osm;

  const nodes = Array.isArray(osm.node)
    ? osm.node
    : [osm.node];

  const ways = Array.isArray(osm.way)
    ? osm.way
    : [osm.way];

  const relations = Array.isArray(
    osm.relation
  )
    ? osm.relation
    : [osm.relation];

  const relation = relations[0];

  const nodeMap = new Map<
    string,
    number[]
  >();

  for (const node of nodes) {
    nodeMap.set(node.id.toString(), [
      Number(node.lon),
      Number(node.lat),
    ]);
  }

  const wayMap = new Map<
    string,
    string[]
  >();

for (const way of ways) {
  if (!way) continue;

  const nds = Array.isArray(way.nd)
    ? way.nd
    : way?.nd
    ? [way.nd]
    : [];

  wayMap.set(
    way.id?.toString() ?? "",
    nds.map((n: any) =>
      n.ref.toString()
    )
  );
 }
  
  const members = Array.isArray(
    relation.member
  )
    ? relation.member
    : [relation.member];

  const lines: number[][][] = [];

  for (const member of members) {
    if (member.type !== "way")
      continue;
    
    console.log(
      member.type,
      member.ref
    );
    
    if (!wayMap.has(member.ref.toString())) {
      console.log(
        "⚠️ Way mancante:",
        member.ref
      );
    }
    
    const refs =
      wayMap.get(
        member.ref.toString()
      ) || [];

    const line: number[][] = [];

    for (const ref of refs) {
      const point = nodeMap.get(ref);

      if (point) {
        line.push(point);
      }
    }

    if (line.length > 1) {
      lines.push(line);
    }
  }

  console.log(
    "Ways nella relation:",
    members.length
  );

  console.log(
    "Linee generate:",
    lines.length
  );
  
  return {
    type: "Feature",
    geometry: {
      type: "MultiLineString",
      coordinates: lines,
    },
    properties: {},
  };
}

async function main() {
  const { data: trails, error } =
    await supabase
      .from("trails")
      .select("id,name,osm_id")
  .eq("osm_id", "2178915")

  if (error) throw error;

  console.log(
    `Da processare: ${
      trails?.length ?? 0
    }`
  );

  for (const trail of trails ?? []) {
    try {
      console.log(
        `➡️ ${trail.name} (${trail.osm_id})`
      );

      const xml =
        await downloadRelation(
          trail.osm_id
        );

      const geojson =
        buildGeoJson(xml);

      const {
        error: updateError,
      } = await supabase
        .from("trails")
        .update({
          route_geojson: geojson,
        })
        .eq("id", trail.id);

      if (updateError)
        throw updateError;

      console.log(
        "✅ Aggiornato"
      );
    } catch (err) {
      console.error(
        "❌ Errore",
        trail.osm_id,
        err
      );
    }

    await sleep(5000);
  }
}

main().catch(console.error);
