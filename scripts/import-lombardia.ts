/// <reference types="node" />

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
);

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]/g, "");
}

async function main() {
  const names = [
    "Monte Resegone",
    "Val di Mello",
    "Piani di Bobbio",
    "Grigna Settentrionale",
    "Grigna Meridionale",
    "Monte Legnone",
    "Sentiero del Viandante",
    "Corni di Canzo",
    "Monte San Primo",
    "Monte Barro",
    "Campo dei Fiori",
    "Monte Martica",
    "Monte San Giorgio",
    "Forte di Orino",
    "Sacro Monte di Varese",
    "Monte Generoso",
    "Monte Palanzone",
    "Monte Bollettone",
    "Monte Guglielmo",
    "Lago della Vacca",
    "Adamello",
    "Presolana",
    "Monte Alben",
    "Piani di Artavaggio",
    "Monte Due Mani",
    "Lago Palù",
    "Monte Disgrazia",
    "Alta Via della Valmalenco",
    "Monte Grona",
    "Sasso Gordona",
    "Monte Bregagno",
    "Monte Crocione",
    "Monte Muggio",
    "Monte Tesoro",
    "Monte Magnodeno",
    "Monte Linzone",
    "Monte Avaro",
    "Monte Sodadura",
    "Monte Berlinghera",
    "Monte Galbiga",
    "Monte Bisbino",
    "Monte Boletto",
    "Monte Colmegnone",
    "Monte Cornizzolo",
    "Monte Rai",
    "Monte Moregallo",
    "Monte Pravello",
    "Monte Piambello",
    "Monte Chiusarella",
    "Monte Nudo",
  ];

  const coordinatesMap: Record<
    string,
    {
      latitude: number;
      longitude: number;
    }
  > = {
    "Monte Resegone": {
      latitude: 45.851,
      longitude: 9.474,
    },

    "Val di Mello": {
      latitude: 46.259,
      longitude: 9.574,
    },

    "Piani di Bobbio": {
      latitude: 45.946,
      longitude: 9.491,
    },

    "Grigna Settentrionale": {
      latitude: 45.9483,
      longitude: 9.3852,
    },

    "Grigna Meridionale": {
      latitude: 45.911,
      longitude: 9.397,
    },

    "Monte Legnone": {
      latitude: 46.074,
      longitude: 9.366,
    },

    "Monte San Primo": {
      latitude: 45.93,
      longitude: 9.208,
    },

    "Monte Barro": {
      latitude: 45.8234,
      longitude: 9.394,
    },

    "Campo dei Fiori": {
      latitude: 45.87,
      longitude: 8.77,
    },

    "Monte Martica": {
      latitude: 45.876,
      longitude: 8.807,
    },

    "Forte di Orino": {
      latitude: 45.887,
      longitude: 8.769,
    },

    "Sacro Monte di Varese": {
      latitude: 45.8684,
      longitude: 8.7707,
    },

    "Monte Generoso": {
      latitude: 45.9297,
      longitude: 9.021,
    },

    "Monte Palanzone": {
      latitude: 45.876,
      longitude: 9.173,
    },

    "Monte Bollettone": {
      latitude: 45.842,
      longitude: 9.143,
    },

    "Monte Guglielmo": {
      latitude: 45.763,
      longitude: 10.188,
    },

    Adamello: {
      latitude: 46.166,
      longitude: 10.5,
    },

    Presolana: {
      latitude: 45.944,
      longitude: 10.085,
    },

    "Piani di Artavaggio": {
      latitude: 45.951,
      longitude: 9.542,
    },

    "Monte Due Mani": {
      latitude: 45.885,
      longitude: 9.42,
    },
  };

  const provinceMap: Record<string, string> = {
    "Monte Resegone": "Lecco",
    "Val di Mello": "Sondrio",
    "Piani di Bobbio": "Lecco",
    "Grigna Settentrionale": "Lecco",
    "Grigna Meridionale": "Lecco",
    "Monte Legnone": "Lecco",
    "Sentiero del Viandante": "Lecco",
    "Corni di Canzo": "Como",
    "Monte San Primo": "Como",
    "Monte Barro": "Lecco",
    "Campo dei Fiori": "Varese",
    "Monte Martica": "Varese",
    "Monte San Giorgio": "Varese",
    "Forte di Orino": "Varese",
    "Sacro Monte di Varese": "Varese",
    "Monte Generoso": "Como",
    "Monte Palanzone": "Como",
    "Monte Bollettone": "Como",
    "Monte Guglielmo": "Brescia",
    "Lago della Vacca": "Brescia",
    Adamello: "Brescia",
    Presolana: "Bergamo",
    "Monte Alben": "Bergamo",
    "Piani di Artavaggio": "Lecco",
    "Monte Due Mani": "Lecco",
    "Lago Palù": "Sondrio",
    "Monte Disgrazia": "Sondrio",
    "Alta Via della Valmalenco": "Sondrio",
    "Monte Grona": "Como",
    "Sasso Gordona": "Como",
    "Monte Bregagno": "Como",
    "Monte Crocione": "Como",
    "Monte Muggio": "Lecco",
    "Monte Tesoro": "Lecco",
    "Monte Magnodeno": "Lecco",
    "Monte Linzone": "Bergamo",
    "Monte Avaro": "Bergamo",
    "Monte Sodadura": "Lecco",
    "Monte Berlinghera": "Como",
    "Monte Galbiga": "Como",
    "Monte Bisbino": "Como",
    "Monte Boletto": "Como",
    "Monte Colmegnone": "Como",
    "Monte Cornizzolo": "Lecco",
    "Monte Rai": "Lecco",
    "Monte Moregallo": "Lecco",
    "Monte Pravello": "Varese",
    "Monte Piambello": "Varese",
    "Monte Chiusarella": "Varese",
    "Monte Nudo": "Varese",
  };

  const descriptionMap: Record<string, string> = {
    "Monte Resegone":
      "Il Monte Resegone è una delle montagne simbolo del territorio lecchese. Il percorso offre panorami spettacolari sul Lago di Como e sulle Prealpi lombarde.",

    "Val di Mello":
      "La Val di Mello è una delle valli alpine più suggestive della Lombardia, caratterizzata da torrenti cristallini, grandi pareti granitiche e prati montani.",

    "Piani di Bobbio":
      "I Piani di Bobbio rappresentano una delle destinazioni escursionistiche più frequentate della Lombardia con percorsi panoramici adatti a diversi livelli di esperienza.",

    "Grigna Settentrionale":
      "Escursione tra le più rappresentative delle Prealpi lecchesi con viste spettacolari sul Lago di Como e sulle montagne circostanti.",

    "Grigna Meridionale":
      "Percorso che conduce alla celebre Grignetta, apprezzata dagli escursionisti per gli ambienti alpini e i panorami mozzafiato.",

    "Monte Legnone":
      "Il Monte Legnone domina l'Alto Lago di Como e offre una delle viste più ampie dell'intero arco alpino lombardo.",

    "Sentiero del Viandante":
      "Storico itinerario che costeggia il ramo orientale del Lago di Como attraversando borghi, boschi e magnifici punti panoramici.",

    "Monte San Primo":
      "La vetta più alta del Triangolo Lariano regala panorami eccezionali sul Lago di Como e sulle Alpi.",

    "Campo dei Fiori":
      "Escursione nel Parco Regionale Campo dei Fiori attraverso boschi, sentieri naturalistici e scorci panoramici sulla provincia di Varese.",

    "Monte Generoso":
      "Percorso panoramico tra Italia e Svizzera con splendide viste sul Lago di Como, sul Lago di Lugano e sulle Alpi circostanti.",

    Adamello:
      "Itinerario di alta montagna nel massiccio dell'Adamello tra ghiacciai, laghi alpini e alcuni degli scenari più spettacolari delle Alpi lombarde.",

    Presolana:
      "Percorso ai piedi della Regina delle Orobie, caratterizzato da panorami montani e ambienti naturali di grande valore paesaggistico.",

    "Monte Guglielmo":
      "Una delle montagne simbolo del territorio bresciano, molto apprezzata per le ampie viste sul Lago d'Iseo.",

    "Piani di Artavaggio":
      "Altopiano alpino particolarmente amato dagli escursionisti per i prati d'alta quota, i rifugi e gli splendidi panorami.",
  };

  const trails = names.map((name, index) => {
    const location = coordinatesMap[name];

    return {
      id: slugify(name),
      osm_id: `seed-${index + 1}`,
      source: "seed-import",
      name,
      region: "Lombardia",

      province:
        provinceMap[name] ?? "Lombardia",

      distance_km: 5 + (index % 15),

      elevation_m: 300 + index * 25,

      duration: `${2 + (index % 6)}h`,

      difficulty: [
        "Easy",
        "Moderate",
        "Demanding",
      ][index % 3],

      description:
        descriptionMap[name] ??
        `${name} è un percorso escursionistico situato in Lombardia, ideale per esplorare ambienti naturali, punti panoramici e paesaggi alpini caratteristici della regione.`,

      coordinates: location
        ? `${location.latitude},${location.longitude}`
        : "45.8000,9.3000",

      latitude: location?.latitude ?? null,

      longitude: location?.longitude ?? null,

      start_point:
        "Parcheggio principale",

      weather: "N/D",

      rating: 4.5,

      review_count: 0,
    };
  });

  const { error } = await supabase
    .from("trails")
    .upsert(trails);

  if (error) {
    console.error(error);
    return;
  }

  console.log(
    `Import completato: ${trails.length} sentieri`
  );
}

main();