import { useCallback, useEffect, useRef, useState } from 'react';

export function useAudioStory() {
  const [speakingStopId, setSpeakingStopId] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeakingStopId(null);
  }, []);

  const play = useCallback((stopId: string, text: string, locale: string) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale;

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((voice) => voice.lang === locale)
      ?? voices.find((voice) => voice.lang.startsWith(locale.split('-')[0]));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => setSpeakingStopId(null);
    utterance.onerror = () => setSpeakingStopId(null);

    utteranceRef.current = utterance;
    setSpeakingStopId(stopId);
    window.speechSynthesis.speak(utterance);
  }, []);

  const toggle = useCallback(
    (stopId: string, text: string, locale: string) => {
      if (speakingStopId === stopId) {
        stop();
      } else {
        play(stopId, text, locale);
      }
    },
    [speakingStopId, play, stop]
  );

  return { speakingStopId, toggle, stop };
}
