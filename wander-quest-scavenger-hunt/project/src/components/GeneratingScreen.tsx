import { useEffect, useState } from 'react';
import { Compass, MapPin, ScrollText, Camera } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { TranslationKey } from '@/lib/i18n';

const MESSAGE_KEYS: TranslationKey[] = [
  'scoutingLandmarks',
  'writingRiddles',
  'plottingRoute',
  'preparingVerification',
];

const MESSAGE_ICONS = [MapPin, ScrollText, Compass, Camera];

export function GeneratingScreen({ city }: { city: string }) {
  const { t } = useApp();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((current) => (current + 1) % MESSAGE_KEYS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const Icon = MESSAGE_ICONS[step];

  return (
    <div className="min-h-screen bg-teal-900 flex flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-teal-400/40 animate-pulse-ring" />
        <div className="relative w-20 h-20 rounded-full bg-teal-700 flex items-center justify-center ring-4 ring-teal-600/50">
          <Icon className="w-9 h-9 text-amber-300" strokeWidth={2} />
        </div>
      </div>
      <h2 className="text-white text-xl font-bold mb-2">{t('craftingHunt', { city })}</h2>
      <p className="text-teal-200 text-sm transition-opacity duration-500">
        {t(MESSAGE_KEYS[step])}
      </p>
    </div>
  );
}
