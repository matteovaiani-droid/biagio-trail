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
  image?: string;
  image_url?: string;
  highlights: string[];
  coordinates: string;
  weather?: string;
  startPoint?: string;
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
    description:
      'Un balcone sulla Costiera Amalfitana, tra terrazzamenti di limoni e cornici calcaree da Bomerano a Nocelle.',
    image:
      'https://images.pexels.com/photos/259447/pexels-photo-259447.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: [
      'Panorami sulla Costiera Amalfitana',
      'Borgo di Nocelle',
      'Terrazzamenti di limoni'
    ],
    coordinates: '40.6288° N, 14.5368° E',
    weather: '22°C Sereno',
    startPoint: 'Bomerano'
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
    description:
      'Il classico anello attorno alle Tre Cime di Lavaredo con panorami spettacolari sulle Dolomiti.',
    image:
      'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: [
      'Tre Cime di Lavaredo',
      'Rifugio Locatelli',
      'Panorami dolomitici'
    ],
    coordinates: '46.6188° N, 12.2953° E',
    weather: '17°C Poco Nuvoloso',
    startPoint: 'Rifugio Auronzo'
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
    description:
      'Una lunga cresta panoramica sopra il Lago di Garda tra pascoli alpini e viste mozzafiato.',
    image:
      'https://images.pexels.com/photos/1576937/pexels-photo-1576937.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: [
      'Vista sul Lago di Garda',
      'Monte Altissimo',
      'Flora alpina'
    ],
    coordinates: '45.7534° N, 10.8463° E',
    weather: '19°C Sereno',
    startPoint: 'Stazione Funivia Malcesine'
  },

  {
    id: 'val-di-funes',
    name: 'Val di Funes',
    region: 'Alto Adige',
    province: 'Bolzano',
    distanceKm: 6.4,
    elevationM: 220,
    duration: '2h 20m',
    difficulty: 'Easy',
    rating: 4.8,
    reviewCount: 274,
    description:
      'Passeggiata semplice tra prati, boschi e viste spettacolari sulle Odle.',
    image:
      'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: [
      'Santa Maddalena',
      'Odle',
      'Prati alpini'
    ],
    coordinates: '46.6412° N, 11.7191° E',
    weather: '20°C Sereno',
    startPoint: 'Santa Maddalena'
  },

  {
    id: 'gran-sasso-ascent',
    name: 'Salita al Gran Sasso',
    region: 'Abruzzo',
    province: "L'Aquila",
    distanceKm: 14.5,
    elevationM: 1120,
    duration: '6h 30m',
    difficulty: 'Demanding',
    rating: 4.6,
    reviewCount: 142,
    description:
      'Escursione impegnativa verso la vetta più alta degli Appennini.',
    image:
      'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: [
      'Campo Imperatore',
      'Vetta del Corno Grande',
      'Fauna appenninica'
    ],
    coordinates: '42.4731° N, 13.5589° E',
    weather: '15°C Ventoso',
    startPoint: 'Campo Imperatore'
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
    description:
      'Percorso ad anello tra le iconiche torri rocciose e i siti storici della Grande Guerra.',
    image:
      'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: [
      'Cinque Torri',
      'Museo della Grande Guerra',
      'Vista su Cortina'
    ],
    coordinates: '46.5159° N, 12.0590° E',
    weather: '18°C Sereno',
    startPoint: 'Rifugio Scoiattoli'
  },

  {
    id: 'monte-generoso',
    name: 'Monte Generoso',
    region: 'Lombardia',
    province: 'Como',
    distanceKm: 8.4,
    elevationM: 580,
    duration: '3h 20m',
    difficulty: 'Moderate',
    rating: 4.8,
    reviewCount: 210,
    description:
      'Percorso panoramico tra Italia e Svizzera con viste sul Lago di Lugano, sul Lago di Como e sull’arco alpino.',
    image:
      'https://images.pexels.com/photos/1366909/pexels-photo-1366909.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: [
      'Vista sul Lago di Lugano',
      'Panorama alpino',
      'Belvedere Vetta Generoso',
      'Confine Italia-Svizzera'
    ],
    coordinates: '45.9297° N, 9.0210° E',
    weather: '18°C Sereno',
    startPoint: 'Orimento'
  }
];