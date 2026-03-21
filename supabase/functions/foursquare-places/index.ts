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

    // Build Foursquare Places API URL (new endpoint)
    const params = new URLSearchParams({
      limit: String(limit),
      sort: 'RELEVANCE',
    });

    if (query) params.set('query', query);
    if (near) params.set('near', near);
    if (categories) params.set('categories', categories);

    // Use the new places-api host
    const fsqUrl = `https://places-api.foursquare.com/places/search?${params.toString()}`;

    console.log('Fetching:', fsqUrl);

    const response = await fetch(fsqUrl, {
      headers: {
        'Authorization': `Bearer ${FOURSQUARE_API_KEY}`,
        'Accept': 'application/json',
        'X-Places-Api-Version': '2025-06-17',
      },
    });

    const responseText = await response.text();
    console.log('Response status:', response.status);

    if (!response.ok) {
      // Fallback: try the legacy v3 endpoint
      console.log('New API failed, trying legacy v3...');
      const legacyUrl = `https://api.foursquare.com/v3/places/search?${params.toString()}`;
      
      const legacyResponse = await fetch(legacyUrl, {
        headers: {
          'Authorization': FOURSQUARE_API_KEY,
          'Accept': 'application/json',
        },
      });

      const legacyText = await legacyResponse.text();
      console.log('Legacy response status:', legacyResponse.status);

      if (!legacyResponse.ok) {
        throw new Error(`Foursquare API error [${legacyResponse.status}]: ${legacyText}`);
      }

      const data = JSON.parse(legacyText);
      const places = transformPlaces(data.results || []);
      return new Response(JSON.stringify({ places }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = JSON.parse(responseText);
    const places = transformPlaces(data.results || []);

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

function transformPlaces(results: any[]) {
  return results.map((place: any) => ({
    id: place.fsq_id || place.id,
    name: place.name,
    address: place.location?.formatted_address || place.location?.address || '',
    city: place.location?.locality || '',
    country: place.location?.country || '',
    lat: place.geocodes?.main?.latitude,
    lng: place.geocodes?.main?.longitude,
    categories: (place.categories || []).map((c: any) => c.name),
    distance: place.distance,
  }));
}
