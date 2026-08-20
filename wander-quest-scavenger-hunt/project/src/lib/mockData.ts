import type { Language, Theme, DurationMinutes } from '@/types/hunt';
import type { DemoStopProgress } from '@/lib/storage';

export interface MockHuntConfig {
  city: string;
  language: Language;
  durationMinutes: DurationMinutes;
  theme: Theme;
}

interface MockStopTemplate {
  id: string;
  stopNumber: number;
  landmarkName: string;
  riddle: string;
  audioScript: string;
  targetVisualDescription: string;
  samplePhoto: string;
}

interface DemoCity {
  key: string;
  label: string;
  stops: MockStopTemplate[];
}

const MISMATCH_PHOTO = 'https://images.pexels.com/photos/35639342/pexels-photo-35639342.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

const DEMO_CITIES: DemoCity[] = [
  {
    key: 'Prague',
    label: 'Prague, Czech Republic',
    stops: [
      {
        id: 'prague-1',
        stopNumber: 1,
        landmarkName: 'Old Town Square & Astronomical Clock',
        riddle: 'I\'ve counted every hour for six centuries, yet I never grow tired. My golden hands map the stars while stone apostles march above me. Stand beneath me at the top of the hour and watch me come alive. What am I?',
        audioScript: 'Welcome to the Old Town Square, the beating heart of Prague for over 800 years. The Astronomical Clock has been ticking since 1410 — making it the oldest still working clock of its kind. Every hour, the twelve apostles parade through the windows above, while a skeleton rings a bell reminding everyone that time waits for no one.',
        targetVisualDescription: 'A large medieval astronomical clock mounted on the facade of an old stone tower, with golden dial details and sculpted figures, in a cobblestone square with colorful historic buildings.',
        samplePhoto: 'https://images.pexels.com/photos/35551649/pexels-photo-35551649.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
      {
        id: 'prague-2',
        stopNumber: 2,
        landmarkName: 'Charles Bridge',
        riddle: 'Thirty saints watch over my back, and my stones have carried kings and commoners alike for 600 years. Below me, a river flows golden at sunset. I connect two worlds — find me where the castle meets the city.',
        audioScript: 'Charles Bridge has spanned the Vltava River since the 14th century, commissioned by King Charles IV. Its 30 baroque statues of saints line both sides like silent guardians. The bridge was the only crossing for centuries, and legend says eggs were mixed into the mortar to make it stronger.',
        targetVisualDescription: 'A historic stone pedestrian bridge with tall baroque statues lining both sides, spanning a river, with a castle and church spires visible in the background.',
        samplePhoto: 'https://images.pexels.com/photos/38416365/pexels-photo-38416365.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
      {
        id: 'prague-3',
        stopNumber: 3,
        landmarkName: 'Prague Street Food Market',
        riddle: 'Follow the scent of cinnamon and sugar to where dough is wound around wooden spindles and turned golden over coals. I\'m sweet, I\'m spiral, and I\'m best eaten warm with your bare hands. What am I?',
        audioScript: 'You\'ve found a street food stall serving trdelník — a traditional Czech pastry wrapped around a stick, grilled over coals, and coated in sugar and walnuts. It\'s a favorite in Prague\'s old town lanes, where vendors set up their grills and the smell drifts through the cobblestone streets.',
        targetVisualDescription: 'A street food vendor stall with chimney cakes (trdelník) being grilled on rotating spindles over coals, with sugar-coated spiral pastries visible, in an old European street setting.',
        samplePhoto: 'https://images.pexels.com/photos/10462518/pexels-photo-10462518.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
    ],
  },
  {
    key: 'Lisbon',
    label: 'Lisbon, Portugal',
    stops: [
      {
        id: 'lisbon-1',
        stopNumber: 1,
        landmarkName: 'Belém Tower',
        riddle: 'I rose from the river to guard the gate of a kingdom of explorers. My stones are carved with rhinoceroses and elephants — beasts no one had seen before. I\'ve watched ships leave and return for 500 years. What am I?',
        audioScript: 'Belém Tower, or Torre de Belém, was built in 1519 as a fortress to guard the entrance to Lisbon\'s harbor. It was the last thing sailors saw as they set out to discover new worlds, and the first thing they saw when they came home. Its limestone walls are decorated with carved rope, crosses, and even a rhinoceros — inspired by a real rhino sent to the King of Portugal from India in 1515.',
        targetVisualDescription: 'A white stone tower fortress standing at the edge of a river, with ornate Manueline architectural details, arched windows, and a rooftop terrace, reflected in the water.',
        samplePhoto: 'https://images.pexels.com/photos/16207032/pexels-photo-16207032.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
      {
        id: 'lisbon-2',
        stopNumber: 2,
        landmarkName: 'Yellow Tram in Alfama',
        riddle: 'I am yellow, I am old, and I rattle up hills too steep for cars. My rails are carved into cobblestones, and my route takes you past laundry hanging from balconies and fado spilling from open windows. What am I?',
        audioScript: 'Lisbon\'s iconic yellow trams have been climbing the city\'s steep, narrow streets since 1901. Tram 28 is the most famous — it winds through the Alfama and Graça districts, past tiled facades, tiny churches, and viewpoints overlooking the Tagus River. The trams are wooden, creaky, and beloved by locals and visitors alike.',
        targetVisualDescription: 'A vintage yellow tram on narrow cobblestone street with old colorful buildings on both sides, laundry hanging from balconies, in a historic European neighborhood.',
        samplePhoto: 'https://images.pexels.com/photos/29743111/pexels-photo-29743111.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
      {
        id: 'lisbon-3',
        stopNumber: 3,
        landmarkName: 'Time Out Market',
        riddle: 'Under a vaulted ceiling of iron and glass, the city\'s best cooks have gathered in one place. I smell of grilled sardines, pastel de nata, and garlic shrimp. Follow the crowd to where everyone is eating. What am I?',
        audioScript: 'The Time Out Market, housed in the old Mercado da Ribeira, brings together some of Lisbon\'s best chefs under one roof. You\'ll find everything here — from traditional Portuguese bacalhau to gourmet burgers and the creamiest pastel de nata in the city. The market has been feeding Lisbon since 1892, and its revival made it one of the most visited food halls in the world.',
        targetVisualDescription: 'A large indoor food market hall with an ornate iron-and-glass ceiling, rows of food stalls with people eating at communal tables, bright signage and various cuisines visible.',
        samplePhoto: 'https://images.pexels.com/photos/28208277/pexels-photo-28208277.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
    ],
  },
  {
    key: 'Kyoto',
    label: 'Kyoto, Japan',
    stops: [
      {
        id: 'kyoto-1',
        stopNumber: 1,
        landmarkName: 'Kinkaku-ji (Golden Pavilion)',
        riddle: 'I am wrapped in gold leaf and mirrored in a still pond. My reflection is as famous as I am. Pine trees frame me, and koi swim beneath my double image. I have burned and been reborn. What am I?',
        audioScript: 'Kinkaku-ji, the Golden Pavilion, was originally a retirement villa for a shogun in the 14th century. Its top two floors are covered in pure gold leaf, and it reflects perfectly in the pond beside it. The building was burned down by a monk in 1950 and meticulously rebuilt — a story that inspired one of Japan\'s most famous novels by Yukio Mishima.',
        targetVisualDescription: 'A three-story Japanese temple pavilion covered in gold leaf, reflected in a calm pond with pine trees and small islands around it, traditional Japanese garden setting.',
        samplePhoto: 'https://images.pexels.com/photos/29665300/pexels-photo-29665300.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
      {
        id: 'kyoto-2',
        stopNumber: 2,
        landmarkName: 'Fushimi Inari Taisha',
        riddle: 'I am a tunnel of ten thousand red gates, each donated by someone\'s prayer. I climb a mountain through cedar forest, and foxes guard my path. The deeper you walk, the quieter the world becomes. What am I?',
        audioScript: 'Fushimi Inari is one of Japan\'s most sacred and atmospheric sites. The path up Mount Inari is lined with thousands of vermilion torii gates, each donated by individuals or companies. The shrine is dedicated to Inari, the god of rice and prosperity, and foxes are believed to be the messengers. The trail goes for four kilometers up the mountain.',
        targetVisualDescription: 'A path lined with closely spaced red torii gates forming a tunnel through forest, with Japanese characters on the gates and cedar trees on either side.',
        samplePhoto: 'https://images.pexels.com/photos/29537651/pexels-photo-29537651.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
      {
        id: 'kyoto-3',
        stopNumber: 3,
        landmarkName: 'Nishiki Market',
        riddle: 'I am a narrow street with a roof, where you can taste the whole city in five minutes. Pickled radish, grilled eel, matcha sweets, and tofu skin — I am called Kyoto\'s kitchen. What am I?',
        audioScript: 'Nishiki Market has been Kyoto\'s kitchen for over 400 years. This narrow, covered street is packed with stalls selling pickled vegetables, fresh seafood, mochi, matcha, and every kind of Kyoto specialty. It\'s five blocks long, and many stalls let you taste before you buy. It\'s the best place to understand what Kyoto eats.',
        targetVisualDescription: 'A narrow covered market street with food stalls on both sides selling Japanese foods, signs and lanterns overhead, people walking and browsing, narrow pedestrian lane.',
        samplePhoto: 'https://images.pexels.com/photos/34988438/pexels-photo-34988438.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
    ],
  },
];

const DEMO_CITY_MAP: Record<string, DemoCity> = Object.fromEntries(
  DEMO_CITIES.map((city) => [city.key, city])
);

export function getDemoCityKeys(): string[] {
  return DEMO_CITIES.map((city) => city.key);
}

export function getDemoCityLabels(): { key: string; label: string }[] {
  return DEMO_CITIES.map((city) => ({ key: city.key, label: city.label }));
}

function findDemoCity(cityName: string): DemoCity {
  const normalized = cityName.trim().toLowerCase();
  for (const city of DEMO_CITIES) {
    if (city.key.toLowerCase() === normalized) {
      return city;
    }
  }
  // Default to Prague if no match
  return DEMO_CITIES[0];
}

export function createMockHunt(config: MockHuntConfig): DemoStopProgress[] {
  const demoCity = findDemoCity(config.city);
  return demoCity.stops.map((stop) => ({
    id: stop.id,
    stopNumber: stop.stopNumber,
    landmarkName: stop.landmarkName,
    riddle: stop.riddle,
    audioScript: stop.audioScript,
    targetVisualDescription: stop.targetVisualDescription,
    photoUrl: null,
    isVerified: false,
    verificationFeedback: null,
    attemptCount: 0,
  }));
}

export function getSamplePhotoForStop(stopId: string): string {
  for (const city of DEMO_CITIES) {
    const stop = city.stops.find((s) => s.id === stopId);
    if (stop) return stop.samplePhoto;
  }
  return MISMATCH_PHOTO;
}

export function getMismatchPhoto(): string {
  return MISMATCH_PHOTO;
}
