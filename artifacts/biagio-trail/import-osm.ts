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
  const { data, error } =
    await supabase
      .from("trail_import_queue")
      .select("*")
      .eq("imported", false);

  if (error) throw error;

console.log(
  "Da importare:",
  data?.length ?? 0
);

for (const row of data ?? []) {
  console.log(
    "OSM:",
    row.osm_id,
    "Regione:",
    row.region
  );

  const { data: existing } =
    await supabase
      .from("trails")
      .select("id")
      .eq("osm_id", row.osm_id)
      .maybeSingle();

  if (existing) {
    console.log(
      "Gia presente:",
      row.osm_id
    );
  } else {
    console.log(
      "Da importare:",
      row.osm_id
    );
  }
}

}

main().catch(console.error);