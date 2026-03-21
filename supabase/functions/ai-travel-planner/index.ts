import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { destination, from, days, season, budget, currency, travelType, transport, hotel, food, language } =
      await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert travel planner. Generate a COMPLETE travel plan as a valid JSON object. 

CRITICAL: Your entire response must be a single valid JSON object with no extra text, no markdown, no code blocks.

All data must be REALISTIC and DESTINATION-SPECIFIC:
- Hotel prices must reflect ACTUAL local pricing (budget hotel in Dhaka ~$20-40/night, NYC ~$90-150/night)
- Restaurant names should be REAL or highly realistic for the destination
- Attractions must be REAL landmarks in the destination
- Costs must reflect actual cost of living
- All prices in ${currency}
- Generate exactly ${days} days of itinerary
- Determine if ${from} to ${destination} is domestic or international for packing list
- Respond in ${language || "English"} for all text`;

    const userPrompt = `Generate a travel plan JSON for:
From: ${from} → Destination: ${destination}
Duration: ${days} days | Season: ${season} | Budget: ${currency} ${budget}
Travel: ${travelType} | Transport: ${transport} | Hotel: ${hotel} | Food: ${food}

Return this exact JSON structure:
{
  "hotels": [{"name":"string","category":"budget|mid-range|luxury|popular|historic","pricePerNight":"string","rating":4.5,"distance":"string"}],
  "restaurants": [{"name":"string","rating":4.5,"cuisine":"string","priceLevel":"$|$$|$$$|$$$$","distance":"string"}],
  "attractions": [{"name":"string","description":"string","distance":"string","category":"string"}],
  "hiddenSpots": [{"name":"string","description":"string","distance":"string","category":"string"}],
  "days": [{"day":1,"title":"string","activities":["string"]}],
  "costs": [{"label":"string","amount":"string"}],
  "total": "string",
  "minBudget": "string",
  "maxBudget": "string",
  "transport": "string",
  "seasonTips": ["string"],
  "packingList": ["string"],
  "travelTips": ["string"],
  "travelInsights": ["string"],
  "transportEstimates": [{"from":"string","to":"string","distance":"string","duration":"string","suggestion":"string"}],
  "ticketPrices": [{"mode":"Bus|Train|Flight|Metro|Taxi|Rickshaw|Ferry|Tuk-tuk|CNG|Uber","route":"string","price":"string","duration":"string","frequency":"string","tip":"string"}],
  "safetyLevel": "string",
  "bestTimeToVisit": "string",
  "crowdLevel": "string"
}

Generate 5 hotels, 6 restaurants, 6 attractions, 4 hidden spots, ${days} day plans, 6 cost items, 10+ packing items, 5 travel tips, 5 insights, 3+ transport estimates, 8-10 ticket prices covering intercity AND local transport modes specific to ${destination} (include country-specific modes like rickshaw, CNG, tuk-tuk, ferry where applicable).`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error [${response.status}]`);
    }

    const data = await response.json();
    console.log("AI response keys:", Object.keys(data));
    
    const content = data.choices?.[0]?.message?.content;
    console.log("Content type:", typeof content, "length:", content?.length);

    if (!content) {
      // Try tool_calls format
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        const plan = typeof toolCall.function.arguments === "string"
          ? JSON.parse(toolCall.function.arguments)
          : toolCall.function.arguments;
        return new Response(JSON.stringify({ success: true, plan }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI did not return content");
    }

    // Parse JSON from content - handle markdown code blocks
    let jsonStr = content.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    
    let plan;
    try {
      plan = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr, "Content:", jsonStr.substring(0, 500));
      throw new Error("Failed to parse AI response as JSON");
    }

    return new Response(JSON.stringify({ success: true, plan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("AI travel planner error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
