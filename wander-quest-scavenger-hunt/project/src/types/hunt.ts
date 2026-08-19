export type Language = 'English' | 'Spanish' | 'French' | 'Japanese' | 'German';

export type Theme = 'Historical' | 'Foodie' | 'Family-Friendly';

export type DurationMinutes = 30 | 60 | 90;

export type HuntStatus = 'generating' | 'ready' | 'failed';

export interface Hunt {
  id: string;
  city: string;
  language: Language;
  duration_minutes: DurationMinutes;
  theme: Theme;
  status: HuntStatus;
  error_message: string | null;
  created_at: string;
}

export interface HuntStop {
  id: string;
  hunt_id: string;
  stop_number: number;
  landmark_name: string;
  riddle: string;
  audio_script: string;
  target_visual_description: string;
  photo_url: string | null;
  is_verified: boolean;
  verification_feedback: string | null;
  created_at: string;
}

export const LANGUAGES: Language[] = ['English', 'Spanish', 'French', 'Japanese', 'German'];

export const LANGUAGE_LOCALES: Record<Language, string> = {
  English: 'en-US',
  Spanish: 'es-ES',
  French: 'fr-FR',
  Japanese: 'ja-JP',
  German: 'de-DE',
};

export const DURATIONS: DurationMinutes[] = [30, 60, 90];

export const THEMES: Theme[] = ['Historical', 'Foodie', 'Family-Friendly'];
