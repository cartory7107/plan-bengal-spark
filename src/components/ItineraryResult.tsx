import {
  MapPin, Hotel, Utensils, Star, DollarSign, PartyPopper, Eye, Lightbulb,
  Cloud, Backpack, Download, FileText, FileSpreadsheet, Image, AlertTriangle,
  Navigation, Thermometer, Droplets, Wind, Shield, Clock, Users, Route, Ticket
} from "lucide-react";
import { t } from "@/lib/translations";
import type { Itinerary, HotelCard, RestaurantCard, AttractionCard, TransportEstimate, WeatherDay, TicketPrice } from "@/lib/generateItinerary";
import NearbyPlaces from "@/components/NearbyPlaces";
import TravelInsights from "@/components/TravelInsights";

const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <div className="glass-card rounded-2xl p-5 md:p-6 space-y-3 reveal">
    <h3 className="flex items-center gap-2 font-bold text-foreground">
      <Icon className="w-5 h-5 text-primary" />
      {title}
    </h3>
    {children}
  </div>
);

const HotelCardItem = ({ hotel }: { hotel: HotelCard }) => (
  <div className="glass-card rounded-xl p-4 space-y-2 transition-all duration-200 hover:shadow-md">
    <div className="flex items-start justify-between gap-2">
      <h4 className="font-semibold text-sm text-foreground">{hotel.name}</h4>
      <span className="text-xs font-medium gradient-bg text-primary-foreground px-2 py-0.5 rounded-full whitespace-nowrap capitalize">{hotel.category}</span>
    </div>
    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
      <span className="font-semibold text-foreground">{hotel.pricePerNight || hotel.priceRange}</span>
      <span>⭐ {hotel.rating}</span>
      <span>📍 {hotel.distance}</span>
    </div>
  </div>
);

const RestaurantCardItem = ({ restaurant }: { restaurant: RestaurantCard }) => (
  <div className="glass-card rounded-xl p-4 space-y-2 transition-all duration-200 hover:shadow-md">
    <div className="flex items-start justify-between gap-2">
      <h4 className="font-semibold text-sm text-foreground">{restaurant.name}</h4>
      <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full whitespace-nowrap">{restaurant.priceLevel}</span>
    </div>
    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
      <span>⭐ {restaurant.rating}</span>
      <span>🍽️ {restaurant.cuisine}</span>
      <span>📍 {restaurant.distance}</span>
    </div>
  </div>
);

const AttractionCardItem = ({ item, index }: { item: AttractionCard; index: number }) => (
  <div className="glass-card rounded-xl p-4 space-y-2 transition-all duration-200 hover:shadow-md">
    <div className="flex items-start justify-between gap-2">
      <h4 className="font-semibold text-sm text-foreground">{index + 1}. {item.name}</h4>
      <span className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full whitespace-nowrap">{item.category}</span>
    </div>
    <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
    <span className="text-[11px] text-primary font-medium">📍 {item.distance}</span>
  </div>
);

const WeatherDayCard = ({ day }: { day: WeatherDay }) => (
  <div className="glass-card rounded-xl p-3 min-w-[130px] text-center space-y-1 shrink-0">
    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
      {new Date(day.date).toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })}
    </p>
    <img
      src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
      alt={day.description}
      className="w-12 h-12 mx-auto"
    />
    <p className="text-sm font-bold text-foreground">{day.tempHigh}° / {day.tempLow}°</p>
    <p className="text-[10px] text-muted-foreground capitalize">{day.description}</p>
    <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
      <span>💧 {day.rainChance}%</span>
      <span>💨 {day.windSpeed} m/s</span>
    </div>
  </div>
);

const TransportCard = ({ estimate }: { estimate: TransportEstimate }) => (
  <div className="glass-card rounded-xl p-3 space-y-1">
    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
      <Route className="w-3.5 h-3.5 text-primary" />
      {estimate.from} → {estimate.to}
    </div>
    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
      <span>📏 {estimate.distance}</span>
      <span>⏱️ {estimate.duration}</span>
    </div>
    <p className="text-[11px] text-primary font-medium">{estimate.suggestion}</p>
  </div>
);

