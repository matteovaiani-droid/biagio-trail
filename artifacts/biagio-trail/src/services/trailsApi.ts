const OVERPASS_URL =
  "https://overpass-api.de/api/interpreter";

export async function fetchTrails() {
  const query = `
    [out:json][timeout:25];
    (
      relation["route"="hiking"](45.4,8.5,46.5,10.5);

  `;

  const response = await fetch(
    OVERPASS_URL,
    {
      method: "POST",
      body: query,
    }
  );

  const data = await response.json();

  console.log("OVERPASS RESPONSE", data);

  return data;
}