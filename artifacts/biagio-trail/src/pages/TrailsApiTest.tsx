import { useEffect, useState } from "react";
import { fetchTrails } from "@/services/trailsApi";

export function TrailsApiTest() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchTrails()
      .then((result: any) => {
        console.log(result);
        setData(result);
      })
      .catch((error: any) => {
        console.error(error);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test OpenStreetMap</h1>

      {data ? (
        <pre>
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <p>Caricamento...</p>
      )}
    </div>
  );
}