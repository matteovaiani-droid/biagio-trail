export type Difficulty = 'Easy' | 'Moderate' | 'Demanding';

export type Trail = {
  id: string;
  name: string;
  region: string;
  province: string;
  distanceKm: number;
  elevationM: number;
  duration: string;
  difficulty: Difficulty;
  rating: number;
  reviewCount: number;
  description: string;
  image: string;
  highlights: string[];
  coordinates: string;
};

export const trails: Trail[] = [
  {
    id: 'sentiero-degli-dei',
    name: 'Sentiero degli Dei',
    region: 'Campania',
    province: 'Salerno',
    distanceKm: 8.6,
    elevationM: 630,
    duration: '3h 40m',
    difficulty: 'Moderate',
    rating: 4.9,
    reviewCount: 328,
    description: 'Un balcone sulla Costiera Amalfitana, tra terrazzamenti di limoni e cornici calcaree da Bomerano a Nocelle. Parti presto per goderti il Tirreno nella sua luce migliore.',
    image: 'https://images.pexels.com/photos/259447/pexels-photo-259447.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: ['Panorami sul mare da Punta Licosa', 'Il borgo in pietra di Nocelle', 'Terrazzamenti di limoni all’ombra'],
    coordinates: '40.6288° N, 14.5368° E',
  },
  {
    id: 'tre-cime-loop',
    name: 'Anello delle Tre Cime',
    region: 'Dolomiti',
    province: 'Belluno',
    distanceKm: 10.2,
    elevationM: 410,
    duration: '4h 15m',
    difficulty: 'Moderate',
    rating: 4.8,
    reviewCount: 481,
    description: 'Il classico anello attorno alle tre torri pallide di Lavaredo. Un’escursione d’alta quota su un sentiero intuitivo, con un orizzonte che si allarga a ogni passo.',
    image: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: ['Belvedere sulle Tre Cime', 'Rifugio Locatelli', 'Alba sulle pareti nord'],
    coordinates: '46.6188° N, 12.2953° E',
  },
  {
    id: 'monte-baldo-ridge',
    name: 'Cresta del Monte Baldo',
    region: 'Veneto',
    province: 'Verona',
    distanceKm: 12.8,
    elevationM: 740,
    duration: '5h 10m',
    difficulty: 'Demanding',
    rating: 4.7,
    reviewCount: 196,
    description: 'Una cresta lunga e ariosa sopra il Lago di Garda, dove d’estate i fiori selvatici invadono il sentiero. La funivia permette di adattare il percorso anche a una giornata più breve.',
    image: 'https://images.pexels.com/photos/1576937/pexels-photo-1576937.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: ['Panorama sul Lago di Garda', 'Cappella del Monte Altissimo', 'Fiori alpini rari'],
    coordinates: '45.7534° N, 10.8463° E',
  },
  {
    id: 'val-di-funes',
    name: 'Sentiero dei prati della Val di Funes',
    region: 'Alto Adige',
    province: 'Bolzano',
    distanceKm: 6.4,
    elevationM: 220,
    duration: '2h 20m',
    difficulty: 'Easy',
    rating: 4.8,
    reviewCount: 274,
    description: 'Un anello dolce tra prati fioriti e boschi di larici, incorniciato dalle cime frastagliate delle Odle. Una prima passeggiata in montagna perfetta per tutta la famiglia.',
    image: 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: ['Chiesa di Santa Maddalena', 'Le Odle sullo sfondo', 'Prati soleggiati per un picnic'],
    coordinates: '46.6412° N, 11.7191° E',
  },
  {
    id: 'gran-sasso-ascent',
    name: 'Salita al Gran Sasso',
    region: 'Abruzzo',
    province: "L'Aquila",
    distanceKm: 14.5,
    elevationM: 1_120,
    duration: '6h 30m',
    difficulty: 'Demanding',
    rating: 4.6,
    reviewCount: 142,
    description: 'Una giornata intera sul tetto degli Appennini. Attraversa l’altopiano aperto di Campo Imperatore fino a un ambiente d’alta quota silenzioso e a una vetta dal respiro continentale.',
    image: 'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: ['Altopiano di Campo Imperatore', 'Panorami dalla vetta appenninica', 'Habitat del camoscio'],
    coordinates: '42.4731° N, 13.5589° E',
  },
  {
    id: 'cinque-torri',
    name: 'Panorama delle Cinque Torri',
    region: 'Dolomiti',
    province: 'Belluno',
    distanceKm: 7.1,
    elevationM: 360,
    duration: '3h 05m',
    difficulty: 'Easy',
    rating: 4.9,
    reviewCount: 389,
    description: 'Un anello luminoso ai piedi di torri rocciose scolpite, con postazioni dell’antico museo all’aperto della guerra e il profilo di Cortina all’orizzonte.',
    image: 'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: ['Le guglie rocciose delle Cinque Torri', 'Museo all’aperto della Grande Guerra', 'Panorama su Cortina'],
    coordinates: '46.5159° N, 12.0590° E',
  },
];