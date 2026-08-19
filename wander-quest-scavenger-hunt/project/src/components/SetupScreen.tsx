import { useState } from 'react';
import { Compass, MapPin, Clock, Sparkles, Loader2, Globe2, MapPinned, AlertCircle } from 'lucide-react';
import type { Language, Theme, DurationMinutes } from '@/types/hunt';
import { LANGUAGES, DURATIONS, THEMES } from '@/types/hunt';
import { useApp } from '@/context/AppContext';
import type { TranslationKey } from '@/lib/i18n';

interface SetupScreenProps {
  onGenerate: (params: {
    city: string;
    region?: string;
    language: Language;
    durationMinutes: DurationMinutes;
    theme: Theme;
  }) => void;
  isGenerating: boolean;
  errorMessage: string | null;
}

export function SetupScreen({ onGenerate, isGenerating, errorMessage }: SetupScreenProps) {
  const { t, language, setLanguage, demoMode } = useApp();
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [duration, setDuration] = useState<DurationMinutes>(60);
  const [theme, setTheme] = useState<Theme>('Historical');

  const canSubmit = (city.trim().length > 1 || demoMode) && !isGenerating;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    onGenerate({
      city: city.trim() || (demoMode ? 'Demo City' : ''),
      region: region.trim() || undefined,
      language,
      durationMinutes: duration,
      theme,
    });
  };

  const themeKeys: Record<Theme, { name: TranslationKey; desc: TranslationKey }> = {
    Historical: { name: 'themeHistorical', desc: 'themeHistoricalDesc' },
    Foodie: { name: 'themeFoodie', desc: 'themeFoodieDesc' },
    'Family-Friendly': { name: 'themeFamily', desc: 'themeFamilyDesc' },
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <div className="relative h-56 sm:h-64 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/28434916/pexels-photo-28434916.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-teal-950/40 to-teal-950/10" />
        <div className="relative h-full flex flex-col items-center justify-end pb-6 px-6 text-center">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur rounded-full px-4 py-1.5 shadow-sm mb-3">
            <Compass className="w-4 h-4 text-teal-700" strokeWidth={2.5} />
            <span className="text-xs font-semibold tracking-wide text-teal-800 uppercase">
              {t('appName')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-sm leading-tight">
            {t('tagline')}
          </h1>
        </div>
      </div>

      {demoMode && (
        <div className="max-w-xl w-full mx-auto px-5 -mt-1">
          <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs text-amber-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {t('demoModeActive')}
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex-1 px-5 sm:px-8 py-6 max-w-xl w-full mx-auto flex flex-col gap-5"
      >
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-2">
            <MapPin className="w-4 h-4 text-teal-600" />
            {t('whereExploring')}
          </label>
          <input
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder={t('cityPlaceholder')}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-base text-stone-900 placeholder:text-stone-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            maxLength={80}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-2">
            <MapPinned className="w-4 h-4 text-teal-600" />
            {t('regionLabel')}
          </label>
          <input
            type="text"
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            placeholder={t('regionPlaceholder')}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            maxLength={80}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-2">
            <Globe2 className="w-4 h-4 text-teal-600" />
            {t('targetLanguage')}
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`rounded-xl px-2 py-2.5 text-sm font-semibold border transition ${
                  language === lang
                    ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-teal-300 hover:text-teal-700'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-2">
            <Clock className="w-4 h-4 text-teal-600" />
            {t('walkDuration')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {DURATIONS.map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDuration(mins)}
                className={`rounded-xl px-3 py-3 text-sm font-semibold border transition ${
                  duration === mins
                    ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-amber-300 hover:text-amber-700'
                }`}
              >
                {mins} {t('min')}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            {t('tourTheme')}
          </label>
          <div className="flex flex-col gap-2">
            {THEMES.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTheme(option)}
                className={`text-left rounded-xl px-4 py-3 border transition ${
                  theme === option
                    ? 'bg-orange-50 border-orange-400 ring-1 ring-orange-400'
                    : 'bg-white border-stone-200 hover:border-orange-300'
                }`}
              >
                <span
                  className={`block font-semibold text-sm ${
                    theme === option ? 'text-orange-700' : 'text-stone-700'
                  }`}
                >
                  {t(themeKeys[option].name)}
                </span>
                <span className="block text-xs text-stone-500 mt-0.5">
                  {t(themeKeys[option].desc)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-1 w-full rounded-2xl bg-teal-600 text-white font-bold py-4 text-base shadow-lg shadow-teal-900/10 disabled:opacity-50 disabled:shadow-none active:scale-[0.98] transition flex items-center justify-center gap-2 hover:bg-teal-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t('buildingHunt')}
            </>
          ) : (
            <>
              <Compass className="w-5 h-5" />
              {t('generateHunt')}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
