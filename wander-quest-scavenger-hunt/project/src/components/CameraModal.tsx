import { useRef, useState } from 'react';
import { X, Camera, ImagePlus, Loader2, RotateCcw, CheckCircle2, XCircle, Lightbulb, ImageIcon } from 'lucide-react';
import { resizeImageFile } from '@/lib/image';
import { verifyPhotoViaGemini, type VerifyPhotoResult } from '@/lib/gemini';
import { useApp } from '@/context/AppContext';
import type { DemoStopProgress } from '@/lib/storage';
import { getSamplePhotoForStop } from '@/lib/mockData';

interface CameraModalProps {
  stop: DemoStopProgress;
  onClose: () => void;
  onVerified: (result: VerifyPhotoResult, photoUrl: string | null) => void;
  onAttemptFailed: (result: VerifyPhotoResult, photoUrl: string | null) => void;
}

type Phase = 'capture' | 'preview' | 'verifying' | 'result';

export function CameraModal({ stop, onClose, onVerified, onAttemptFailed }: CameraModalProps) {
  const { t, demoMode, apiKey, language } = useApp();
  const [phase, setPhase] = useState<Phase>('capture');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [selectedBase64, setSelectedBase64] = useState<string | null>(null);
  const [result, setResult] = useState<VerifyPhotoResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const libraryInputRef = useRef<HTMLInputElement>(null);

  const handleFileChosen = (file: File | undefined) => {
    if (!file) return;
    setSelectedFile(file);
    setSelectedPhotoUrl(null);
    setSelectedBase64(null);
    setPreviewUrl(URL.createObjectURL(file));
    setPhase('preview');
    setError(null);
  };

  const handleDemoSamplePhoto = async () => {
    const sampleUrl = getSamplePhotoForStop(stop.id);
    try {
      const response = await fetch(sampleUrl);
      const blob = await response.blob();
      const file = new File([blob], 'sample.jpg', { type: 'image/jpeg' });
      setSelectedFile(file);
      setSelectedPhotoUrl(sampleUrl);
      setSelectedBase64(null);
      setPreviewUrl(sampleUrl);
      setPhase('preview');
      setError(null);
    } catch {
      setError('Could not load sample photo. Please try uploading one instead.');
    }
  };

  const handleRetake = () => {
    setSelectedFile(null);
    setSelectedPhotoUrl(null);
    setSelectedBase64(null);
    setPreviewUrl(null);
    setResult(null);
    setPhase('capture');
    setError(null);
  };

  const handleVerify = async () => {
    if (!selectedFile && !selectedPhotoUrl) return;
    setPhase('verifying');
    setError(null);

    try {
      let base64 = selectedBase64;
      let mimeType = 'image/jpeg';

      if (!base64) {
        if (selectedFile) {
          const processed = await resizeImageFile(selectedFile);
          base64 = processed.base64;
          mimeType = processed.mimeType;
          setSelectedBase64(base64);
        } else if (selectedPhotoUrl) {
          const response = await fetch(selectedPhotoUrl);
          const blob = await response.blob();
          const processed = await resizeImageFile(new File([blob], 'sample.jpg', { type: blob.type }));
          base64 = processed.base64;
          mimeType = processed.mimeType;
          setSelectedBase64(base64);
        }
      }

      if (!base64) {
        throw new Error('Could not process the image.');
      }

      const photoUrl = selectedPhotoUrl ?? null;

      if (demoMode) {
        // In demo mode, the sample photo always matches, other photos get a mock response
        const isSample = selectedPhotoUrl !== null;
        const mockResult: VerifyPhotoResult = isSample
          ? {
              match: true,
              feedback: 'Great shot! I can see the landmark clearly. Spot confirmed!',
              missingFeatures: null,
            }
          : {
              match: false,
              feedback: 'This doesn\'t quite look like the target. Try the sample photo in demo mode to see a successful verification!',
              missingFeatures: stop.targetVisualDescription.slice(0, 80) + '...',
            };
        setResult(mockResult);
        setPhase('result');
        if (mockResult.match) {
          onVerified(mockResult, photoUrl);
        } else {
          onAttemptFailed(mockResult, photoUrl);
        }
        return;
      }

      if (!apiKey) {
        throw new Error(t('apiKeyMissingMessage'));
      }

      const verification = await verifyPhotoViaGemini({
        apiKey,
        landmarkName: stop.landmarkName,
        targetVisualDescription: stop.targetVisualDescription,
        imageBase64: base64,
        mimeType,
        language,
        attemptCount: stop.attemptCount + 1,
      });

      setResult(verification);
      setPhase('result');
      if (verification.match) {
        onVerified(verification, photoUrl);
      } else {
        onAttemptFailed(verification, photoUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setPhase('preview');
    }
  };

  const handleDone = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 sticky top-0 bg-white z-10">
          <h3 className="font-bold text-stone-900 text-lg">{t('verifyLocationTitle')}</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 pb-6">
          {phase === 'capture' && (
            <>
              <p className="text-sm text-stone-500 mb-5">
                {t('snapOrUpload')}
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-teal-600 text-white font-semibold py-4 hover:bg-teal-700 active:scale-[0.98] transition"
                >
                  <Camera className="w-5 h-5" />
                  {t('takePhoto')}
                </button>
                <button
                  onClick={() => libraryInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-stone-100 text-stone-700 font-semibold py-4 hover:bg-stone-200 active:scale-[0.98] transition"
                >
                  <ImagePlus className="w-5 h-5" />
                  {t('uploadFromLibrary')}
                </button>
                {demoMode && (
                  <button
                    onClick={handleDemoSamplePhoto}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-amber-50 border border-amber-300 text-amber-700 font-semibold py-3.5 hover:bg-amber-100 active:scale-[0.98] transition"
                  >
                    <ImageIcon className="w-5 h-5" />
                    {t('usingDemoData')} — {t('takePhoto')}
                  </button>
                )}
              </div>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(event) => handleFileChosen(event.target.files?.[0])}
              />
              <input
                ref={libraryInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleFileChosen(event.target.files?.[0])}
              />
            </>
          )}

          {(phase === 'preview' || phase === 'verifying') && previewUrl && (
            <>
              <div className="rounded-2xl overflow-hidden bg-stone-100 mb-4 aspect-[4/3]">
                <img src={previewUrl} alt="" className="w-full h-full object-cover" />
              </div>
              {error && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700 mb-4">
                  {error}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={handleRetake}
                  disabled={phase === 'verifying'}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-stone-100 text-stone-700 font-semibold py-3.5 px-4 hover:bg-stone-200 transition disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t('retake')}
                </button>
                <button
                  onClick={handleVerify}
                  disabled={phase === 'verifying'}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-teal-600 text-white font-semibold py-3.5 hover:bg-teal-700 active:scale-[0.98] transition disabled:opacity-70"
                >
                  {phase === 'verifying' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('checkingPhoto')}
                    </>
                  ) : (
                    t('verifyThisPhoto')
                  )}
                </button>
              </div>
            </>
          )}

          {phase === 'result' && result && previewUrl && (
            <>
              <div className="rounded-2xl overflow-hidden bg-stone-100 mb-4 aspect-[4/3]">
                <img src={previewUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <div
                className={`flex items-start gap-3 rounded-2xl px-4 py-4 mb-3 ${
                  result.match
                    ? 'bg-emerald-50 border border-emerald-200'
                    : 'bg-amber-50 border border-amber-200'
                }`}
              >
                {result.match ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p
                    className={`font-bold text-sm mb-1 ${
                      result.match ? 'text-emerald-800' : 'text-amber-800'
                    }`}
                  >
                    {result.match ? t('spotConfirmed') : t('notQuite')}
                  </p>
                  <p className={`text-sm ${result.match ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {result.feedback}
                  </p>
                </div>
              </div>

              {!result.match && result.missingFeatures && (
                <div className="flex items-start gap-2 rounded-xl bg-stone-50 border border-stone-200 px-4 py-3 text-xs text-stone-600 mb-4">
                  <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-700">
                      {t('missingFeatures', { features: result.missingFeatures })}
                    </span>
                  </div>
                </div>
              )}

              {!result.match && (
                <p className="text-xs text-stone-400 text-center mb-4">{t('unlimitedRetries')}</p>
              )}

              {result.match ? (
                <button
                  onClick={handleDone}
                  className="w-full rounded-2xl bg-teal-600 text-white font-semibold py-3.5 hover:bg-teal-700 active:scale-[0.98] transition"
                >
                  {t('continueHunt')}
                </button>
              ) : (
                <button
                  onClick={handleRetake}
                  className="w-full rounded-2xl bg-stone-800 text-white font-semibold py-3.5 hover:bg-stone-900 active:scale-[0.98] transition"
                >
                  {t('tryAnotherPhoto')}
                </button>
              )}
            </>
          )}

          {phase === 'capture' && (
            <p className="text-xs text-stone-400 mt-4 text-center">
              {t('reminder')}: {stop.riddle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
