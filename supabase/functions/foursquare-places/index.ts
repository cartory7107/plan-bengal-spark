import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OTM_BASE = 'https://api.opentripmap.com/0.1/en/places';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { near, query, categories, limit = 10 } = await req.json();

    if (!near) {
      throw new Error('Missing "near" parameter');
    }

    // Step 1: Geocode the location name
    const geoUrl = `${OTM_BASE}/geoname?name=${encodeURIComponent(near)}&apikey=5ae2e3f221c38a28845f05b6aeb0ae296e38d61398d2ec1a01cee068`;
    console.log('Geocoding:', near);
    const geoRes = await fetch(geoUrl);
    const geoText = await geoRes.text();

    if (!geoRes.ok) {
      throw new Error(`Geocoding failed [${geoRes.status}]: ${geoText}`);
    }

    const geo = JSON.parse(geoText);
    const { lat, lon } = geo;

    if (!lat || !lon) {
      throw new Error(`Could not geocode "${near}"`);
    }

    // Step 2: Fetch nearby places by radius
    // Determine kinds filter based on request
    let kinds = 'interesting_places';
    if (categories === '19014' || (query && query.toLowerCase().includes('hotel'))) {
      kinds = 'accomodations';
    } else if (query && (query.toLowerCase().includes('tourist') || query.toLowerCase().includes('landmark') || query.toLowerCase().includes('attraction'))) {
      kinds = 'cultural,architecture,historic,natural,religion,museums';
    }

    const radius = 10000; // 10km
    const placesUrl = `${OTM_BASE}/radius?radius=${radius}&lon=${lon}&lat=${lat}&kinds=${kinds}&limit=${limit}&format=json&apikey=5ae2e3f221c38a28845f05b6aeb0ae296e38d61398d2ec1a01cee068`;
    console.log('Fetching places:', placesUrl);

    const placesRes = await fetch(placesUrl);
    const placesText = await placesRes.text();

    if (!placesRes.ok) {
      throw new Error(`Places API failed [${placesRes.status}]: ${placesText}`);
    }

    const rawPlaces = JSON.parse(placesText);

    // Step 3: Get details for each place (name, etc.)
    const places = rawPlaces
      .filter((p: any) => p.name && p.name.trim() !== '')
      .map((place: any) => ({
        id: place.xid || String(place.osm),
        name: place.name,
        address: '',
        city: near,
        country: '',
        lat: place.point?.lat || null,
        lng: place.point?.lon || null,
        categories: place.kinds ? place.kinds.split(',').slice(0, 3) : [],
        distance: place.dist ? Math.round(place.dist) : undefined,
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
