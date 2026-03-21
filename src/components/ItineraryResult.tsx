import { MapPin, Hotel, Utensils, Star, DollarSign, PartyPopper, Eye, Lightbulb, Cloud, Backpack, Download, FileText, FileSpreadsheet, Image, AlertTriangle } from "lucide-react";
import { t } from "@/lib/translations";
import type { Itinerary, HotelCard } from "@/lib/generateItinerary";

const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <div className="glass-card rounded-2xl p-5 md:p-6 space-y-3">
    <h3 className="flex items-center gap-2 font-bold text-foreground">
      <Icon className="w-5 h-5 text-primary" />
      {title}
    </h3>
    {children}
  </div>
);

const HotelCardItem = ({ hotel }: { hotel: HotelCard }) => (
  <div className="glass-card rounded-xl p-4 space-y-2">
    <div className="flex items-start justify-between gap-2">
      <h4 className="font-semibold text-sm text-foreground">{hotel.name}</h4>
      <span className="text-xs font-medium gradient-bg text-primary-foreground px-2 py-0.5 rounded-full whitespace-nowrap">{hotel.category}</span>
    </div>
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <span className="font-semibold text-foreground">{hotel.priceRange}</span>
      <span>⭐ {hotel.rating}</span>
      <span>📍 {hotel.distance}</span>
    </div>
  </div>
);

