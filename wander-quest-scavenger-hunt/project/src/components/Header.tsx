import { useState } from 'react';
import { KeyRound, FlaskConical, X, Check, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function Header() {
  const { t, demoMode, setDemoMode, apiKey, setApiKey } = useApp();
  const [showApiModal, setShowApiModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200">
        <div className="max-w-xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm font-extrabold tracking-tight text-teal-800">
              {t('appName')}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setDemoMode(!demoMode)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition ${
                demoMode
                  ? 'bg-amber-500 border-amber-500 text-white'
                  : 'bg-white border-stone-200 text-stone-500 hover:border-amber-300 hover:text-amber-600'
              }`}
              title={t('demoModeInfo')}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              {t('demoMode')}
            </button>

            <button
              onClick={() => setShowApiModal(true)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition ${
                apiKey
                  ? 'bg-teal-50 border-teal-300 text-teal-700'
                  : 'bg-white border-stone-200 text-stone-500 hover:border-teal-300 hover:text-teal-600'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              {apiKey ? t('apiKeySaved') : t('apiKey')}
            </button>
          </div>
        </div>
      </header>

      {showApiModal && (
        <ApiKeyModal
          currentKey={apiKey}
          onSave={(key) => {
            setApiKey(key);
            setShowApiModal(false);
          }}
          onClear={() => {
            setApiKey(null);
            setShowApiModal(false);
          }}
          onClose={() => setShowApiModal(false)}
        />
      )}
    </>
  );
}

interface ApiKeyModalProps {
  currentKey: string | null;
  onSave: (key: string) => void;
  onClear: () => void;
  onClose: () => void;
}

function ApiKeyModal({ currentKey, onSave, onClear, onClose }: ApiKeyModalProps) {
  const { t } = useApp();
  const [value, setValue] = useState(currentKey ?? '');
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      onSave(trimmed);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-stone-900 text-lg">{t('apiKeyTitle')}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 pb-6">
          <p className="text-sm text-stone-500 leading-relaxed mb-4">
            {t('apiKeyDescription')}
          </p>

          <div className="relative mb-4">
            <input
              type={showKey ? 'text' : 'password'}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={t('apiKeyPlaceholder')}
              className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3.5 pr-12 text-sm text-stone-900 placeholder:text-stone-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-600 transition"
              aria-label={showKey ? 'Hide' : 'Show'}
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex gap-2">
            {currentKey && (
              <button
                onClick={onClear}
                className="flex items-center justify-center gap-1.5 rounded-2xl bg-rose-50 text-rose-600 font-semibold px-4 py-3 text-sm hover:bg-rose-100 transition"
              >
                <Trash2 className="w-4 h-4" />
                {t('clear')}
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 rounded-2xl bg-stone-100 text-stone-600 font-semibold py-3 text-sm hover:bg-stone-200 transition"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={value.trim().length === 0}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-teal-600 text-white font-semibold py-3 text-sm hover:bg-teal-700 active:scale-[0.98] transition disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {t('save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
