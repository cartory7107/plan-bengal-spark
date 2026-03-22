import { supabase } from "@/integrations/supabase/client";
import type { Itinerary, FormData, WeatherInfo } from "./generateItinerary";
import { generateFallbackItinerary } from "./generateItinerary";
import { normalizeEdgeFunctionError } from "./edgeFunctionErrors";

export async function fetchWeather(city: string): Promise<WeatherInfo> {
  try {
    const { data, error } = await supabase.functions.invoke("weather", {
      body: { city },
    });

    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(data.error);

    return {
      temperature: data.summary?.tempRange ?? "N/A",
      rainChance: data.summary?.avgRainChance ?? "N/A",
      warning: data.summary?.warning ?? "No warnings",
      daily: data.daily ?? [],
      current: data.current,
      city: data.city,
      country: data.country,
    };
  } catch (err) {
    const errorMessage = normalizeEdgeFunctionError(err, "Weather data unavailable.");
    console.error("Weather API error:", errorMessage, err);
    return {
      temperature: "N/A",
      rainChance: "N/A",
      warning: `${errorMessage} Showing fallback weather data.`,
    };
  }
}

export async function fetchAITravelPlan(form: FormData): Promise<Itinerary> {
  try {
    const { data, error } = await supabase.functions.invoke("ai-travel-planner", {
      body: {
        destination: form.destination,
        from: form.from,
        days: form.days,
        season: form.season,
        budget: form.budget,
        currency: form.currency,
        travelType: form.travelType,
        transport: form.transport,
        hotel: form.hotel,
        food: form.food,
        language: form.language,
      },
    });

    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(data.error);

    const plan = data.plan;

    // Normalize hotels (AI returns pricePerNight, we keep both)
    const hotels = (plan.hotels ?? []).map((h: any) => ({
      name: h.name,
      category: h.category,
      pricePerNight: h.pricePerNight,
      priceRange: h.pricePerNight,
      rating: h.rating,
      distance: h.distance,
    }));

    return {
      destination: form.destination,
      days: plan.days ?? [],
      transport: plan.transport ?? "Auto-suggested",
      hotels,
      restaurants: plan.restaurants ?? [],
      hiddenSpots: plan.hiddenSpots ?? [],
      attractions: plan.attractions ?? [],
      costs: plan.costs ?? [],
      total: plan.total ?? "N/A",
      minBudget: plan.minBudget ?? "N/A",
      maxBudget: plan.maxBudget ?? "N/A",
      seasonTips: plan.seasonTips ?? [],
      weather: { temperature: "Loading...", rainChance: "Loading...", warning: "Loading..." },
      packingList: plan.packingList ?? [],
      travelTips: plan.travelTips ?? [],
      travelInsights: plan.travelInsights ?? [],
      transportEstimates: plan.transportEstimates ?? [],
      safetyLevel: plan.safetyLevel ?? "Unknown",
      bestTimeToVisit: plan.bestTimeToVisit ?? "Check local guides",
      crowdLevel: plan.crowdLevel ?? "Moderate",
      ticketPrices: plan.ticketPrices ?? [],
    };
  } catch (err) {
    const errorMessage = normalizeEdgeFunctionError(err, "AI travel planner failed.");
    console.error("AI Travel Planner error:", errorMessage, err);
    // Return fallback static data
    return generateFallbackItinerary(form);
  }
}

export async function generateDynamicItinerary(form: FormData): Promise<Itinerary> {
  // Fetch AI plan and weather in parallel
  const [aiPlan, weather] = await Promise.all([
    fetchAITravelPlan(form),
    fetchWeather(form.destination),
  ]);

  // Merge weather data into the plan
  return {
    ...aiPlan,
    weather,
  };
}
