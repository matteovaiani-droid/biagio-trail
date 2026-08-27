/// <reference types="node" />

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
);

function sleep(ms: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

async function main() {
  const { data: trails, error } =
    await supabase
      .from("trails")
      .select(
        "id, latitude, longitude, province"
      )
      .eq("source", "openstreetmap");

  if (error) {
    console.error(error);
    process.exit(1);
  }

  const missingProvince =
    trails.filter(
      (trail) =>
        !trail.province ||
        trail.province === "N/D"
    );

  console.log(
    `Da aggiornare: ${missingProvince.length}`
  );

  let updated = 0;

  for (const trail of missingProvince) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${trail.latitude}&lon=${trail.longitude}`,
        {
          headers: {
            "User-Agent":
              "BiagioTrail/1.0",
          },
        }
      );

      const data = await response.json();

      const province =
        data.address?.province ??
        data.address?.county ??
        null;

      if (!province) {
        continue;
      }

      const { error: updateError } =
        await supabase
          .from("trails")
          .update({
            province,
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
        `✅ ${updated} - ${province}`
      );

      await sleep(1100);
    } catch (err) {
      console.error(
        "Errore:",
        trail.id,
        err
      );
    }
  }

  console.log(
    `🎉 Aggiornati ${updated} sentieri`
  );
}

main().catch(console.error);