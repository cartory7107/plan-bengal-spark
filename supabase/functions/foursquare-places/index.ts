import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { near, query, categories, limit = 10 } = await req.json();

    if (!near) {
      throw new Error('Missing "near" parameter');
    }

    // Determine search query based on request type
    let searchQuery = '';
    const isHotel = categories === '19014' || (query && query.toLowerCase().includes('hotel'));
    const isTourist = query && (query.toLowerCase().includes('tourist') || query.toLowerCase().includes('landmark') || query.toLowerCase().includes('attraction'));

    if (isHotel) {
      searchQuery = `hotel in ${near}`;
    } else if (isTourist) {
      searchQuery = `tourist attraction in ${near}`;
    } else {
      searchQuery = query ? `${query} in ${near}` : near;
    }

    // Use Nominatim search (free, no API key)
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=${limit}&addressdetails=1&extratags=1`;
    console.log('Searching:', url);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CartoryTravelAI/1.0',
        'Accept': 'application/json',
      },
    });

    const text = await response.text();
    if (!response.ok) {
      throw new Error(`Nominatim error [${response.status}]: ${text}`);
    }

    const results = JSON.parse(text);

    const places = results
      .filter((r: any) => r.display_name)
      .map((place: any) => ({
        id: String(place.place_id),
        name: place.display_name.split(',')[0],
        address: place.display_name.split(',').slice(1, 3).join(',').trim(),
        city: place.address?.city || place.address?.town || place.address?.village || '',
        country: place.address?.country || '',
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon),
        categories: [place.type?.replace(/_/g, ' ')].filter(Boolean),
        distance: undefined,
      }));

    return new Response(JSON.stringify({ places }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Places error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
