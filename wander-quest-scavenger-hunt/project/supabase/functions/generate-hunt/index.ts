import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const STOPS_BY_DURATION: Record<number, number> = {
  30: 3,
  60: 5,
  90: 7,
};

interface RequestBody {
  huntId: string;
  city: string;
  language: string;
  durationMinutes: number;
  theme: string;
}

interface GeneratedStop {
  stopNumber: number;
  landmarkName: string;
  riddle: string;
  audioScript: string;
  targetVisualDescription: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const body: RequestBody = await req.json();
    const { huntId, city, language, durationMinutes, theme } = body;

    if (!huntId || !city || !language || !durationMinutes || !theme) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!geminiApiKey) {
      await supabase
        .from("hunts")
        .update({ status: "failed", error_message: "AI key not configured" })
        .eq("id", huntId);
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY is not configured for this project" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const stopCount = STOPS_BY_DURATION[durationMinutes] ?? 5;

    const prompt = `You are a scavenger hunt designer creating a real-world walking tour.

Create a ${theme} themed scavenger hunt with exactly ${stopCount} stops in ${city}. The walk should take about ${durationMinutes} minutes total.

Write ALL text content (landmarkName, riddle, audioScript, targetVisualDescription) in ${language}.

For each stop:
- landmarkName: the real, specific, well-known landmark, plaza, building, market or public spot in ${city} that a visitor could actually walk to. Vary the stops across the city rather than clustering them in one spot.
- riddle: a short, fun, cryptic riddle (2-4 sentences) that hints at the landmark without naming it outright, matching the "${theme}" theme.
- audioScript: a warm, engaging 3-5 sentence narration script telling a story, legend or fun fact about the landmark, written to be read aloud.
- targetVisualDescription: a precise visual description (what the landmark looks like from the street, key visible features, colors, shapes) that could be used to verify a photo taken at that spot.

Order the stops logically as stop 1 through ${stopCount} for a walkable route.`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                stops: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      stopNumber: { type: "INTEGER" },
                      landmarkName: { type: "STRING" },
                      riddle: { type: "STRING" },
                      audioScript: { type: "STRING" },
                      targetVisualDescription: { type: "STRING" },
                    },
                    required: [
                      "stopNumber",
                      "landmarkName",
                      "riddle",
                      "audioScript",
                      "targetVisualDescription",
                    ],
                  },
                },
              },
              required: ["stops"],
            },
          },
        }),
      },
    );

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error("Gemini generate-hunt error", geminiResponse.status, errText);
      await supabase
        .from("hunts")
        .update({ status: "failed", error_message: "The AI could not generate this hunt. Please try again." })
        .eq("id", huntId);
      return new Response(
        JSON.stringify({ error: "Failed to generate hunt content" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const geminiJson = await geminiResponse.json();
    const rawText = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      await supabase
        .from("hunts")
        .update({ status: "failed", error_message: "The AI returned an empty response. Please try again." })
        .eq("id", huntId);
      return new Response(
        JSON.stringify({ error: "Empty response from AI" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let parsed: { stops: GeneratedStop[] };
    try {
      parsed = JSON.parse(rawText);
    } catch {
      await supabase
        .from("hunts")
        .update({ status: "failed", error_message: "The AI response could not be read. Please try again." })
        .eq("id", huntId);
      return new Response(
        JSON.stringify({ error: "Could not parse AI response" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!Array.isArray(parsed.stops) || parsed.stops.length === 0) {
      await supabase
        .from("hunts")
        .update({ status: "failed", error_message: "The AI did not return any stops. Please try again." })
        .eq("id", huntId);
      return new Response(
        JSON.stringify({ error: "No stops returned" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const rows = parsed.stops.map((stop, index) => ({
      hunt_id: huntId,
      stop_number: stop.stopNumber ?? index + 1,
      landmark_name: stop.landmarkName,
      riddle: stop.riddle,
      audio_script: stop.audioScript,
      target_visual_description: stop.targetVisualDescription,
    }));

    const { error: insertError } = await supabase.from("hunt_stops").insert(rows);

    if (insertError) {
      console.error("Insert stops error", insertError);
      await supabase
        .from("hunts")
        .update({ status: "failed", error_message: "Could not save the generated hunt. Please try again." })
        .eq("id", huntId);
      return new Response(
        JSON.stringify({ error: "Failed to save hunt stops" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    await supabase.from("hunts").update({ status: "ready" }).eq("id", huntId);

    return new Response(
      JSON.stringify({ success: true, stopCount: rows.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("generate-hunt error", err);
    return new Response(
      JSON.stringify({ error: "Unexpected error generating hunt" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
