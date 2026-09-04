import { supabase } from "@/lib/supabase";

function sleep(ms: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

async function runOverpass(osmId: number) {
  const query = `
[out:json][timeout:60];
relation(${osmId});
(._;>;);
out body;
`;

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
    await sleep(10000);
    return runOverpass(osmId);
  }

  if (!response.ok) {
    throw new Error(
      `Overpass ${response.status}`
    );
  }

  return response.json();
}

export async function getOrCreateGeometry(
  trailId: string
) {
  const { data: trail, error } =
    await supabase
      .from("trails")
      .select("*")
      .eq("id", trailId)
      .single();

  if (error || !trail) {
    throw error;
  }

  if (trail.route_geojson) {
    return trail.route_geojson;
  }

  if (!trail.osm_id) {
    return null;
  }

  const data = await runOverpass(
    trail.osm_id
  );

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

  const nodeMap = new Map();

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

  const geojson = {
    type: "MultiLineString",
    coordinates: lines,
  };

  await supabase
    .from("trails")
    .update({
      route_geojson: geojson,
    })
    .eq("id", trailId);

  return geojson;
}
