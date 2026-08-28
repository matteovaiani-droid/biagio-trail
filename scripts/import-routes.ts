/// <reference types="node" />

async function main() {
  const osmId = "2061210";

  const query = `
[out:json][timeout:120];
relation(${osmId});
out geom;
`;

  const response = await fetch(
    "https://overpass-api.de/api/interpreter",
    {
      method: "POST",
      body: query,
    },
  );

  console.log("status:", response.status);

  const text = await response.text();

  console.log(
    text.slice(0, 3000),
  );
}

main().catch(console.error);