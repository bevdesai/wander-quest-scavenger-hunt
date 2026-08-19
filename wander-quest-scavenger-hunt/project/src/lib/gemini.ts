import type { Language, Theme, DurationMinutes } from '@/types/hunt';

const GEMINI_MODEL = 'gemini-1.5-flash';
const GENERATE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const VISION_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const STOPS_BY_DURATION: Record<number, number> = {
  30: 3,
  60: 5,
  90: 7,
};

export interface GeneratedStop {
  stopNumber: number;
  landmarkName: string;
  riddle: string;
  audioScript: string;
  targetVisualDescription: string;
}

export interface GenerateHuntParams {
  city: string;
  region?: string;
  language: Language;
  durationMinutes: DurationMinutes;
  theme: Theme;
  apiKey: string;
}

export interface GenerateHuntResult {
  stops: GeneratedStop[];
}

export async function generateHuntViaGemini(params: GenerateHuntParams): Promise<GenerateHuntResult> {
  const stopCount = STOPS_BY_DURATION[params.durationMinutes] ?? 5;
  const locationContext = params.region
    ? `${params.city}, ${params.region}`
    : params.city;

  const prompt = `You are a scavenger hunt designer creating a real-world walking tour.

Create a ${params.theme} themed scavenger hunt with exactly ${stopCount} stops in ${locationContext}. The walk should take about ${params.durationMinutes} minutes total.

Write ALL text content (landmarkName, riddle, audioScript, targetVisualDescription) in ${params.language}.

For each stop:
- landmarkName: the real, specific, well-known landmark, plaza, building, market or public spot in ${locationContext} that a visitor could actually walk to. Vary the stops across the area rather than clustering them in one spot.
- riddle: a short, fun, cryptic riddle (2-4 sentences) that hints at the landmark without naming it outright, matching the "${params.theme}" theme.
- audioScript: a warm, engaging 3-5 sentence narration script telling a story, legend or fun fact about the landmark, written to be read aloud.
- targetVisualDescription: a precise visual description (what the landmark looks like from the street, key visible features, colors, shapes) that could be used to verify a photo taken at that spot.

Order the stops logically as stop 1 through ${stopCount} for a walkable route.`;

  const response = await fetch(`${GENERATE_URL}?key=${params.apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            stops: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  stopNumber: { type: 'INTEGER' },
                  landmarkName: { type: 'STRING' },
                  riddle: { type: 'STRING' },
                  audioScript: { type: 'STRING' },
                  targetVisualDescription: { type: 'STRING' },
                },
                required: [
                  'stopNumber',
                  'landmarkName',
                  'riddle',
                  'audioScript',
                  'targetVisualDescription',
                ],
              },
            },
          },
          required: ['stops'],
        },
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Gemini generateHunt error', response.status, errorBody);
    if (response.status === 400 || response.status === 403) {
      throw new Error('Your API key was rejected. Please check it and try again.');
    }
    if (response.status === 429) {
      throw new Error('The AI service is busy. Please wait a moment and try again.');
    }
    throw new Error('The AI could not generate this hunt. Please try again.');
  }

  const json = await response.json();
  const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('The AI returned an empty response. Please try again.');
  }

  let parsed: GenerateHuntResult;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error('The AI response could not be read. Please try again.');
  }

  if (!Array.isArray(parsed.stops) || parsed.stops.length === 0) {
    throw new Error('The AI did not return any stops. Please try again.');
  }

  return parsed;
}

export interface VerifyPhotoParams {
  apiKey: string;
  landmarkName: string;
  targetVisualDescription: string;
  imageBase64: string;
  mimeType: string;
  language: Language;
  attemptCount: number;
}

export interface VerifyPhotoResult {
  match: boolean;
  feedback: string;
  missingFeatures: string | null;
}

export async function verifyPhotoViaGemini(params: VerifyPhotoParams): Promise<VerifyPhotoResult> {
  const prompt = `You are verifying a scavenger hunt photo submission. Be LENIENT — accept photos that plausibly show the target landmark even if they are blurry, partially obscured, shot at night, taken from an unusual angle, or have poor lighting. Only reject photos that clearly show a completely different, unrelated place.

Target landmark: ${params.landmarkName}
Expected visual description of the target: ${params.targetVisualDescription}

This is attempt #${params.attemptCount}. Write the feedback in ${params.language}.

Look at the attached photo and decide whether it plausibly shows the target landmark described above.

Respond with JSON containing:
- match: true if the photo plausibly matches the target (be lenient about quality), false if it clearly shows something unrelated.
- feedback: a short, warm, friendly one or two sentence message in ${params.language} speaking directly to the player. If it matches, congratulate them and mention a detail you can see. If it does not match, gently explain what seems off and encourage them to try again.
- missingFeatures: if match is false, a brief description (in ${params.language}) of the specific visual features that were expected but missing or different in the photo (e.g. "the central stone fountain", "the colorful building facades"). If match is true, set this to null. This will be shown as a progressive hint to help the player.`;

  const response = await fetch(`${VISION_URL}?key=${params.apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            { inlineData: { mimeType: params.mimeType, data: params.imageBase64 } },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            match: { type: 'BOOLEAN' },
            feedback: { type: 'STRING' },
            missingFeatures: { type: 'STRING', nullable: true },
          },
          required: ['match', 'feedback'],
        },
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Gemini verifyPhoto error', response.status, errorBody);
    if (response.status === 400 || response.status === 403) {
      throw new Error('Your API key was rejected. Please check it and try again.');
    }
    if (response.status === 429) {
      throw new Error('The AI service is busy. Please wait a moment and try again.');
    }
    throw new Error('Could not verify your photo. Please try again.');
  }

  const json = await response.json();
  const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('The AI returned an empty response. Please try again.');
  }

  let parsed: VerifyPhotoResult;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error('The AI response could not be read. Please try again.');
  }

  return {
    match: parsed.match === true,
    feedback: parsed.feedback ?? '',
    missingFeatures: parsed.missingFeatures ?? null,
  };
}
