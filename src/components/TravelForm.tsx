import { useState, useRef } from "react";
import { MapPin, Calendar, DollarSign, Users, Bus, Hotel, Utensils, Sparkles, Search } from "lucide-react";
import { WORLD_DESTINATIONS } from "@/data/destinations";
import { t } from "@/lib/translations";
import { CURRENCIES, type FormData } from "@/lib/generateItinerary";

interface Props {
  onSubmit: (data: FormData) => void;
  loading: boolean;
  language?: string;
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
        <button key={o.value} type="button" onClick={() => onChange(o.value)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 ${
            value === o.value
              ? "gradient-bg text-primary-foreground shadow-md shadow-primary/20"
              : "glass-card hover:bg-white/80 text-foreground"
          }`}
        >{o.label}</button>
      ))}
    </div>
  </div>
);

const AutocompleteField = ({ label, value, onChange, placeholder, inputRef, isActive, onActivate, onDeactivate, suggestions, onSelect }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string;
  inputRef: React.RefObject<HTMLInputElement>; isActive: boolean;
  onActivate: () => void; onDeactivate: () => void;
  suggestions: string[]; onSelect: (v: string) => void;
}) => (
  <div className="space-y-2 relative">
    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
      <MapPin className="w-4 h-4 text-primary" />
      {label}
    </label>
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <input ref={inputRef} type="text" value={value}
        onChange={(e) => { onChange(e.target.value); onActivate(); }}
        onFocus={onActivate}
        onBlur={() => setTimeout(onDeactivate, 200)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-white/70 pl-10 pr-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
      />
    </div>
    {isActive && suggestions.length > 0 && (
      <div className="absolute z-20 top-full left-0 right-0 mt-1 glass-card-solid rounded-xl overflow-hidden shadow-xl max-h-64 overflow-y-auto">
        {suggestions.map((d) => (
          <button key={d} type="button" onMouseDown={() => onSelect(d)}
            className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 transition-colors flex items-center gap-2"
          >
            <MapPin className="w-3.5 h-3.5 text-primary/60 shrink-0" />
            {d}
          </button>
        ))}
      </div>
    )}
  </div>
);

const TravelForm = ({ onSubmit, loading, language = "English" }: Props) => {
  const [form, setForm] = useState<FormData>({
    from: "", destination: "", days: 3, season: "winter", budget: "500",
    currency: "USD", travelType: "solo", transport: "auto", hotel: "auto", food: "local", language: "English",
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
            {t(language, "designTrip")} <span className="gradient-text">{t(language, "dreamTrip")}</span>
          </h2>
          <p className="text-muted-foreground">{t(language, "formSubtitle")}</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form, language }); }}
          className="glass-card-solid rounded-3xl p-6 md:p-10 space-y-8"
        >
          {/* From & To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AutocompleteField label={t(language, "fromLabel")} value={form.from}
              onChange={(v) => set("from", v)} placeholder={t(language, "fromPlaceholder")}
              inputRef={fromRef} isActive={activeField === "from"}
              onActivate={() => setActiveField("from")} onDeactivate={() => setActiveField(null)}
              suggestions={activeField === "from" ? filteredDestinations : []}
              onSelect={(v) => { set("from", v); setActiveField(null); }}
            />
            <AutocompleteField label={t(language, "toLabel")} value={form.destination}
              onChange={(v) => set("destination", v)} placeholder={t(language, "toPlaceholder")}
              inputRef={inputRef} isActive={activeField === "destination"}
              onActivate={() => setActiveField("destination")} onDeactivate={() => setActiveField(null)}
              suggestions={activeField === "destination" ? filteredDestinations : []}
              onSelect={(v) => { set("destination", v); setActiveField(null); }}
            />
          </div>

          {/* Days & Budget - text inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                {t(language, "tripDuration")}
              </label>
              <input type="number" min={1} max={365} value={form.days}
                onChange={(e) => set("days", Math.max(1, Math.min(365, +e.target.value || 1)))}
                className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="1 – 365"
              />
              <p className="text-xs text-muted-foreground">{form.days} {form.days === 1 ? t(language, "day") : t(language, "days")}</p>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <DollarSign className="w-4 h-4 text-primary" />
                {t(language, "budgetLabel")}
              </label>
              <div className="flex gap-2">
                <select
                  value={form.currency}
                  onChange={(e) => set("currency", e.target.value)}
                  className="rounded-xl border border-border bg-white/70 px-3 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-[100px]"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
                  ))}
                </select>
                <input type="number" min={1} value={form.budget}
                  onChange={(e) => set("budget", e.target.value)}
                  className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder={t(language, "budgetPlaceholder")}
                />
              </div>
            </div>
          </div>

          <SelectGroup icon={Calendar} label={t(language, "seasonLabel")} value={form.season} onChange={(v) => set("season", v)}
            options={[
              { value: "winter", label: t(language, "winter") },
              { value: "summer", label: t(language, "summer") },
              { value: "newyear", label: t(language, "newYear") },
              { value: "eid", label: t(language, "eid") },
              { value: "custom", label: t(language, "custom") },
            ]}
          />

          <SelectGroup icon={Users} label={t(language, "travelTypeLabel")} value={form.travelType} onChange={(v) => set("travelType", v)}
            options={[
              { value: "solo", label: t(language, "solo") },
              { value: "friends", label: t(language, "friends") },
              { value: "family", label: t(language, "family") },
              { value: "couple", label: t(language, "couple") },
            ]}
          />

          <SelectGroup icon={Bus} label={t(language, "transportLabel")} value={form.transport} onChange={(v) => set("transport", v)}
            options={[
              { value: "auto", label: t(language, "autoSuggest") },
              { value: "bus", label: t(language, "bus") },
              { value: "train", label: t(language, "train") },
              { value: "flight", label: t(language, "flight") },
              { value: "car", label: t(language, "car") },
            ]}
          />

          <SelectGroup icon={Hotel} label={t(language, "hotelLabel")} value={form.hotel} onChange={(v) => set("hotel", v)}
            options={[
              { value: "budget", label: t(language, "budgetHotel") },
              { value: "standard", label: t(language, "standardHotel") },
              { value: "premium", label: t(language, "premiumHotel") },
              { value: "luxury", label: t(language, "luxury") },
              { value: "historic", label: t(language, "historicHotel") },
              { value: "auto", label: t(language, "bestValue") },
            ]}
          />

          <SelectGroup icon={Utensils} label={t(language, "foodLabel")} value={form.food} onChange={(v) => set("food", v)}
            options={[
              { value: "local", label: t(language, "local") },
              { value: "mixed", label: t(language, "mixed") },
              { value: "premium", label: t(language, "premiumFood") },
            ]}
          />

          <button type="submit" disabled={loading}
            className="w-full gradient-bg text-primary-foreground font-bold text-lg py-4 rounded-2xl shadow-xl shadow-primary/25 transition-all duration-200 hover:shadow-2xl hover:shadow-primary/30 active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2.5"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            {loading ? t(language, "generating") : t(language, "generateBtn")}
          </button>
        </form>
      </div>
    </section>
  );
};

export default TravelForm;
