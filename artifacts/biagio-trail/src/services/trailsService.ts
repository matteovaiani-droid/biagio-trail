import { supabase } from "@/lib/supabase";

export async function getTrailById(id: string) {
  const { data, error } = await supabase
    .from("trails")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getTrails() {
  const allRows: any[] = [];

  const batchSize = 1000;
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("trails")
      .select("*")
      .range(from, from + batchSize - 1);

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      break;
    }

    allRows.push(...data);

    console.log(
      `Caricati ${allRows.length} sentieri...`
    );

    if (data.length < batchSize) {
      break;
    }

    from += batchSize;
  }

  console.log(
    `TRAILS TOTALI: ${allRows.length}`
  );

  return allRows;
}