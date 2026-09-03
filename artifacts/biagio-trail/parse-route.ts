import { readFileSync, writeFileSync } from "node:fs";
import { XMLParser } from "/home/runner/workspace/node_modules/.pnpm/fast-xml-parser@5.11.1/node_modules/fast-xml-parser/src/fxp.js";

const xml = readFileSync("route-2061210.osm", "utf8");

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
});

const doc = parser.parse(xml);

const osm = doc.osm;

const nodes = Array.isArray(osm.node)
  ? osm.node
  : [osm.node];

const ways = Array.isArray(osm.way)
  ? osm.way
  : [osm.way];

const relations = Array.isArray(osm.relation)
  ? osm.relation
  : [osm.relation];

const relation = relations.find(
  (r: any) => r.id === "2061210" || r.id === 2061210
);

if (!relation) {
  throw new Error("Relation not found");
}

const nodeMap = new Map();

for (const node of nodes) {
  nodeMap.set(node.id.toString(), [
    Number(node.lon),
    Number(node.lat),
  ]);
}

const wayMap = new Map();

for (const way of ways) {
  const nds = Array.isArray(way.nd)
    ? way.nd
    : way.nd
    ? [way.nd]
    : [];

  wayMap.set(
    way.id.toString(),
    nds.map((n: any) => n.ref.toString())
  );
}

const members = Array.isArray(relation.member)
  ? relation.member
  : [relation.member];

const routeWays: string[][] = [];

for (const member of members) {
  if (member.type !== "way") continue;

  const refs =
    wayMap.get(member.ref.toString()) || [];

  if (refs.length > 1) {
    routeWays.push([...refs]);
  }
}

if (!routeWays.length) {
  throw new Error("Nessun way trovato");
}

const orderedWays: string[][] = [routeWays.shift()!];

while (routeWays.length) {
  const current = orderedWays[orderedWays.length - 1];

  const currentStart = current[0];
  const currentEnd = current[current.length - 1];

  let found = false;

  for (let i = 0; i < routeWays.length; i++) {
    const candidate = routeWays[i];

    const candidateStart = candidate[0];
    const candidateEnd =
      candidate[candidate.length - 1];

    if (currentEnd === candidateStart) {
      orderedWays.push(candidate);
      routeWays.splice(i, 1);
      found = true;
      break;
    }

    if (currentEnd === candidateEnd) {
      orderedWays.push([...candidate].reverse());
      routeWays.splice(i, 1);
      found = true;
      break;
    }

    if (currentStart === candidateEnd) {
      orderedWays.unshift(candidate);
      routeWays.splice(i, 1);
      found = true;
      break;
    }

    if (currentStart === candidateStart) {
      orderedWays.unshift(
        [...candidate].reverse()
      );
      routeWays.splice(i, 1);
      found = true;
      break;
    }
  }

  if (!found) {
    break;
  }
}

const lines: number[][][] = [];

for (const member of members) {
  if (member.type !== "way") continue;

  const refs =
    wayMap.get(member.ref.toString()) || [];

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

console.log("Linee:", lines.length);


  properties: {
    osm_id: "2061210",
    name: "Dorsale del Triangolo Lariano",
  },
};


writeFileSync(
  "route-2061210.geojson",
  JSON.stringify(geojson, null, 2)
);

console.log("GeoJSON scritto");
