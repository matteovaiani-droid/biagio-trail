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
    description: 'A balcony above the Amalfi Coast, threading lemon terraces and limestone ledges between Bomerano and Nocelle. Start early for the clearest Tyrrhenian views.',
    image: 'https://images.pexels.com/photos/259447/pexels-photo-259447.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: ['Sea views from Punta Licosa', 'The stone hamlet of Nocelle', 'Shaded lemon terraces'],
    coordinates: '40.6288° N, 14.5368° E',
  },
  {
    id: 'tre-cime-loop',
    name: 'Tre Cime Loop',
    region: 'Dolomites',
    province: 'Belluno',
    distanceKm: 10.2,
    elevationM: 410,
    duration: '4h 15m',
    difficulty: 'Moderate',
    rating: 4.8,
    reviewCount: 481,
    description: 'The classic circuit around the three pale towers of Lavaredo. A high-alpine walk with an easy-to-follow path and a horizon that keeps getting bigger.',
    image: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: ['Drei Zinnen viewpoint', 'Rifugio Locatelli', 'Sunrise on the north faces'],
    coordinates: '46.6188° N, 12.2953° E',
  },
  {
    id: 'monte-baldo-ridge',
    name: 'Monte Baldo Ridge',
    region: 'Veneto',
    province: 'Verona',
    distanceKm: 12.8,
    elevationM: 740,
    duration: '5h 10m',
    difficulty: 'Demanding',
    rating: 4.7,
    reviewCount: 196,
    description: 'A long, airy ridge above Lake Garda where wildflowers spill over the path in summer. The cable car makes this route adaptable to a shorter day.',
    image: 'https://images.pexels.com/photos/1576937/pexels-photo-1576937.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: ['Lake Garda panorama', 'Monte Altissimo chapel', 'Rare alpine flowers'],
    coordinates: '45.7534° N, 10.8463° E',
  },
  {
    id: 'val-di-funes',
    name: 'Val di Funes Meadow Path',
    region: 'South Tyrol',
    province: 'Bolzano',
    distanceKm: 6.4,
    elevationM: 220,
    duration: '2h 20m',
    difficulty: 'Easy',
    rating: 4.8,
    reviewCount: 274,
    description: 'A gentle loop through flower meadows and larch woods, framed by the serrated Odle peaks. A generous first mountain walk for all the family.',
    image: 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: ['Church of Santa Maddalena', 'Odle mountain backdrop', 'Sunny picnic meadows'],
    coordinates: '46.6412° N, 11.7191° E',
  },
  {
    id: 'gran-sasso-ascent',
    name: 'Gran Sasso Ascent',
    region: 'Abruzzo',
    province: "L'Aquila",
    distanceKm: 14.5,
    elevationM: 1_120,
    duration: '6h 30m',
    difficulty: 'Demanding',
    rating: 4.6,
    reviewCount: 142,
    description: 'A full mountain day to the roof of the Apennines. Follow the open Campo Imperatore plateau into high, quiet terrain and a summit with continental scale.',
    image: 'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: ['Campo Imperatore plateau', 'Apennine summit views', 'Chamois habitat'],
    coordinates: '42.4731° N, 13.5589° E',
  },
  {
    id: 'cinque-torri',
    name: 'Cinque Torri Panorama',
    region: 'Dolomites',
    province: 'Belluno',
    distanceKm: 7.1,
    elevationM: 360,
    duration: '3h 05m',
    difficulty: 'Easy',
    rating: 4.9,
    reviewCount: 389,
    description: 'A bright loop beneath sculpted rock towers, with old open-air war museum posts along the way and Cortina’s skyline in the distance.',
    image: 'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: ['Cinque Torri rock spires', 'Open-air Great War museum', 'Cortina views'],
    coordinates: '46.5159° N, 12.0590° E',
  },
];