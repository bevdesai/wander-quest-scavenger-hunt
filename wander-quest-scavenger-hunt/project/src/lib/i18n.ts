import type { Language } from '@/types/hunt';

export type TranslationKey =
  | 'appName'
  | 'tagline'
  | 'whereExploring'
  | 'cityPlaceholder'
  | 'regionLabel'
  | 'regionPlaceholder'
  | 'targetLanguage'
  | 'walkDuration'
  | 'tourTheme'
  | 'themeHistorical'
  | 'themeFoodie'
  | 'themeFamily'
  | 'themeHistoricalDesc'
  | 'themeFoodieDesc'
  | 'themeFamilyDesc'
  | 'generateHunt'
  | 'buildingHunt'
  | 'scoutingLandmarks'
  | 'writingRiddles'
  | 'plottingRoute'
  | 'preparingVerification'
  | 'craftingHunt'
  | 'backToSetup'
  | 'stops'
  | 'loadingStops'
  | 'couldNotLoadHunt'
  | 'huntComplete'
  | 'exploredAllStops'
  | 'startNewHunt'
  | 'stop'
  | 'current'
  | 'verified'
  | 'unlocksAfter'
  | 'audioStory'
  | 'stopAudio'
  | 'verifyLocation'
  | 'verifyLocationTitle'
  | 'snapOrUpload'
  | 'takePhoto'
  | 'uploadFromLibrary'
  | 'retake'
  | 'verifyThisPhoto'
  | 'checkingPhoto'
  | 'spotConfirmed'
  | 'notQuite'
  | 'continueHunt'
  | 'tryAnotherPhoto'
  | 'reminder'
  | 'couldNotStartHunt'
  | 'couldNotBuildHunt'
  | 'tryAgain'
  | 'demoMode'
  | 'apiKey'
  | 'apiKeyTitle'
  | 'apiKeyDescription'
  | 'apiKeyPlaceholder'
  | 'save'
  | 'cancel'
  | 'clear'
  | 'apiKeySaved'
  | 'apiKeyMissing'
  | 'apiKeyMissingMessage'
  | 'demoModeActive'
  | 'demoModeInfo'
  | 'usingDemoData'
  | 'min'
  | 'photoHint'
  | 'missingFeatures'
  | 'attempt'
  | 'attemptsLeft'
  | 'unlimitedRetries'
  | 'demoCityLabel';

type TranslationDictionary = Record<TranslationKey, string>;

