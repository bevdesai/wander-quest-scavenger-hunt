import { useState } from 'react';
import { Lock, Volume2, Square, Camera, CheckCircle2, ChevronDown, ScrollText } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { DemoStopProgress } from '@/lib/storage';

export type StopState = 'locked' | 'active' | 'verified';

interface StopCardProps {
  stop: DemoStopProgress;
  state: StopState;
  isSpeaking: boolean;
  onToggleAudio: () => void;
  onOpenCamera: () => void;
}

export function StopCard({ stop, state, isSpeaking, onToggleAudio, onOpenCamera }: StopCardProps) {
  const { t } = useApp();
  const [expanded, setExpanded] = useState(false);

  if (state === 'locked') {
    return (
      <div className="rounded-2xl bg-stone-100 border border-stone-200 px-5 py-5 flex items-center gap-4 opacity-70">
        <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0">
          <Lock className="w-4 h-4 text-stone-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-400">
            {t('stop')} {stop.stopNumber}
          </p>
          <p className="text-xs text-stone-400">{t('unlocksAfter')}</p>
        </div>
      </div>
    );
  }

  if (state === 'verified') {
    return (
      <div className="rounded-2xl bg-white border border-emerald-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setExpanded((value) => !value)}
          className="w-full flex items-center gap-4 px-5 py-4 text-left"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
              {t('stop')} {stop.stopNumber} &middot; {t('verified')}
            </p>
            <p className="text-sm font-bold text-stone-900 truncate">{stop.landmarkName}</p>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-stone-400 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
        {expanded && (
          <div className="px-5 pb-5 flex gap-4">
            {stop.photoUrl && (
              <img
                src={stop.photoUrl}
                alt={stop.landmarkName}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="text-xs text-stone-500 leading-relaxed">{stop.riddle}</p>
              {stop.verificationFeedback && (
                <p className="text-xs text-emerald-700 mt-2 leading-relaxed">
                  {stop.verificationFeedback}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border-2 border-teal-500 shadow-lg shadow-teal-900/5 px-5 py-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-bold text-teal-700 bg-teal-50 rounded-full px-2.5 py-1">
          {t('stop')} {stop.stopNumber}
        </span>
        <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
          {t('current')}
        </span>
      </div>

      <div className="flex items-start gap-2 mb-4">
        <ScrollText className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-stone-700 leading-relaxed">{stop.riddle}</p>
      </div>

      {stop.verificationFeedback && !stop.isVerified && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5 text-xs text-amber-700 mb-3">
          {stop.verificationFeedback}
        </div>
      )}

      {stop.verificationFeedback && !stop.isVerified && stop.attemptCount > 0 && (
        <div className="rounded-xl bg-stone-50 border border-stone-200 px-3 py-2.5 text-xs text-stone-500 mb-4">
          {t('attempt')} {stop.attemptCount} &middot; {t('unlimitedRetries')}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onToggleAudio}
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold border transition ${
            isSpeaking
              ? 'bg-amber-500 border-amber-500 text-white'
              : 'bg-white border-stone-200 text-stone-700 hover:border-amber-300'
          }`}
        >
          {isSpeaking ? <Square className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          {isSpeaking ? t('stopAudio') : t('audioStory')}
        </button>
        <button
          onClick={onOpenCamera}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-teal-600 text-white px-4 py-3 text-sm font-semibold hover:bg-teal-700 active:scale-[0.98] transition"
        >
          <Camera className="w-4 h-4" />
          {t('verifyLocation')}
        </button>
      </div>
    </div>
  );
}
