import { useState, useRef } from "react";
import { MapPin, Calendar, DollarSign, Users, Bus, Hotel, Utensils, Globe, Sparkles, Search } from "lucide-react";
import { WORLD_DESTINATIONS } from "@/data/destinations";

const LANGUAGES = [
  "English","Bangla","Hindi","Urdu","Arabic","Spanish","French","German","Chinese",
  "Japanese","Korean","Turkish","Malay","Indonesian","Portuguese","Italian","Russian",
  "Thai","Vietnamese","Dutch"
];

interface FormData {
  from: string;
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
    from: "",
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

  const [activeField, setActiveField] = useState<"from" | "destination" | null>(null);
  const fromRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentQuery = activeField === "from" ? form.from : form.destination;
  const filteredDestinations = currentQuery.length >= 1
    ? WORLD_DESTINATIONS.filter(d => d.toLowerCase().includes(currentQuery.toLowerCase())).slice(0, 8)
    : [];

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