const translations: Record<Language, TranslationDictionary> = {
  English: {
    appName: 'Wander Quest',
    tagline: 'Turn any city into a scavenger hunt',
    whereExploring: 'Where are you exploring?',
    cityPlaceholder: 'e.g. Kyoto, Lisbon, Brooklyn...',
    regionLabel: 'Region / County / State (optional)',
    regionPlaceholder: 'e.g. Andalusia, Bavaria, Oregon...',
    targetLanguage: 'Target language',
    walkDuration: 'Walk duration',
    tourTheme: 'Tour theme',
    themeHistorical: 'Historical',
    themeFoodie: 'Foodie',
    themeFamily: 'Family-Friendly',
    themeHistoricalDesc: 'Legends, landmarks & the past',
    themeFoodieDesc: 'Markets, bites & local flavor',
    themeFamilyDesc: 'Easy stops, fun for all ages',
    generateHunt: 'Generate My Hunt',
    buildingHunt: 'Building your hunt...',
    scoutingLandmarks: 'Scouting landmarks around your city...',
    writingRiddles: 'Writing cryptic riddles...',
    plottingRoute: 'Plotting the best walking route...',
    preparingVerification: 'Preparing photo verification...',
    craftingHunt: 'Crafting your hunt in {city}',
    backToSetup: 'Back to setup',
    stops: 'stops',
    loadingStops: 'Loading your stops...',
    couldNotLoadHunt: 'Could not load your hunt.',
    huntComplete: 'Hunt Complete!',
    exploredAllStops: 'You explored all {count} stops of {city}. Well done!',
    startNewHunt: 'Start a New Hunt',
    stop: 'Stop',
    current: 'Current',
    verified: 'Verified',
    unlocksAfter: 'Unlocks after the previous stop',
    audioStory: 'Audio Story',
    stopAudio: 'Stop',
    verifyLocation: 'Verify Location',
    verifyLocationTitle: 'Verify Location',
    snapOrUpload: 'Snap or upload a photo that shows the landmark from this clue.',
    takePhoto: 'Take a Photo',
    uploadFromLibrary: 'Upload from Library',
    retake: 'Retake',
    verifyThisPhoto: 'Verify This Photo',
    checkingPhoto: 'Checking photo...',
    spotConfirmed: 'Spot confirmed!',
    notQuite: 'Not quite there yet',
    continueHunt: 'Continue the Hunt',
    tryAnotherPhoto: 'Try Another Photo',
    reminder: 'Reminder',
    couldNotStartHunt: 'Could not start a new hunt. Please try again.',
    couldNotBuildHunt: 'Could not build your hunt',
    tryAgain: 'Try Again',
    demoMode: 'Demo',
    apiKey: 'API Key',
    apiKeyTitle: 'Google AI Studio API Key',
    apiKeyDescription: 'Paste your Gemini API key from Google AI Studio. It stays in your browser only — nothing is sent to our servers.',
    apiKeyPlaceholder: 'AIza...',
    save: 'Save',
    cancel: 'Cancel',
    clear: 'Clear',
    apiKeySaved: 'API key saved',
    apiKeyMissing: 'No API Key',
    apiKeyMissingMessage: 'Add your Google AI Studio API key to generate real hunts, or turn on Demo Mode to try the app with sample data.',
    demoModeActive: 'Demo mode is on — using sample hunt data.',
    demoModeInfo: 'Demo mode loads a pre-built hunt so you can explore the app without an API key.',
    usingDemoData: 'Using demo data',
    min: 'min',
    photoHint: 'Hint: {hint}',
    missingFeatures: 'Missing: {features}',
    attempt: 'Attempt',
    attemptsLeft: 'Unlimited retries',
    unlimitedRetries: 'Unlimited retries — keep trying!',
    demoCityLabel: 'Choose a demo city',
  },
  Spanish: {
    appName: 'Wander Quest',
    tagline: 'Convierte cualquier ciudad en una caza del tesoro',
    whereExploring: '¿Dónde estás explorando?',
    cityPlaceholder: 'p. ej. Kioto, Lisboa, Brooklyn...',
    regionLabel: 'Región / Provincia / Estado (opcional)',
    regionPlaceholder: 'p. ej. Andalucía, Baviera, Oregón...',
    targetLanguage: 'Idioma objetivo',
    walkDuration: 'Duración del recorrido',
    tourTheme: 'Tema del tour',
    themeHistorical: 'Histórico',
    themeFoodie: 'Gastronómico',
    themeFamily: 'Familiar',
    themeHistoricalDesc: 'Leyendas, monumentos y el pasado',
    themeFoodieDesc: 'Mercados, bocados y sabores locales',
    themeFamilyDesc: 'Paradas fáciles, diversión para todos',
    generateHunt: 'Generar Mi Caza',
    buildingHunt: 'Creando tu caza...',
    scoutingLandmarks: 'Buscando monumentos en tu ciudad...',
    writingRiddles: 'Escribiendo acertijos crípticos...',
    plottingRoute: 'Trazando la mejor ruta a pie...',
    preparingVerification: 'Preparando la verificación de fotos...',
    craftingHunt: 'Creando tu caza en {city}',
    backToSetup: 'Volver al inicio',
    stops: 'paradas',
    loadingStops: 'Cargando tus paradas...',
    couldNotLoadHunt: 'No se pudo cargar tu caza.',
    huntComplete: '¡Caza Completada!',
    exploredAllStops: 'Exploraste las {count} paradas de {city}. ¡Bien hecho!',
    startNewHunt: 'Iniciar Nueva Caza',
    stop: 'Parada',
    current: 'Actual',
    verified: 'Verificada',
    unlocksAfter: 'Se desbloquea tras la parada anterior',
    audioStory: 'Historia de Audio',
    stopAudio: 'Detener',
    verifyLocation: 'Verificar Ubicación',
    verifyLocationTitle: 'Verificar Ubicación',
    snapOrUpload: 'Toma o sube una foto que muestre el monumento de esta pista.',
    takePhoto: 'Tomar una Foto',
    uploadFromLibrary: 'Subir de la Galería',
    retake: 'Volver a Tomar',
    verifyThisPhoto: 'Verificar Esta Foto',
    checkingPhoto: 'Comprobando foto...',
    spotConfirmed: '¡Lugar confirmado!',
    notQuite: 'Aún no del todo',
    continueHunt: 'Continuar la Caza',
    tryAnotherPhoto: 'Probar Otra Foto',
    reminder: 'Recordatorio',
    couldNotStartHunt: 'No se pudo iniciar una nueva caza. Inténtalo de nuevo.',
    couldNotBuildHunt: 'No se pudo crear tu caza',
    tryAgain: 'Intentar de Nuevo',
    demoMode: 'Demo',
    apiKey: 'Clave API',
    apiKeyTitle: 'Clave API de Google AI Studio',
    apiKeyDescription: 'Pega tu clave API de Gemini de Google AI Studio. Se guarda solo en tu navegador — no se envía a ningún servidor.',
    apiKeyPlaceholder: 'AIza...',
    save: 'Guardar',
    cancel: 'Cancelar',
    clear: 'Borrar',
    apiKeySaved: 'Clave API guardada',
    apiKeyMissing: 'Sin Clave API',
    apiKeyMissingMessage: 'Añade tu clave API de Google AI Studio para generar cazas reales, o activa el Modo Demo para probar la app con datos de ejemplo.',
    demoModeActive: 'Modo demo activado — usando datos de caza de ejemplo.',
    demoModeInfo: 'El modo demo carga una caza precreada para que puedas explorar la app sin clave API.',
    usingDemoData: 'Usando datos demo',
    min: 'min',
    photoHint: 'Pista: {hint}',
    missingFeatures: 'Falta: {features}',
    attempt: 'Intento',
    attemptsLeft: 'Reintentos ilimitados',
    unlimitedRetries: '¡Reintentos ilimitados — sigue intentando!',
    demoCityLabel: 'Elige una ciudad demo',
  },
  French: {
    appName: 'Wander Quest',
    tagline: 'Transformez n\'importe quelle ville en chasse au trésor',
    whereExploring: 'Où explorez-vous ?',
    cityPlaceholder: 'ex. Kyoto, Lisbonne, Brooklyn...',
    regionLabel: 'Région / Département / État (facultatif)',
    regionPlaceholder: 'ex. Andalousie, Bavière, Oregon...',
    targetLanguage: 'Langue cible',
    walkDuration: 'Durée de la marche',
    tourTheme: 'Thème du circuit',
    themeHistorical: 'Historique',
    themeFoodie: 'Gastronomique',
    themeFamily: 'Familial',
    themeHistoricalDesc: 'Légendes, monuments et le passé',
    themeFoodieDesc: 'Marchés, bouchées et saveurs locales',
    themeFamilyDesc: 'Arrêts faciles, amusant pour tous',
    generateHunt: 'Générer Ma Chasse',
    buildingHunt: 'Création de votre chasse...',
    scoutingLandmarks: 'Repérage de monuments dans votre ville...',
    writingRiddles: 'Écriture d\'énigmes cryptiques...',
    plottingRoute: 'Tracé du meilleur itinéraire à pied...',
    preparingVerification: 'Préparation de la vérification photo...',
    craftingHunt: 'Création de votre chasse à {city}',
    backToSetup: 'Retour à la configuration',
    stops: 'arrêts',
    loadingStops: 'Chargement de vos arrêts...',
    couldNotLoadHunt: 'Impossible de charger votre chasse.',
    huntComplete: 'Chasse Terminée !',
    exploredAllStops: 'Vous avez exploré les {count} arrêts de {city}. Bravo !',
    startNewHunt: 'Nouvelle Chasse',
    stop: 'Arrêt',
    current: 'Actuel',
    verified: 'Vérifié',
    unlocksAfter: 'Se débloque après l\'arrêt précédent',
    audioStory: 'Histoire Audio',
    stopAudio: 'Arrêter',
    verifyLocation: 'Vérifier l\'Emplacement',
    verifyLocationTitle: 'Vérifier l\'Emplacement',
    snapOrUpload: 'Prenez ou téléchargez une photo montrant le monument de cet indice.',
    takePhoto: 'Prendre une Photo',
    uploadFromLibrary: 'Importer de la Galerie',
    retake: 'Reprendre',
    verifyThisPhoto: 'Vérifier Cette Photo',
    checkingPhoto: 'Vérification de la photo...',
    spotConfirmed: 'Emplacement confirmé !',
    notQuite: 'Pas tout à fait',
    continueHunt: 'Continuer la Chasse',
    tryAnotherPhoto: 'Essayer une Autre Photo',
    reminder: 'Rappel',
    couldNotStartHunt: 'Impossible de démarrer une nouvelle chasse. Réessayez.',
    couldNotBuildHunt: 'Impossible de créer votre chasse',
    tryAgain: 'Réessayer',
    demoMode: 'Démo',
    apiKey: 'Clé API',
    apiKeyTitle: 'Clé API Google AI Studio',
    apiKeyDescription: 'Collez votre clé API Gemini de Google AI Studio. Elle reste dans votre navigateur uniquement — rien n\'est envoyé à nos serveurs.',
    apiKeyPlaceholder: 'AIza...',
    save: 'Enregistrer',
    cancel: 'Annuler',
    clear: 'Effacer',
    apiKeySaved: 'Clé API enregistrée',
    apiKeyMissing: 'Pas de Clé API',
    apiKeyMissingMessage: 'Ajoutez votre clé API Google AI Studio pour générer de vraies chasses, ou activez le Mode Démo pour essayer l\'app avec des données d\'exemple.',
    demoModeActive: 'Mode démo activé — utilisation de données d\'exemple.',
    demoModeInfo: 'Le mode démo charge une chasse précréée pour explorer l\'app sans clé API.',
    usingDemoData: 'Données démo',
    min: 'min',
    photoHint: 'Indice : {hint}',
    missingFeatures: 'Manque : {features}',
    attempt: 'Tentative',
    attemptsLeft: 'Tentatives illimitées',
    unlimitedRetries: 'Tentatives illimitées — continuez !',
    demoCityLabel: 'Choisissez une ville démo',
  },
  Japanese: {
    appName: 'Wander Quest',
    tagline: 'どんな街もスカベンジャーハントに変えよう',
    whereExploring: 'どこを探索しますか？',
    cityPlaceholder: '例：京都、リスボン、ブルックリン...',
    regionLabel: '地域 / 県 / 州（任意）',
    regionPlaceholder: '例：アンダルシア、バイエルン、オレゴン...',
    targetLanguage: '対象言語',
    walkDuration: '散歩時間',
    tourTheme: 'ツアーテーマ',
    themeHistorical: '歴史',
    themeFoodie: 'グルメ',
    themeFamily: 'ファミリー',
    themeHistoricalDesc: '伝説、ランドマークと歴史',
    themeFoodieDesc: '市場、味と地元の風味',
    themeFamilyDesc: '簡単なスポット、全員が楽しめる',
    generateHunt: 'ハントを生成',
    buildingHunt: 'ハントを作成中...',
    scoutingLandmarks: '街のランドマークを調査中...',
    writingRiddles: '暗号のような謎を書いています...',
    plottingRoute: '最適な徒歩ルートを計画中...',
    preparingVerification: '写真認証を準備中...',
    craftingHunt: '{city}のハントを作成中',
    backToSetup: 'セットアップに戻る',
    stops: 'スポット',
    loadingStops: 'スポットを読み込み中...',
    couldNotLoadHunt: 'ハントを読み込めませんでした。',
    huntComplete: 'ハント完了！',
    exploredAllStops: '{city}の{count}スポットすべてを探索しました。おめでとう！',
    startNewHunt: '新しいハントを開始',
    stop: 'スポット',
    current: '現在',
    verified: '確認済み',
    unlocksAfter: '前のスポット完了後に解除',
    audioStory: '音声ストーリー',
    stopAudio: '停止',
    verifyLocation: '場所を確認',
    verifyLocationTitle: '場所を確認',
    snapOrUpload: 'この手がかりのランドマークが写る写真を撮るかアップロードしてください。',
    takePhoto: '写真を撮る',
    uploadFromLibrary: 'ライブラリからアップロード',
    retake: '撮り直す',
    verifyThisPhoto: 'この写真を確認',
    checkingPhoto: '写真を確認中...',
    spotConfirmed: 'スポット確認！',
    notQuite: 'まだちょっと違います',
    continueHunt: 'ハントを続ける',
    tryAnotherPhoto: '別の写真を試す',
    reminder: 'リマインダー',
    couldNotStartHunt: '新しいハントを開始できませんでした。もう一度お試しください。',
    couldNotBuildHunt: 'ハントを作成できませんでした',
    tryAgain: 'もう一度試す',
    demoMode: 'デモ',
    apiKey: 'APIキー',
    apiKeyTitle: 'Google AI Studio APIキー',
    apiKeyDescription: 'Google AI StudioのGemini APIキーを貼り付けてください。ブラウザにのみ保存され、サーバーには送信されません。',
    apiKeyPlaceholder: 'AIza...',
    save: '保存',
    cancel: 'キャンセル',
    clear: 'クリア',
    apiKeySaved: 'APIキーを保存しました',
    apiKeyMissing: 'APIキーなし',
    apiKeyMissingMessage: '実際のハントを生成するにはGoogle AI Studio APIキーを追加するか、デモモードをオンにしてサンプルデータでアプリを試してください。',
    demoModeActive: 'デモモードオン — サンプルハントデータを使用中。',
    demoModeInfo: 'デモモードは事前作成のハントを読み込み、APIキーなしでアプリを試せます。',
    usingDemoData: 'デモデータ使用中',
    min: '分',
    photoHint: 'ヒント：{hint}',
    missingFeatures: '不足：{features}',
    attempt: '試行',
    attemptsLeft: '無制限再試行',
    unlimitedRetries: '無制限再試行 — 続けて！',
    demoCityLabel: 'デモ都市を選択',
  },
  German: {
    appName: 'Wander Quest',
    tagline: 'Verwandle jede Stadt in eine Schatzsuche',
    whereExploring: 'Wo explorierst du?',
    cityPlaceholder: 'z. B. Kyoto, Lissabon, Brooklyn...',
    regionLabel: 'Region / Landkreis / Bundesland (optional)',
    regionPlaceholder: 'z. B. Andalusien, Bayern, Oregon...',
    targetLanguage: 'Zielsprache',
    walkDuration: 'Spaziergangsdauer',
    tourTheme: 'Tour-Thema',
    themeHistorical: 'Historisch',
    themeFoodie: 'Foodie',
    themeFamily: 'Familienfreundlich',
    themeHistoricalDesc: 'Legenden, Wahrzeichen & Vergangenheit',
    themeFoodieDesc: 'Märkte, Häppchen & lokale Aromen',
    themeFamilyDesc: 'Einfache Stopps, Spaß für alle',
    generateHunt: 'Schnitzeljagd Generieren',
    buildingHunt: 'Schnitzeljagd wird erstellt...',
    scoutingLandmarks: 'Wahrzeichen in deiner Stadt werden gesucht...',
    writingRiddles: 'Kryptische Rätsel werden geschrieben...',
    plottingRoute: 'Beste Fußroute wird geplant...',
    preparingVerification: 'Fotoverifizierung wird vorbereitet...',
    craftingHunt: 'Schnitzeljagd für {city} wird erstellt',
    backToSetup: 'Zurück zum Setup',
    stops: 'Stopps',
    loadingStops: 'Stopps werden geladen...',
    couldNotLoadHunt: 'Schnitzeljagd konnte nicht geladen werden.',
    huntComplete: 'Schnitzeljagd Abgeschlossen!',
    exploredAllStops: 'Du hast alle {count} Stopps von {city} erkundet. Gut gemacht!',
    startNewHunt: 'Neue Schnitzeljagd Starten',
    stop: 'Stopp',
    current: 'Aktuell',
    verified: 'Verifiziert',
    unlocksAfter: 'Wird nach dem vorherigen Stopp freigeschaltet',
    audioStory: 'Audio-Geschichte',
    stopAudio: 'Stopp',
    verifyLocation: 'Standort Verifizieren',
    verifyLocationTitle: 'Standort Verifizieren',
    snapOrUpload: 'Mache oder lade ein Foto hoch, das das Wahrzeichen aus diesem Hinweis zeigt.',
    takePhoto: 'Foto Machen',
    uploadFromLibrary: 'Aus Bibliothek Laden',
    retake: 'Neu Machen',
    verifyThisPhoto: 'Dieses Foto Verifizieren',
    checkingPhoto: 'Foto wird geprüft...',
    spotConfirmed: 'Ort bestätigt!',
    notQuite: 'Noch nicht ganz',
    continueHunt: 'Schnitzeljagd Fortsetzen',
    tryAnotherPhoto: 'Anderes Foto Versuchen',
    reminder: 'Erinnerung',
    couldNotStartHunt: 'Schnitzeljagd konnte nicht gestartet werden. Bitte erneut versuchen.',
    couldNotBuildHunt: 'Schnitzeljagd konnte nicht erstellt werden',
    tryAgain: 'Erneut Versuchen',
    demoMode: 'Demo',
    apiKey: 'API-Schlüssel',
    apiKeyTitle: 'Google AI Studio API-Schlüssel',
    apiKeyDescription: 'Füge deinen Gemini API-Schlüssel von Google AI Studio ein. Er bleibt nur in deinem Browser — nichts wird an Server gesendet.',
    apiKeyPlaceholder: 'AIza...',
    save: 'Speichern',
    cancel: 'Abbrechen',
    clear: 'Löschen',
    apiKeySaved: 'API-Schlüssel gespeichert',
    apiKeyMissing: 'Kein API-Schlüssel',
    apiKeyMissingMessage: 'Füge deinen Google AI Studio API-Schlüssel hinzu um echte Schnitzeljagden zu generieren, oder aktiviere den Demo-Modus um die App mit Beispieldaten zu testen.',
    demoModeActive: 'Demo-Modus an — Beispiel-Schnitzeljagd-Daten werden verwendet.',
    demoModeInfo: 'Der Demo-Modus lädt eine vorgefertigte Schnitzeljagd, damit du die App ohne API-Schlüssel testen kannst.',
    usingDemoData: 'Demodaten',
    min: 'Min',
    photoHint: 'Hinweis: {hint}',
    missingFeatures: 'Fehlt: {features}',
    attempt: 'Versuch',
    attemptsLeft: 'Unbegrenzte Versuche',
    unlimitedRetries: 'Unbegrenzte Versuche — weiter versuchen!',
    demoCityLabel: 'Demo-Stadt wählen',
  },
};

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : `{${key}}`
  );
}

export function translate(
  language: Language,
  key: TranslationKey,
  vars?: Record<string, string | number>
): string {
  const dictionary = translations[language] ?? translations.English;
  const template = dictionary[key] ?? translations.English[key] ?? key;
  return interpolate(template, vars);
}

export type TranslateFunction = (key: TranslationKey, vars?: Record<string, string | number>) => string;
