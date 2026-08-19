import type { Language, Theme, DurationMinutes } from '@/types/hunt';

const STORAGE_KEYS = {
  apiKey: 'wq_api_key',
  demoMode: 'wq_demo_mode',
  language: 'wq_language',
  activeHunt: 'wq_active_hunt',
} as const;

export interface PersistedSettings {
  apiKey: string | null;
  demoMode: boolean;
  language: Language;
}

export interface HuntProgressState {
  huntId: string;
  city: string;
  language: Language;
  durationMinutes: DurationMinutes;
  theme: Theme;
  isDemo: boolean;
  stops: DemoStopProgress[];
  savedAt: number;
}

export interface DemoStopProgress {
  id: string;
  stopNumber: number;
  landmarkName: string;
  riddle: string;
  audioScript: string;
  targetVisualDescription: string;
  photoUrl: string | null;
  isVerified: boolean;
  verificationFeedback: string | null;
  attemptCount: number;
}

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage might be full or disabled
  }
}

function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // no-op
  }
}

export function loadSettings(): PersistedSettings {
  const apiKey = safeGet(STORAGE_KEYS.apiKey);
  const demoModeStr = safeGet(STORAGE_KEYS.demoMode);
  const languageStr = safeGet(STORAGE_KEYS.language) as Language | null;

  return {
    apiKey: apiKey && apiKey.length > 0 ? apiKey : null,
    demoMode: demoModeStr === 'true',
    language: languageStr && ['English', 'Spanish', 'French', 'Japanese', 'German'].includes(languageStr)
      ? languageStr
      : 'English',
  };
}

export function saveApiKey(key: string | null): void {
  if (key) {
    safeSet(STORAGE_KEYS.apiKey, key);
  } else {
    safeRemove(STORAGE_KEYS.apiKey);
  }
}

export function saveDemoMode(enabled: boolean): void {
  safeSet(STORAGE_KEYS.demoMode, String(enabled));
}

export function saveLanguage(language: Language): void {
  safeSet(STORAGE_KEYS.language, language);
}

export function saveHuntProgress(state: HuntProgressState): void {
  safeSet(STORAGE_KEYS.activeHunt, JSON.stringify(state));
}

export function loadHuntProgress(): HuntProgressState | null {
  const raw = safeGet(STORAGE_KEYS.activeHunt);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as HuntProgressState;
  } catch {
    return null;
  }
}

export function clearHuntProgress(): void {
  safeRemove(STORAGE_KEYS.activeHunt);
}
