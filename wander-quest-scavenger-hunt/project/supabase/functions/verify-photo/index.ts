import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  stopId: string;
  imageBase64: string;
  mimeType: string;
  photoUrl: string;
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
    const { stopId, imageBase64, mimeType, photoUrl } = body;

    if (!stopId || !imageBase64 || !mimeType) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY is not configured for this project" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: stop, error: stopError } = await supabase
      .from("hunt_stops")
      .select("id, landmark_name, target_visual_description")
      .eq("id", stopId)
      .maybeSingle();

    if (stopError || !stop) {
      return new Response(
        JSON.stringify({ error: "Stop not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const prompt = `You are verifying a scavenger hunt photo submission. Be LENIENT — accept photos that plausibly show the target landmark even if they are blurry, partially obscured, shot at night, taken from an unusual angle, or have poor lighting. Only reject photos that clearly show a completely different, unrelated place.

Target landmark: ${stop.landmark_name}
Expected visual description of the target: ${stop.target_visual_description}

Look at the attached photo and decide whether it plausibly shows the target landmark described above.

Respond with JSON containing:
- match: true if the photo plausibly matches the target (be lenient about quality), false if it clearly shows something unrelated.
- feedback: a short, warm, friendly one or two sentence message speaking directly to the player. If it matches, congratulate them and mention a detail you can see. If it does not match, gently explain what seems off and encourage them to try again, without being harsh.
- missingFeatures: if match is false, a brief description of the specific visual features that were expected but missing or different in the photo (e.g. "the central stone fountain", "the colorful building facades"). If match is true, set this to null. This will be shown as a progressive hint to help the player.`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                { inlineData: { mimeType, data: imageBase64 } },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                match: { type: "BOOLEAN" },
                feedback: { type: "STRING" },
                missingFeatures: { type: "STRING", nullable: true },
              },
              required: ["match", "feedback"],
            },
          },
        }),
      },
    );

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error("Gemini verify-photo error", geminiResponse.status, errText);
      return new Response(
        JSON.stringify({ error: "Failed to verify photo" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const geminiJson = await geminiResponse.json();
    const rawText = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return new Response(
        JSON.stringify({ error: "Empty response from AI" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let parsed: { match: boolean; feedback: string; missingFeatures: string | null };
    try {
      parsed = JSON.parse(rawText);
    } catch {
      return new Response(
        JSON.stringify({ error: "Could not parse AI response" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { error: updateError } = await supabase
      .from("hunt_stops")
      .update({
        is_verified: parsed.match === true,
        verification_feedback: parsed.feedback,
        photo_url: photoUrl ?? null,
      })
      .eq("id", stopId);

    const missingFeatures = parsed.missingFeatures ?? null;

    if (updateError) {
      console.error("Update stop error", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to save verification result" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ match: parsed.match === true, feedback: parsed.feedback, missingFeatures }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("verify-photo error", err);
    return new Response(
      JSON.stringify({ error: "Unexpected error verifying photo" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
