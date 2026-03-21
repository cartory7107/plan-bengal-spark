import { useState } from "react";
import { MapPin, Hotel, Compass, Loader2, Navigation } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { t } from "@/lib/translations";

interface Place {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  lat: number | null;
  lng: number | null;
  categories: string[];
  distance?: number;
}

interface NearbyPlacesProps {
  destination: string;
  language?: string;
}

const PlaceCard = ({ place }: { place: Place }) => (
  <div className="glass-card rounded-xl p-4 space-y-2 transition-all duration-200 hover:shadow-md">
    <div className="flex items-start justify-between gap-2">
      <h4 className="font-semibold text-sm text-foreground leading-tight">{place.name}</h4>
      {place.distance != null && (
        <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full whitespace-nowrap">
          {place.distance > 1000
            ? `${(place.distance / 1000).toFixed(1)} km`
            : `${place.distance} m`}
        </span>
      )}
    </div>
    <p className="text-xs text-muted-foreground leading-relaxed">{place.address}</p>
    {place.categories.length > 0 && (
      <div className="flex flex-wrap gap-1">
        {place.categories.slice(0, 3).map((cat, i) => (
          <span key={i} className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
            {cat}
          </span>
        ))}
      </div>
    )}
    {place.lat && place.lng && (
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline mt-1"
      >
        <Navigation className="w-3 h-3" />
        View on Map
      </a>
    )}
  </div>
);

const NearbyPlaces = ({ destination, language = "English" }: NearbyPlacesProps) => {
  const [hotels, setHotels] = useState<Place[]>([]);
  const [attractions, setAttractions] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaces = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch hotels (Foursquare category: 19014 = Hotels)
      const [hotelsRes, attractionsRes] = await Promise.all([
        supabase.functions.invoke('foursquare-places', {
          body: { near: destination, categories: '19014', limit: 6 },
        }),
        supabase.functions.invoke('foursquare-places', {
          body: { near: destination, query: 'tourist attraction landmark', limit: 8 },
        }),
      ]);

      if (hotelsRes.error) throw new Error(hotelsRes.error.message);
      if (attractionsRes.error) throw new Error(attractionsRes.error.message);

      setHotels(hotelsRes.data?.places || []);
      setAttractions(attractionsRes.data?.places || []);
      setLoaded(true);
    } catch (err) {
      console.error('Failed to fetch places:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch nearby places');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-bold text-foreground">
          <Compass className="w-5 h-5 text-primary" />
          {t(language, "nearbyPlaces")}
        </h3>
        {!loaded && (
          <button
            onClick={fetchPlaces}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-bg text-primary-foreground text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 active:scale-95 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
            {loading ? t(language, "searching") : t(language, "discoverPlaces")}
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}

      {loaded && (
        <div className="space-y-5">
          {/* Hotels */}
          {hotels.length > 0 && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <Hotel className="w-4 h-4 text-primary" />
                {t(language, "nearbyHotels")}
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {hotels.map((h) => <PlaceCard key={h.id} place={h} />)}
              </div>
            </div>
          )}

          {/* Attractions */}
          {attractions.length > 0 && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                {t(language, "nearbyAttractions")}
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {attractions.map((a) => <PlaceCard key={a.id} place={a} />)}
              </div>
            </div>
          )}

          {hotels.length === 0 && attractions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No places found for "{destination}". Try a more specific location.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default NearbyPlaces;