const ItineraryResult = ({ data, language = "English" }: { data: Itinerary; language?: string }) => {
  const weather = data.weather ?? { temperature: "N/A", rainChance: "N/A", warning: "No data available" };

  const handleDownload = (type: "pdf" | "csv" | "image") => {
    if (type === "csv") {
      const rows = [["Day", "Title", "Activities"]];
      data.days.forEach((d) => rows.push([`Day ${d.day}`, d.title, d.activities.join("; ")]));
      const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${data.destination}-itinerary.csv`; a.click();
      URL.revokeObjectURL(url);
    }
    if (type === "pdf" || type === "image") {
      const text = data.days.map((d) => `Day ${d.day}: ${d.title}\n${d.activities.map((a) => `  • ${a}`).join("\n")}`).join("\n\n");
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
        <div className="glass-card-solid rounded-3xl p-6 md:p-8 text-center reveal">
          <div className="inline-flex items-center justify-center w-14 h-14 gradient-bg rounded-2xl mb-4">
            <PartyPopper className="w-7 h-7 text-primary-foreground" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mb-2" style={{ textWrap: "balance" as any }}>
            <span className="gradient-text">{data.destination}</span> {t(language, "tripReady")}
          </h2>
          <p className="text-muted-foreground text-sm">{t(language, "congratsMsg")}</p>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-primary" /> {data.safetyLevel}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-primary" /> {data.bestTimeToVisit}</span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-primary" /> {data.crowdLevel}</span>
          </div>
        </div>

        {/* Real-time Weather */}
        <Section icon={Cloud} title={t(language, "weatherTitle")}>
          {/* Current weather summary */}
          {weather.current && (
            <div className="glass-card-solid rounded-xl p-4 flex items-center gap-4 mb-3">
              <img
                src={`https://openweathermap.org/img/wn/${weather.current.icon}@2x.png`}
                alt={weather.current.description}
                className="w-16 h-16"
              />
              <div>
                <p className="text-2xl font-extrabold gradient-text">{weather.current.temp}°C</p>
                <p className="text-xs text-muted-foreground capitalize">{weather.current.description}</p>
                <p className="text-[11px] text-muted-foreground">
                  Feels like {weather.current.feelsLike}°C • Humidity {weather.current.humidity}% • Wind {weather.current.windSpeed} m/s
                </p>
              </div>
              {weather.city && (
                <div className="ml-auto text-right">
                  <p className="text-sm font-semibold text-foreground">{weather.city}</p>
                  <p className="text-[11px] text-muted-foreground">{weather.country}</p>
                </div>
              )}
            </div>
          )}

          {/* Daily forecast */}
          {weather.daily && weather.daily.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
              {weather.daily.map((day, i) => (
                <WeatherDayCard key={i} day={day} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="glass-card rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Thermometer className="w-3 h-3" /> {t(language, "temperature")}</p>
                <p className="text-lg font-bold gradient-text">{weather.temperature}</p>
              </div>
              <div className="glass-card rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Droplets className="w-3 h-3" /> {t(language, "rainChance")}</p>
                <p className="text-lg font-bold text-foreground">{weather.rainChance}</p>
              </div>
              <div className="glass-card rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Wind className="w-3 h-3" /> {t(language, "weatherWarning")}</p>
                <p className="text-xs font-medium text-foreground leading-relaxed">{weather.warning}</p>
              </div>
            </div>
          )}

          {/* Warning */}
          {weather.warning && weather.warning !== "No severe weather warnings. Enjoy your trip!" && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50/80 border border-amber-200/50">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">{weather.warning}</p>
            </div>
          )}
        </Section>

        {/* Day-by-day Itinerary */}
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

        {/* Nearby Places (OpenStreetMap) */}
        <NearbyPlaces destination={data.destination} language={language} />

        {/* Restaurants */}
        <Section icon={Utensils} title={t(language, "restaurantsTitle")}>
          <div className="grid sm:grid-cols-2 gap-3">
            {data.restaurants.map((r, i) => <RestaurantCardItem key={i} restaurant={r} />)}
          </div>
        </Section>

        {/* Attractions */}
        <Section icon={Star} title={t(language, "attractionsTitle")}>
          <div className="grid gap-3">
            {data.attractions.map((a, i) => <AttractionCardItem key={i} item={a} index={i} />)}
          </div>
        </Section>

        {/* Hidden Spots */}
        <Section icon={Eye} title={t(language, "hiddenSpotsTitle")}>
          <div className="grid sm:grid-cols-2 gap-3">
            {data.hiddenSpots.map((s, i) => <AttractionCardItem key={i} item={s} index={i} />)}
          </div>
        </Section>

        {/* Transport Estimates */}
        {data.transportEstimates && data.transportEstimates.length > 0 && (
          <Section icon={Navigation} title="Distance & Transport Estimates">
            <div className="grid sm:grid-cols-2 gap-3">
              {data.transportEstimates.map((est, i) => <TransportCard key={i} estimate={est} />)}
            </div>
          </Section>
        )}

        {/* Ticket & Transport Prices */}
        {data.ticketPrices && data.ticketPrices.length > 0 && (
          <Section icon={Ticket} title={t(language, "ticketPricesTitle")}>
            <div className="grid sm:grid-cols-2 gap-3">
              {data.ticketPrices.map((tp, i) => (
                <div key={i} className="glass-card rounded-xl p-4 space-y-2 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm text-foreground">{tp.mode}</h4>
                    <span className="text-xs font-bold gradient-bg text-primary-foreground px-2 py-0.5 rounded-full whitespace-nowrap">{tp.price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">{tp.route}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    {tp.duration && <span>⏱️ {tp.duration}</span>}
                    {tp.frequency && <span>🔄 {tp.frequency}</span>}
                  </div>
                  {tp.tip && (
                    <p className="text-xs text-primary/80 mt-1">💡 {tp.tip}</p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

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

        {/* Travel Tips */}
        {data.travelTips && data.travelTips.length > 0 && (
          <Section icon={Lightbulb} title={t(language, "tipsTitle")}>
            <ul className="space-y-1">
              {data.travelTips.map((tip, i) => <li key={i} className="text-sm text-muted-foreground">💡 {tip}</li>)}
            </ul>
          </Section>
        )}

        {/* Season Tips */}
        {data.seasonTips && data.seasonTips.length > 0 && (
          <Section icon={Lightbulb} title="Season-Specific Tips">
            <ul className="space-y-1">
              {data.seasonTips.map((tip, i) => <li key={i} className="text-sm text-muted-foreground">🌍 {tip}</li>)}
            </ul>
          </Section>
        )}

        {/* Travel Insights (AI) */}
        {data.travelInsights && data.travelInsights.length > 0 && (
          <Section icon={Star} title="Travel Insights">
            <ul className="space-y-1">
              {data.travelInsights.map((insight, i) => <li key={i} className="text-sm text-muted-foreground">✨ {insight}</li>)}
            </ul>
          </Section>
        )}

        {/* Web Insights (Firecrawl) */}
        <TravelInsights destination={data.destination} language={language} />

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
