import { useState, useRef } from "react";
import { MapPin, Calendar, DollarSign, Users, Bus, Hotel, Utensils, Globe, Sparkles, Search } from "lucide-react";

const LANGUAGES = [
  "English","Bangla","Hindi","Urdu","Arabic","Spanish","French","German","Chinese",
  "Japanese","Korean","Turkish","Malay","Indonesian","Portuguese","Italian","Russian",
  "Thai","Vietnamese","Dutch"
];

const POPULAR_DESTINATIONS = [
  "Cox's Bazar, Bangladesh","Sundarbans, Bangladesh","Sylhet, Bangladesh","Bandarban, Bangladesh",
  "Saint Martin, Bangladesh","Rangamati, Bangladesh","Kuakata, Bangladesh","Sajek Valley, Bangladesh",
  "Dhaka, Bangladesh","Chittagong, Bangladesh","Srimangal, Bangladesh","Paharpur, Bangladesh",
  "Mahasthangarh, Bangladesh","Ratargul Swamp Forest, Bangladesh","Nijhum Dwip, Bangladesh",
  "Tanguar Haor, Bangladesh","Jaflong, Bangladesh","Lalakhal, Bangladesh","Bagerhat, Bangladesh",
  "Paris, France","Tokyo, Japan","New York, USA","Dubai, UAE",
  "Istanbul, Turkey","Bangkok, Thailand","Rome, Italy","London, UK","Barcelona, Spain",
  "Bali, Indonesia","Maldives","Singapore","Kuala Lumpur, Malaysia","Seoul, South Korea",
  "Cairo, Egypt","Sydney, Australia","Rio de Janeiro, Brazil","Cape Town, South Africa",
  "Santorini, Greece","Marrakech, Morocco","Phuket, Thailand","Hanoi, Vietnam",
  "Petra, Jordan","Machu Picchu, Peru","Reykjavik, Iceland","Zurich, Switzerland",
  "Prague, Czech Republic","Amsterdam, Netherlands","Lisbon, Portugal","Havana, Cuba",
];

interface FormData {
  destination: string;
  days: number;
  season: string;
  budget: string;
  travelType: string;
  transport: string;
  hotel: string;
  food: string;
  language: string;
}

interface Props {
  onSubmit: (data: FormData) => void;
  loading: boolean;
}

const SelectGroup = ({ icon: Icon, label, value, onChange, options }: {
  icon: React.ElementType; label: string; value: string;
  onChange: (v: string) => void; options: { value: string; label: string }[];
}) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
      <Icon className="w-4 h-4 text-primary" />
      {label}
    </label>
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 ${
            value === o.value
              ? "gradient-bg text-primary-foreground shadow-md shadow-primary/20"
              : "glass-card hover:bg-white/80 text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  </div>
);

const TravelForm = ({ onSubmit, loading }: Props) => {
  const [form, setForm] = useState<FormData>({
    destination: "",
    days: 3,
    season: "winter",
    budget: "low",
    travelType: "solo",
    transport: "auto",
    hotel: "auto",
    food: "local",
    language: "English",
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredDestinations = form.destination.length > 0
    ? POPULAR_DESTINATIONS.filter(d => d.toLowerCase().includes(form.destination.toLowerCase())).slice(0, 8)
    : POPULAR_DESTINATIONS.slice(0, 8);

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) =>
    setForm((p) => ({ ...p, [key]: val }));

  return (
    <section id="planner" className="section-padding">
      <div className="container max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-3" style={{ textWrap: "balance" }}>
            Design Your <span className="gradient-text">Dream Trip</span>
          </h2>
          <p className="text-muted-foreground">Fill in your preferences and let AI handle the rest.</p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}
          className="glass-card-solid rounded-3xl p-6 md:p-10 space-y-8"
        >
          {/* Destination */}
          <div className="space-y-2 relative">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              Where are you traveling?
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={form.destination}
                onChange={(e) => { set("destination", e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Type any city or destination worldwide..."
                className="w-full rounded-xl border border-border bg-white/70 pl-10 pr-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
              />
            </div>
            {showSuggestions && filteredDestinations.length > 0 && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1 glass-card-solid rounded-xl overflow-hidden shadow-xl max-h-64 overflow-y-auto">
                {filteredDestinations.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onMouseDown={() => { set("destination", d); setShowSuggestions(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 transition-colors flex items-center gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Days */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              Trip Duration: <span className="gradient-text">{form.days} {form.days === 1 ? "day" : "days"}</span>
            </label>
            <input
              type="range"
              min={1}
              max={7}
              value={form.days}
              onChange={(e) => set("days", +e.target.value)}
              className="w-full accent-primary h-2 rounded-full"
              style={{ accentColor: "hsl(152, 60%, 42%)" }}
            />
            <div className="flex justify-between text-xs text-muted-foreground font-medium">
              <span>1 day</span><span>7 days</span>
            </div>
          </div>

          <SelectGroup icon={Calendar} label="Travel Season / Event" value={form.season} onChange={(v) => set("season", v)}
            options={[
              { value: "winter", label: "❄️ Winter" },
              { value: "summer", label: "☀️ Summer" },
              { value: "newyear", label: "🎆 New Year" },
              { value: "eid", label: "🌙 Eid" },
            ]}
          />

          <SelectGroup icon={DollarSign} label="Budget Preference" value={form.budget} onChange={(v) => set("budget", v)}
            options={[
              { value: "low", label: "💰 Low Budget" },
              { value: "standard", label: "💎 Standard" },
              { value: "premium", label: "👑 Premium" },
            ]}
          />

          <SelectGroup icon={Users} label="Travel Type" value={form.travelType} onChange={(v) => set("travelType", v)}
            options={[
              { value: "solo", label: "🧍 Solo" },
              { value: "friends", label: "👫 Friends" },
              { value: "family", label: "👨‍👩‍👧‍👦 Family" },
              { value: "couple", label: "💑 Couple" },
            ]}
          />

          <SelectGroup icon={Bus} label="Transport Preference" value={form.transport} onChange={(v) => set("transport", v)}
            options={[
              { value: "bus", label: "🚌 Bus" },
              { value: "train", label: "🚂 Train" },
              { value: "flight", label: "✈️ Flight" },
              { value: "auto", label: "🤖 Auto Suggest" },
            ]}
          />

          <SelectGroup icon={Hotel} label="Hotel Preference" value={form.hotel} onChange={(v) => set("hotel", v)}
            options={[
              { value: "budget", label: "🏨 Budget" },
              { value: "seaview", label: "🌊 Sea View" },
              { value: "luxury", label: "🏰 Luxury" },
              { value: "auto", label: "🤖 Best Value" },
            ]}
          />

          <SelectGroup icon={Utensils} label="Food Preference" value={form.food} onChange={(v) => set("food", v)}
            options={[
              { value: "local", label: "🍛 Local" },
              { value: "mixed", label: "🍽️ Mixed" },
              { value: "premium", label: "🥂 Premium" },
            ]}
          />

          {/* Language */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Globe className="w-4 h-4 text-primary" />
              Language
            </label>
            <select
              value={form.language}
              onChange={(e) => set("language", e.target.value)}
              className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-bg text-primary-foreground font-bold text-lg py-4 rounded-2xl shadow-xl shadow-primary/25 transition-all duration-200 hover:shadow-2xl hover:shadow-primary/30 active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2.5"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            {loading ? "Generating Your Plan..." : "Generate AI Itinerary"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default TravelForm;
