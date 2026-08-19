import { useState } from 'react';
import { ArrowLeft, Compass, Trophy, AlertCircle } from 'lucide-react';
import { LANGUAGE_LOCALES } from '@/types/hunt';
import { useApp } from '@/context/AppContext';
import { useAudioStory } from '@/hooks/useAudioStory';
import { StopCard, type StopState } from '@/components/StopCard';
import { CameraModal } from '@/components/CameraModal';
import type { DemoStopProgress, HuntProgressState } from '@/lib/storage';
import type { VerifyPhotoResult } from '@/lib/gemini';
import type { Theme } from '@/types/hunt';
import type { TranslationKey } from '@/lib/i18n';

function themeLabelKey(theme: Theme): TranslationKey {
  if (theme === 'Historical') return 'themeHistorical';
  if (theme === 'Foodie') return 'themeFoodie';
  return 'themeFamily';
}

interface QuestViewProps {
  progress: HuntProgressState;
  onStopsChange: (stops: DemoStopProgress[]) => void;
  onBack: () => void;
}

export function QuestView({ progress, onStopsChange, onBack }: QuestViewProps) {
  const { t } = useApp();
  const [cameraStopId, setCameraStopId] = useState<string | null>(null);

  const stops = progress.stops;
  const audio = useAudioStory();

  const firstUnverifiedIndex = stops.findIndex((stop) => !stop.isVerified);

  const verifiedCount = stops.filter((stop) => stop.isVerified).length;
  const totalCount = stops.length;
  const isComplete = totalCount > 0 && verifiedCount === totalCount;

  const locale = LANGUAGE_LOCALES[progress.language];

  const cameraStop = cameraStopId
    ? stops.find((stop) => stop.id === cameraStopId) ?? null
    : null;

  const handleVerified = (result: VerifyPhotoResult, photoUrl: string | null) => {
    if (!cameraStopId) return;
    const updated = stops.map((stop) =>
      stop.id === cameraStopId
        ? {
            ...stop,
            isVerified: true,
            verificationFeedback: result.feedback,
            photoUrl: photoUrl ?? stop.photoUrl,
            attemptCount: stop.attemptCount + 1,
          }
        : stop
    );
    onStopsChange(updated);
  };

  const handleAttemptFailed = (result: VerifyPhotoResult, photoUrl: string | null) => {
    if (!cameraStopId) return;
    const updated = stops.map((stop) =>
      stop.id === cameraStopId
        ? {
            ...stop,
            isVerified: false,
            verificationFeedback: result.feedback,
            photoUrl: photoUrl ?? stop.photoUrl,
            attemptCount: stop.attemptCount + 1,
          }
        : stop
    );
    onStopsChange(updated);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-stone-200">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition flex-shrink-0"
            aria-label={t('backToSetup')}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-stone-400 font-medium">
              {progress.isDemo && (
                <span className="text-amber-600 font-semibold">{t('demoMode')} · </span>
              )}
              {t(themeLabelKey(progress.theme))} &middot; {progress.durationMinutes} {t('min')}
            </p>
            <h1 className="text-base font-bold text-stone-900 truncate flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-teal-600 flex-shrink-0" />
              {progress.city}
            </h1>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-xs font-bold text-teal-700">
              {verifiedCount}/{totalCount}
            </p>
            <p className="text-[10px] text-stone-400 uppercase tracking-wide">{t('stops')}</p>
          </div>
        </div>
        {totalCount > 0 && (
          <div className="h-1 bg-stone-100">
            <div
              className="h-full bg-teal-500 transition-all duration-500"
              style={{ width: `${(verifiedCount / totalCount) * 100}%` }}
            />
          </div>
        )}
      </header>

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-6 flex flex-col gap-3">
        {progress.isDemo && (
          <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs text-amber-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {t('demoModeActive')}
          </div>
        )}

        {stops.map((stop, index) => {
          let state: StopState;
          if (stop.isVerified) {
            state = 'verified';
          } else if (index === firstUnverifiedIndex) {
            state = 'active';
          } else {
            state = 'locked';
          }
          return (
            <StopCard
              key={stop.id}
              stop={stop}
              state={state}
              isSpeaking={audio.speakingStopId === stop.id}
              onToggleAudio={() => audio.toggle(stop.id, stop.audioScript, locale)}
              onOpenCamera={() => setCameraStopId(stop.id)}
            />
          );
        })}

        {isComplete && (
          <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 px-6 py-8 text-center mt-3 shadow-lg shadow-teal-900/20">
            <Trophy className="w-10 h-10 text-amber-300 mx-auto mb-3" />
            <h2 className="text-white text-xl font-extrabold mb-1">{t('huntComplete')}</h2>
            <p className="text-teal-100 text-sm mb-5">
              {t('exploredAllStops', { count: totalCount, city: progress.city })}
            </p>
            <button
              onClick={onBack}
              className="bg-white text-teal-700 font-bold rounded-2xl px-6 py-3 hover:bg-teal-50 active:scale-[0.98] transition"
            >
              {t('startNewHunt')}
            </button>
          </div>
        )}
      </main>

      {cameraStop && (
        <CameraModal
          stop={cameraStop}
          onClose={() => setCameraStopId(null)}
          onVerified={handleVerified}
          onAttemptFailed={handleAttemptFailed}
        />
      )}
    </div>
  );
}
