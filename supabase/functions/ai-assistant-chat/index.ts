import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { message, history = [] } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt =
      "You are Bubble AI Assistant. You are helpful for travel and also for general everyday questions. Give concise, clear, friendly answers. If a user asks non-travel questions, answer normally instead of refusing.";

    const normalizedHistory = Array.isArray(history)
      ? history
          .filter((item) => item && typeof item.text === "string" && (item.role === "user" || item.role === "assistant"))
          .slice(-10)
          .map((item) => ({ role: item.role, content: item.text }))
      : [];

    const models = ["google/gemini-2.5-flash", "openai/gpt-4.1-mini"];
    let data: unknown = null;
    let lastErrorStatus = 500;
    let lastErrorText = "";

    for (const model of models) {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            ...normalizedHistory,
            { role: "user", content: message },
          ],
        }),
      });

      if (!response.ok) {
        lastErrorStatus = response.status;
        lastErrorText = await response.text();
        console.error(`AI gateway error for ${model}:`, response.status, lastErrorText);

        if (response.status === 429) {
          break;
        }

        continue;
      }

      data = await response.json();
      break;
    }

    if (!data) {
      return new Response(
        JSON.stringify({
          error:
            lastErrorStatus === 429
              ? "Rate limit exceeded. Please try again in a moment."
              : "AI assistant is temporarily unavailable. Please try again shortly.",
          details: lastErrorText || undefined,
        }),
        {
          status: lastErrorStatus,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const reply = (data as { choices?: Array<{ message?: { content?: string } }> }).choices?.[0]?.message
      ?.content;

    if (!reply || typeof reply !== "string") {
      throw new Error("AI did not return a valid reply");
    }

    return new Response(JSON.stringify({ success: true, reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("AI assistant chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
