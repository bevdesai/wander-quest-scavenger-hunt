import { useCallback, useEffect, useRef, useState } from 'react';
import { Compass, AlertCircle } from 'lucide-react';
import type { Language, Theme, DurationMinutes } from '@/types/hunt';
import { AppProvider, useApp } from '@/context/AppContext';
import { SetupScreen } from '@/components/SetupScreen';
import { GeneratingScreen } from '@/components/GeneratingScreen';
import { QuestView } from '@/components/QuestView';
import { Header } from '@/components/Header';
import { generateHuntViaGemini } from '@/lib/gemini';
import { createMockHunt } from '@/lib/mockData';
import {
  saveHuntProgress,
  loadHuntProgress,
  clearHuntProgress,
  type HuntProgressState,
  type DemoStopProgress,
} from '@/lib/storage';

type AppState =
  | { phase: 'setup' }
  | { phase: 'generating'; city: string }
  | { phase: 'quest' }
  | { phase: 'failed'; message: string };

interface GenerateParams {
  city: string;
  region?: string;
  language: Language;
  durationMinutes: DurationMinutes;
  theme: Theme;
}

function AppContent() {
  const { t, demoMode, apiKey, language } = useApp();
  const [state, setState] = useState<AppState>({ phase: 'setup' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState<HuntProgressState | null>(null);
  const restoreAttempted = useRef(false);

  // Restore saved hunt progress on mount
  useEffect(() => {
    if (restoreAttempted.current) return;
    restoreAttempted.current = true;
    const saved = loadHuntProgress();
    if (saved && saved.stops.length > 0) {
      setProgress(saved);
      setState({ phase: 'quest' });
    }
  }, []);

  const persistProgress = useCallback((stops: DemoStopProgress[]) => {
    setProgress((current) => {
      if (!current) return current;
      const updated = { ...current, stops, savedAt: Date.now() };
      saveHuntProgress(updated);
      return updated;
    });
  }, []);

  const handleGenerate = useCallback(
    async (params: GenerateParams) => {
      setIsGenerating(true);
      setErrorMessage(null);

      if (demoMode) {
        // Demo mode: load mock data after a short delay for UX
        setState({ phase: 'generating', city: params.city });
        setTimeout(() => {
          const mockStops = createMockHunt({
            city: params.city,
            language: params.language,
            durationMinutes: params.durationMinutes,
            theme: params.theme,
          });
          const newProgress: HuntProgressState = {
            huntId: `demo-${Date.now()}`,
            city: params.city,
            language: params.language,
            durationMinutes: params.durationMinutes,
            theme: params.theme,
            isDemo: true,
            stops: mockStops,
            savedAt: Date.now(),
          };
          saveHuntProgress(newProgress);
          setProgress(newProgress);
          setState({ phase: 'quest' });
          setIsGenerating(false);
        }, 2500);
        return;
      }

      if (!apiKey) {
        setIsGenerating(false);
        setErrorMessage(t('apiKeyMissingMessage'));
        return;
      }

      setState({ phase: 'generating', city: params.city });

      try {
        const result = await generateHuntViaGemini({
          city: params.city,
          region: params.region,
          language: params.language,
          durationMinutes: params.durationMinutes,
          theme: params.theme,
          apiKey,
        });

        const stops: DemoStopProgress[] = result.stops.map((stop, index) => ({
          id: `hunt-${Date.now()}-${index}`,
          stopNumber: stop.stopNumber ?? index + 1,
          landmarkName: stop.landmarkName,
          riddle: stop.riddle,
          audioScript: stop.audioScript,
          targetVisualDescription: stop.targetVisualDescription,
          photoUrl: null,
          isVerified: false,
          verificationFeedback: null,
          attemptCount: 0,
        }));

        const newProgress: HuntProgressState = {
          huntId: `hunt-${Date.now()}`,
          city: params.city,
          language: params.language,
          durationMinutes: params.durationMinutes,
          theme: params.theme,
          isDemo: false,
          stops,
          savedAt: Date.now(),
        };
        saveHuntProgress(newProgress);
        setProgress(newProgress);
        setState({ phase: 'quest' });
        setIsGenerating(false);
      } catch (err) {
        setIsGenerating(false);
        setState({
          phase: 'failed',
          message: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
        });
      }
    },
    [demoMode, apiKey, t]
  );

  const handleBackToSetup = useCallback(() => {
    clearHuntProgress();
    setProgress(null);
    setState({ phase: 'setup' });
    setIsGenerating(false);
    setErrorMessage(null);
  }, []);

  if (state.phase === 'generating') {
    return <GeneratingScreen city={state.city} />;
  }

  if (state.phase === 'failed') {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="rounded-2xl bg-white border border-stone-200 px-6 py-8 max-w-sm shadow-sm">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-4" />
            <p className="text-stone-900 font-bold text-lg mb-2">{t('couldNotBuildHunt')}</p>
            <p className="text-stone-500 text-sm mb-5">{state.message}</p>
            <button
              onClick={handleBackToSetup}
              className="bg-teal-600 text-white font-semibold rounded-2xl px-6 py-3 hover:bg-teal-700 active:scale-[0.98] transition"
            >
              {t('tryAgain')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state.phase === 'quest' && progress) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <QuestView
          progress={progress}
          onStopsChange={persistProgress}
          onBack={handleBackToSetup}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <SetupScreen
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        errorMessage={errorMessage}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
