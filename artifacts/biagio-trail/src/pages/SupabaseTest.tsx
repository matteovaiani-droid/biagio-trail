import { useEffect, useState } from "react";
import { getTrails } from "@/services/trailsService";

export function SupabaseTest() {
  const [trails, setTrails] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getTrails()
      .then((data: any) => {
        setTrails(data ?? []);
      })
      .catch((err: any) => {
          console.error(err);
          setError(JSON.stringify(err, null, 2));
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test Supabase</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <p>
        Sentieri trovati: {trails.length}
      </p>

      <pre>
        {JSON.stringify(trails, null, 2)}
      </pre>
    </div>
  );
}
