import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const travelPlanSchema = {
  name: "generate_travel_plan",
  description: "Generate a complete dynamic travel plan with destination-specific data",
  parameters: {
    type: "object",
    properties: {
      hotels: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            category: { type: "string", enum: ["budget", "mid-range", "luxury", "popular", "historic"] },
            pricePerNight: { type: "string" },
            rating: { type: "number" },
            distance: { type: "string" },
          },
          required: ["name", "category", "pricePerNight", "rating", "distance"],
        },
      },
      restaurants: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            rating: { type: "number" },
            cuisine: { type: "string" },
            priceLevel: { type: "string", enum: ["$", "$$", "$$$", "$$$$"] },
            distance: { type: "string" },
          },
          required: ["name", "rating", "cuisine", "priceLevel", "distance"],
        },
      },
      attractions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            distance: { type: "string" },
            category: { type: "string" },
          },
          required: ["name", "description", "distance", "category"],
        },
      },
      hiddenSpots: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            distance: { type: "string" },
            category: { type: "string" },
          },
          required: ["name", "description", "distance", "category"],
        },
      },
      days: {
        type: "array",
        items: {
          type: "object",
          properties: {
            day: { type: "number" },
            title: { type: "string" },
            activities: { type: "array", items: { type: "string" } },
          },
          required: ["day", "title", "activities"],
        },
      },
      costs: {
        type: "array",
        items: {
          type: "object",
          properties: {
            label: { type: "string" },
            amount: { type: "string" },
          },
          required: ["label", "amount"],
        },
      },
      total: { type: "string" },
      minBudget: { type: "string" },
      maxBudget: { type: "string" },
      transport: { type: "string" },
      seasonTips: { type: "array", items: { type: "string" } },
      packingList: { type: "array", items: { type: "string" } },
      travelTips: { type: "array", items: { type: "string" } },
      travelInsights: { type: "array", items: { type: "string" } },
      transportEstimates: {
        type: "array",
        items: {
          type: "object",
          properties: {
            from: { type: "string" },
            to: { type: "string" },
            distance: { type: "string" },
            duration: { type: "string" },
            suggestion: { type: "string" },
          },
          required: ["from", "to", "distance", "duration", "suggestion"],
        },
      },
      safetyLevel: { type: "string" },
      bestTimeToVisit: { type: "string" },
      crowdLevel: { type: "string" },
    },
    required: [
      "hotels", "restaurants", "attractions", "hiddenSpots", "days", "costs",
      "total", "minBudget", "maxBudget", "transport", "seasonTips", "packingList",
      "travelTips", "travelInsights", "transportEstimates", "safetyLevel",
      "bestTimeToVisit", "crowdLevel",
    ],
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { destination, from, days, season, budget, currency, travelType, transport, hotel, food, language } =
      await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert travel planner with deep knowledge of destinations worldwide. Generate REALISTIC, ACCURATE, DESTINATION-SPECIFIC travel data. 

CRITICAL RULES:
- Hotel prices MUST reflect ACTUAL local pricing for the destination. A budget hotel in Dhaka costs $20-40/night while in NYC it costs $90-150/night.
- Restaurant names should be REAL popular restaurants in the destination or highly realistic names.
- Attractions MUST be REAL landmarks, places, and sites in the destination city.
- Hidden spots should be genuine lesser-known places locals would recommend.
- Cost breakdowns must reflect the actual cost of living in the destination.
- All prices must be in ${currency}.
- The itinerary should be practical and follow logical geographic routes.
- Packing list must consider the destination's climate, culture, and whether the trip is domestic or international.
- If traveling from "${from}" to "${destination}", determine if it's domestic or international. If international, include passport in packing list.
- Generate exactly ${days} days of itinerary.
- Respond in ${language || "English"} language for all text content.`;

    const userPrompt = `Generate a complete travel plan:
- From: ${from}
- Destination: ${destination}
- Duration: ${days} days
- Season/Event: ${season}
- Budget: ${currency} ${budget}
- Travel Type: ${travelType}
- Transport Preference: ${transport}
- Hotel Preference: ${hotel}
- Food Preference: ${food}

Generate:
- 5 hotel suggestions (budget, mid-range, luxury, popular, historic) with REAL local prices
- 6 restaurant suggestions with REAL names and cuisine types
- 6 top attractions (REAL landmarks in ${destination})
- 4 hidden gems/spots locals love
- Day-by-day itinerary for all ${days} days
- Detailed cost breakdown in ${currency}
- Smart packing checklist (consider domestic vs international, weather, culture)
- 5 destination-specific travel tips
- 5 travel insights (best time, crowd level, safety, local events)
- Transport estimates from airport/station to hotels and attractions
- Safety level, best time to visit, and crowd level assessment`;

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
        tools: [{ type: "function", function: travelPlanSchema }],
        tool_choice: { type: "function", function: { name: "generate_travel_plan" } },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("AI gateway error:", response.status, errText);
      throw new Error(`AI gateway error [${response.status}]`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("AI did not return structured travel plan data");
    }

    let travelPlan;
    try {
      travelPlan = typeof toolCall.function.arguments === "string"
        ? JSON.parse(toolCall.function.arguments)
        : toolCall.function.arguments;
    } catch {
      throw new Error("Failed to parse AI response");
    }

    return new Response(JSON.stringify({ success: true, plan: travelPlan }), {
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
