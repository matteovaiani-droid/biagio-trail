import { supabase } from "@/lib/supabase";

  export async function getTrails() {
    const { data, error } = await supabase
      .from("trails")
      .select("*");

  if (error) {
    throw error;
  }

  return data;
}