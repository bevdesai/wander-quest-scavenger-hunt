import type { Language, Theme, DurationMinutes } from '@/types/hunt';
import type { DemoStopProgress } from '@/lib/storage';

export interface MockHuntConfig {
  city: string;
  language: Language;
  durationMinutes: DurationMinutes;
  theme: Theme;
}

const MOCK_STOPS: Omit<DemoStopProgress, 'isVerified' | 'verificationFeedback' | 'photoUrl' | 'attemptCount'>[] = [
  {
    id: 'demo-stop-1',
    stopNumber: 1,
    landmarkName: 'Old Town Square',
    riddle: 'I stand where cobblestones meet, surrounded by colors that never sleep. A fountain sings at my center, and centuries of footsteps have worn my stones smooth. What am I?',
    audioScript: 'Welcome to the Old Town Square, the beating heart of the city for over 800 years. Merchants, musicians, and rebels have all gathered here. The fountain at its center has quenched the thirst of travelers since the Middle Ages, and every building tells a different story in a different color.',
    targetVisualDescription: 'A large open cobblestone square with colorful historic buildings on all sides, a central stone fountain, and people walking through.',
  },
  {
    id: 'demo-stop-2',
    stopNumber: 2,
    landmarkName: 'The Grand Opera House',
    riddle: 'My arches glow when the sun goes down, and voices soar behind my stone walls. I wear a crown of columns, and kings once walked my red carpet. Find me where the street widens.',
    audioScript: 'The Grand Opera House opened its doors in 1892 and has hosted some of the world\'s finest performers. Its neoclassical facade with towering columns was designed to impress before you even step inside. Look up at the arched windows that light up golden at sunset.',
    targetVisualDescription: 'A grand neoclassical building with tall columns at the entrance, arched windows, and ornate stone detailing on the facade.',
  },
  {
    id: 'demo-stop-3',
    stopNumber: 3,
    landmarkName: 'Riverside Food Market',
    riddle: 'Follow the scent of spice and smoke to where the river bends. Under striped awnings, hands fold dumplings and pour steaming broth. I am loudest at noon and quietest at midnight.',
    audioScript: 'The Riverside Food Market has been feeding this city for over a century. What started as a few fish stalls is now a maze of flavors from every corner of the world. The river beside it was once the main trade route that brought the first spices here.',
    targetVisualDescription: 'An outdoor market with striped awnings, food stalls with colorful produce and cooked food, vendors and customers, located near a river.',
  },
];

const SAMPLE_VERIFICATION_PHOTOS: Record<string, string> = {
  'demo-stop-1': 'https://images.pexels.com/photos/29138602/pexels-photo-29138602.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'demo-stop-2': 'https://images.pexels.com/photos/4220961/pexels-photo-4220961.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'demo-stop-3': 'https://images.pexels.com/photos/10697692/pexels-photo-10697692.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
};

const MISMATCH_PHOTO = 'https://images.pexels.com/photos/35639342/pexels-photo-35639342.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export function createMockHunt(config: MockHuntConfig): DemoStopProgress[] {
  return MOCK_STOPS.map((stop) => ({
    ...stop,
    photoUrl: null,
    isVerified: false,
    verificationFeedback: null,
    attemptCount: 0,
  }));
}

export function getSamplePhotoForStop(stopId: string): string {
  return SAMPLE_VERIFICATION_PHOTOS[stopId] ?? MISMATCH_PHOTO;
}

export function getMismatchPhoto(): string {
  return MISMATCH_PHOTO;
}
