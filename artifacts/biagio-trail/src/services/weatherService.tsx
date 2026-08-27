export async function getWeather(
  coordinates: string
) {
  const [latitude, longitude] =
    coordinates.split(",");

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m`
  );

  if (!response.ok) {
    throw new Error(
      "Errore recupero meteo"
    );
  }

  return response.json();
  
}
export function getWeatherDescription(
  code: number
) {
  const map: Record<number, string> = {
    0: "☀️ Sereno",
    1: "🌤️ Prevalentemente sereno",
    2: "⛅ Parzialmente nuvoloso",
    3: "☁️ Nuvoloso",

    45: "🌫️ Nebbia",
    48: "🌫️ Nebbia intensa",

    51: "🌦️ Pioviggine leggera",
    53: "🌦️ Pioviggine",
    55: "🌦️ Pioviggine intensa",

    61: "🌧️ Pioggia leggera",
    63: "🌧️ Pioggia moderata",
    65: "🌧️ Pioggia intensa",

    71: "❄️ Neve leggera",
    73: "❄️ Neve moderata",
    75: "❄️ Neve intensa",

    80: "🌦️ Rovesci",
    81: "🌧️ Rovesci moderati",
    82: "🌧️ Rovesci forti",

    95: "⛈️ Temporale",
    96: "⛈️ Temporale con grandine",
    99: "⛈️ Temporale forte",
  };

  return map[code] ?? "🌤️ Meteo non disponibile";
}
``