/// <reference types="node" />

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

const REGIONS: Record<string, string> = {
  Lombardia: "22477",
  Piemonte: "43648",
  Veneto: "43647",
  Liguria: "43649",
  "Trentino-Alto Adige": "22495",
  "Emilia-Romagna": "44874",
};

const REGION_PARTS = {

  Piemonte: {
  nw_nw: [45.875, 6.6, 46.5, 7.325],
  nw_ne: [45.875, 7.325, 46.5, 8.05],

  nw_sw: [45.25, 6.6, 45.875, 7.325],
  nw_se: [45.25, 7.325, 45.875, 8.05],

  ne: [45.25, 8.05, 46.5, 9.5],

  sw: [44.0, 6.6, 45.25, 8.05],
  se: [44.0, 8.05, 45.25, 9.5],
},
  
  Liguria: {
    ovest: [43.7, 7.4, 44.7, 8.8],
    est: [43.7, 8.8, 44.8, 10.1],
  },

  Veneto: {
    ovest: [44.7, 10.7, 46.8, 12.0],

    nw_w: [46.35, 10.3, 47.1, 10.875],
    nw_e: [46.35, 10.875, 47.1],
    est_nw_ne: [46.275, 12.3,46.8, 12.6, ],
    est_nw_sw: [45.75, 12.0,46.275,12.3,],
    se_w: [45.6, 11.45, 46.35, 12.025],
    se_e: [45.6, 12.025, 46.35, 12.6],
    
    est_ne: [45.75, 12.6, 46.8, 13.2],

    est_sw: [44.7, 12.0, 45.75, 12.6],
    est_se: [44.7, 12.6, 45.75, 13.2],
  },

  "Trentino-Alto Adige": {
    nw: [46.35, 10.3, 47.1, 11.45],
    ne: [46.35, 11.45, 47.1, 12.6],

    sw: [45.6, 10.3, 46.35, 11.45],
    se: [45.6, 11.45, 46.35, 12.6],
  },
};

function buildQuery(areaId: string) {
  const overpassArea =
    3600000000 + Number(areaId);

  return `
[out:json][timeout:60];

area(${overpassArea})->.searchArea;

relation
  ["route"="hiking"]
  ["name"]
  (area.searchArea);

out ids tags;
`;
}

async function runOverpass(
  query: string
) {
  console.log(
    "Invio richiesta Overpass..."
  );

  const response = await fetch(
    "https://overpass.kumi.systems/api/interpreter",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
        Accept: "application/json",
        "User-Agent":
          "BiagioTrail/1.0",
      },
      body:
        "data=" +
        encodeURIComponent(query),
    }
  );

  console.log(
    "Risposta ricevuta:",
    response.status
  );

  if (!response.ok) {
    const text =
      await response.text();

    console.error(text);

    throw new Error(
      `Overpass ${response.status}`
    );
  }

  console.log("Parsing JSON...");

  return await response.json();
}

async function main() {
  const region = process.argv[2];
  const part = process.argv[3];

  if (!region) {
    throw new Error(
      "Specificare una regione"
    );
  }

  console.log(
    `Import regione: ${region}`
  );

  const areaId = REGIONS[region];

  if (!areaId) {
    throw new Error(
      `Regione non supportata: ${region}`
    );
  }

  console.log(
    `Area OSM: ${
      3600000000 + Number(areaId)
    }`
  );

  let query: string;

  if (
  part &&
  REGION_PARTS[
    region as keyof typeof REGION_PARTS
  ] &&
  REGION_PARTS[
    region as keyof typeof REGION_PARTS
  ][
    part as keyof (typeof REGION_PARTS)[keyof typeof REGION_PARTS]
  ]
) {
  const bbox =
    REGION_PARTS[
      region as keyof typeof REGION_PARTS
    ][
      part as keyof (typeof REGION_PARTS)[keyof typeof REGION_PARTS]
    ];

  console.log(
    `Import ${region} (${part})`
  );

  query = buildBBoxQuery(
    bbox[0],
    bbox[1],
    bbox[2],
    bbox[3]
  );
} else {
  query = buildQuery(areaId);
}

  console.log(query);

  const data =
    await runOverpass(query);

  console.log(
    "Elementi trovati:",
    data.elements?.length ?? 0
  );

  const rows =
    (data.elements ?? [])
      .filter(
        (e: any) => e.tags?.name
      )
      .map((e: any) => ({
        osm_id: String(e.id),
        ref:
          e.tags?.ref ?? null,
        name: e.tags?.name
          ?.trim()
          .replace(/\s+/g, " "),
        region,
      }));

  console.log(
    "Righe da salvare:",
    rows.length
  );

  const BATCH_SIZE = 500;

  for (
    let i = 0;
    i < rows.length;
    i += BATCH_SIZE
  ) {
    const batch = rows.slice(
      i,
      i + BATCH_SIZE
    );

    const { error } =
      await supabase
        .from("trail_candidates")
        .upsert(batch, {
          onConflict: "osm_id",
        });

    if (error) {
      throw error;
    }

    console.log(
      `Importati ${
        i + batch.length
      }/${rows.length}`
    );
  }

  console.log(
    "Import completato."
  );
}

function buildBBoxQuery(
  south: number,
  west: number,
  north: number,
  east: number
) {
  return `
[out:json][timeout:60];

relation
  ["route"="hiking"]
  ["name"]
  (${south},${west},${north},${east});

out ids tags;
`;
}

main().catch(console.error);