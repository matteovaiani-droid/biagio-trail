/// <reference types="node" />

import { readFileSync } from "node:fs";
import { XMLParser } from "fast-xml-parser";
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
);

async function main() {
  const xml = readFileSync(
    "route-2061210.osm",
    "utf8",
  );

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });

  const data = parser.parse(xml);

  const relation = Array.isArray(data.osm.relation)
    ? data.osm.relation[0]
    : data.osm.relation;

  const nodes = Array.isArray(data.osm.node)
    ? data.osm.node
    : [data.osm.node];

  const ways = Array.isArray(data.osm.way)
    ? data.osm.way
    : [data.osm.way];

  console.log("nodes:", nodes.length);
  console.log("ways:", ways.length);

  // node.id -> [lon, lat]
  const nodeMap = new Map<
    string,
    [number, number]
  >();

  for (const node of nodes) {
    nodeMap.set(
      String(node.id),
      [
        Number(node.lon),
        Number(node.lat),
      ],
    );
  }

  console.log("nodeMap:", nodeMap.size);

  // way.id -> lista node ref
  const wayMap = new Map<
    string,
    string[]
  >();

  for (const way of ways) {
    const refs = Array.isArray(way.nd)
      ? way.nd.map(
          (n: any) => String(n.ref),
        )
      : [];

    wayMap.set(
      String(way.id),
      refs,
    );
  }

  console.log("wayMap:", wayMap.size);

  const coordinates: [number, number][] = [];

  const members = Array.isArray(relation.member)
    ? relation.member
    : [relation.member];

  for (const member of members) {
    if (member.type !== "way") {
      continue;
    }

    const refs = wayMap.get(
      String(member.ref),
    );

    if (!refs) {
      continue;
    }

    for (const nodeRef of refs) {
      const point = nodeMap.get(nodeRef);

      if (point) {
        coordinates.push(point);
      }
    }
  }

  console.log(
    "Coordinate relation:",
    coordinates.length,
  );

  console.log(
    JSON.stringify(
      coordinates.slice(0, 20),
      null,
      2,
    ),
  );

  const geojson = {
    type: "LineString",
    coordinates,
  };

  const { error } = await supabase
    .from("trails")
    .update({
      route_geojson: geojson,
    })
    .eq("osm_id", "2061210");

  if (error) {
    throw error;
  }

    console.log(
    "✅ route_geojson salvato su Supabase",
  );
}

main().catch(console.error);