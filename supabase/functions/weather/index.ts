import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { city } = await req.json();
    if (!city) throw new Error("City is required");

    const apiKey = Deno.env.get("OPENWEATHERMAP_API_KEY");
    if (!apiKey) throw new Error("OPENWEATHERMAP_API_KEY is not configured");

    // Step 1: Geocode city
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
    );
    const geoData = await geoRes.json();

    if (!geoData || geoData.length === 0) {
      return new Response(JSON.stringify({ error: `City not found: ${city}` }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { lat, lon, name, country } = geoData[0];

    // Step 2: Get 5-day forecast (free tier)
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    const forecastData = await forecastRes.json();

    if (!forecastRes.ok) {
      throw new Error(`OpenWeatherMap error [${forecastRes.status}]: ${JSON.stringify(forecastData)}`);
    }

    // Step 3: Get current weather
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    const currentData = await currentRes.json();

    // Process forecast into daily summaries
    const dailyMap = new Map<string, any>();

    for (const item of forecastData.list) {
      const date = item.dt_txt.split(" ")[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date,
          temps: [],
          humidity: [],
          windSpeed: [],
          rainChance: 0,
          descriptions: [],
          icons: [],
        });
      }
      const day = dailyMap.get(date);
      day.temps.push(item.main.temp);
      day.humidity.push(item.main.humidity);
      day.windSpeed.push(item.wind.speed);
      if (item.pop) day.rainChance = Math.max(day.rainChance, item.pop);
      day.descriptions.push(item.weather[0].description);
      day.icons.push(item.weather[0].icon);
    }

    const daily = Array.from(dailyMap.values())
      .slice(0, 7)
      .map((d) => ({
        date: d.date,
        tempHigh: Math.round(Math.max(...d.temps)),
        tempLow: Math.round(Math.min(...d.temps)),
        humidity: Math.round(d.humidity.reduce((a: number, b: number) => a + b, 0) / d.humidity.length),
        windSpeed: Math.round(d.windSpeed.reduce((a: number, b: number) => a + b, 0) / d.windSpeed.length * 10) / 10,
        rainChance: Math.round(d.rainChance * 100),
        description: d.descriptions[Math.floor(d.descriptions.length / 2)],
        icon: d.icons[Math.floor(d.icons.length / 2)],
      }));

    // Generate warnings
    const warnings: string[] = [];
    const maxTemp = Math.max(...daily.map((d) => d.tempHigh));
    const minTemp = Math.min(...daily.map((d) => d.tempLow));
    const maxRain = Math.max(...daily.map((d) => d.rainChance));

    if (maxTemp > 35) warnings.push("Extreme heat expected. Stay hydrated and avoid peak sun hours.");
    if (minTemp < 5) warnings.push("Cold weather expected. Pack warm layers.");
    if (maxRain > 70) warnings.push("High rain probability. Carry waterproof gear.");
    if (daily.some((d) => d.windSpeed > 15)) warnings.push("Strong winds expected. Secure loose items.");

    const result = {
      city: name,
      country,
      current: {
        temp: Math.round(currentData.main.temp),
        feelsLike: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind.speed,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
      },
      daily,
      summary: {
        tempRange: `${minTemp}°C – ${maxTemp}°C`,
        avgRainChance: `${Math.round(daily.reduce((a, d) => a + d.rainChance, 0) / daily.length)}%`,
        warning: warnings.length > 0 ? warnings.join(" ") : "No severe weather warnings. Enjoy your trip!",
      },
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Weather error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