const ItineraryResult = ({ data, language = "English" }: { data: Itinerary; language?: string }) => {
  const weather = data.weather ?? { temperature: "N/A", rainChance: "N/A", warning: "No data available" };
  const packingList = data.packingList ?? [];
  const seasonTips = data.seasonTips ?? [];
  const handleDownload = (type: "pdf" | "csv" | "image") => {
    if (type === "csv") {
      const rows = [["Day", "Title", "Activities"]];
      data.days.forEach(d => rows.push([`Day ${d.day}`, d.title, d.activities.join("; ")]));
      const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${data.destination}-itinerary.csv`; a.click();
      URL.revokeObjectURL(url);
    }
    if (type === "pdf" || type === "image") {
      // For PDF/Image we create a text-based download as fallback
      const text = data.days.map(d => `Day ${d.day}: ${d.title}\n${d.activities.map(a => `  • ${a}`).join("\n")}`).join("\n\n");
      const fullText = `${data.destination} Travel Plan\n${"=".repeat(40)}\n\n${text}\n\nTotal Budget: ${data.total}\nBudget Range: ${data.minBudget} – ${data.maxBudget}`;
      const blob = new Blob([fullText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${data.destination}-itinerary.txt`; a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <section className="section-padding-sm">
      <div className="container max-w-3xl mx-auto space-y-6">
        {/* Congrats */}
        <div className="glass-card-solid rounded-3xl p-6 md:p-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 gradient-bg rounded-2xl mb-4">
            <PartyPopper className="w-7 h-7 text-primary-foreground" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mb-2" style={{ textWrap: "balance" }}>
            <span className="gradient-text">{data.destination}</span> {t(language, "tripReady")}
          </h2>
          <p className="text-muted-foreground text-sm">{t(language, "congratsMsg")}</p>
        </div>

        {/* Weather */}
        <Section icon={Cloud} title={t(language, "weatherTitle")}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="glass-card rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground">{t(language, "temperature")}</p>
              <p className="text-lg font-bold gradient-text">{data.weather.temperature}</p>
            </div>
            <div className="glass-card rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground">{t(language, "rainChance")}</p>
              <p className="text-lg font-bold text-foreground">{data.weather.rainChance}</p>
            </div>
            <div className="glass-card rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground">{t(language, "weatherWarning")}</p>
              <p className="text-xs font-medium text-foreground leading-relaxed">{data.weather.warning}</p>
            </div>
          </div>
        </Section>

        {/* Day-by-day */}
        <Section icon={MapPin} title={t(language, "itineraryTitle")}>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {data.days.map((d) => (
              <div key={d.day} className="relative pl-6 border-l-2 border-primary/20">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full gradient-bg shadow-sm" />
                <h4 className="font-bold text-sm text-foreground">{t(language, "day")} {d.day}: {d.title}</h4>
                <ul className="mt-1 space-y-0.5">
                  {d.activities.map((a, i) => (
                    <li key={i} className="text-sm text-muted-foreground">• {a}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* Hotels */}
        <Section icon={Hotel} title={t(language, "hotelsTitle")}>
          <div className="grid gap-3">
            {data.hotels.map((h, i) => <HotelCardItem key={i} hotel={h} />)}
          </div>
        </Section>

        <div className="grid sm:grid-cols-2 gap-4">
          <Section icon={Utensils} title={t(language, "restaurantsTitle")}>
            <ul className="space-y-1">{data.restaurants.map((r, i) => <li key={i} className="text-sm text-muted-foreground">• {r}</li>)}</ul>
          </Section>
          <Section icon={Eye} title={t(language, "hiddenSpotsTitle")}>
            <ul className="space-y-1">{data.hiddenSpots.map((s, i) => <li key={i} className="text-sm text-muted-foreground">• {s}</li>)}</ul>
          </Section>
        </div>

        <Section icon={Star} title={t(language, "attractionsTitle")}>
          <ol className="space-y-1">{data.attractions.map((a, i) => <li key={i} className="text-sm text-muted-foreground">{i + 1}. {a}</li>)}</ol>
        </Section>

        {/* Packing Checklist */}
        <Section icon={Backpack} title={t(language, "packingTitle")}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {data.packingList.map((item, i) => (
              <label key={i} className="flex items-center gap-2 text-sm text-muted-foreground py-1">
                <input type="checkbox" className="rounded border-border accent-primary w-4 h-4" />
                {item}
              </label>
            ))}
          </div>
        </Section>

        {/* Cost Breakdown */}
        <Section icon={DollarSign} title={t(language, "costTitle")}>
          <div className="space-y-2">
            {data.costs.map((c) => (
              <div key={c.label} className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{c.label}</span>
                <span className="font-semibold text-foreground">{c.amount}</span>
              </div>
            ))}
            <div className="border-t border-border pt-2 mt-2 flex justify-between items-center">
              <span className="font-bold text-foreground">{t(language, "total")}</span>
              <span className="text-lg font-extrabold gradient-text">{data.total}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{t(language, "minBudget")}: {data.minBudget}</span>
              <span>{t(language, "maxBudget")}: {data.maxBudget}</span>
            </div>
            <div className="flex items-start gap-2 mt-2 p-3 rounded-xl bg-amber-50/80 border border-amber-200/50">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">{t(language, "budgetDisclaimer")}</p>
            </div>
          </div>
        </Section>

        {/* Season Tips */}
        {data.seasonTips.length > 0 && (
          <Section icon={Lightbulb} title={t(language, "tipsTitle")}>
            <ul className="space-y-1">{data.seasonTips.map((tip, i) => <li key={i} className="text-sm text-muted-foreground">💡 {tip}</li>)}</ul>
          </Section>
        )}

        {/* Download */}
        <Section icon={Download} title={t(language, "downloadTitle")}>
          <div className="flex flex-wrap gap-3">
            {[
              { type: "pdf" as const, icon: FileText, label: t(language, "downloadPdf") },
              { type: "csv" as const, icon: FileSpreadsheet, label: t(language, "downloadCsv") },
              { type: "image" as const, icon: Image, label: t(language, "downloadImage") },
            ].map(({ type, icon: DIcon, label }) => (
              <button key={type} onClick={() => handleDownload(type)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card hover:bg-white/80 text-sm font-medium text-foreground transition-all duration-200 active:scale-95"
              >
                <DIcon className="w-4 h-4 text-primary" />
                {label}
              </button>
            ))}
          </div>
        </Section>
      </div>
    </section>
  );
};

export default ItineraryResult;
