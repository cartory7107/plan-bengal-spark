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
    const FOURSQUARE_API_KEY = Deno.env.get('FOURSQUARE_API_KEY');
    if (!FOURSQUARE_API_KEY) {
      throw new Error('FOURSQUARE_API_KEY is not configured');
    }

    const { query, near, categories, limit = 10 } = await req.json();

    // Build Foursquare Places API URL
    const params = new URLSearchParams({
      limit: String(limit),
      sort: 'RELEVANCE',
    });

    if (query) params.set('query', query);
    if (near) params.set('near', near);
    if (categories) params.set('categories', categories);

    const fsqUrl = `https://places-api.foursquare.com/places/search?${params.toString()}`;

    const response = await fetch(fsqUrl, {
      headers: {
        'Authorization': `Bearer ${FOURSQUARE_API_KEY}`,
        'Accept': 'application/json',
        'X-Places-Api-Version': '2025-06-17',
      },
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Foursquare API error [${response.status}]: ${errBody}`);
    }

    const data = await response.json();

    // Transform results into a cleaner format
    const places = (data.results || []).map((place: any) => ({
      id: place.fsq_id,
      name: place.name,
      address: place.location?.formatted_address || place.location?.address || '',
      city: place.location?.locality || '',
      country: place.location?.country || '',
      lat: place.geocodes?.main?.latitude,
      lng: place.geocodes?.main?.longitude,
      categories: (place.categories || []).map((c: any) => c.name),
      distance: place.distance,
    }));

    return new Response(JSON.stringify({ places }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Foursquare places error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
