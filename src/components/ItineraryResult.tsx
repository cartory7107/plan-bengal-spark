import { MapPin, Hotel, Utensils, Ticket, Star, DollarSign, PartyPopper, Eye, Lightbulb } from "lucide-react";

export interface Itinerary {
  destination: string;
  days: { day: number; title: string; activities: string[] }[];
  transport: string;
  hotels: string[];
  restaurants: string[];
  hiddenSpots: string[];
  attractions: string[];
  costs: { label: string; amount: string }[];
  total: string;
  seasonTips?: string[];
}

const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <div className="glass-card rounded-2xl p-5 md:p-6 space-y-3">
    <h3 className="flex items-center gap-2 font-bold text-foreground">
      <Icon className="w-5 h-5 text-primary" />
      {title}
    </h3>
    {children}
  </div>
);

const ItineraryResult = ({ data }: { data: Itinerary }) => (
  <section className="section-padding-sm">
    <div className="container max-w-3xl mx-auto space-y-6">
      {/* Congrats */}
      <div className="glass-card-solid rounded-3xl p-6 md:p-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 gradient-bg rounded-2xl mb-4">
          <PartyPopper className="w-7 h-7 text-primary-foreground" />
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mb-2" style={{ textWrap: "balance" }}>
          Your <span className="gradient-text">{data.destination}</span> Trip is Ready!
        </h2>
        <p className="text-muted-foreground text-sm">Congratulations! You are planning a smart and budget-optimized trip.</p>
      </div>

      {/* Day-by-day */}
      <Section icon={MapPin} title="Day-by-Day Itinerary">
        <div className="space-y-4">
          {data.days.map((d) => (
            <div key={d.day} className="relative pl-6 border-l-2 border-primary/20">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full gradient-bg shadow-sm" />
              <h4 className="font-bold text-sm text-foreground">Day {d.day}: {d.title}</h4>
              <ul className="mt-1 space-y-0.5">
                {d.activities.map((a, i) => (
                  <li key={i} className="text-sm text-muted-foreground">• {a}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <div className="grid sm:grid-cols-2 gap-4">
        <Section icon={Hotel} title="Hotels">
          <ul className="space-y-1">{data.hotels.map((h,i) => <li key={i} className="text-sm text-muted-foreground">• {h}</li>)}</ul>
        </Section>
        <Section icon={Utensils} title="Restaurants">
          <ul className="space-y-1">{data.restaurants.map((r,i) => <li key={i} className="text-sm text-muted-foreground">• {r}</li>)}</ul>
        </Section>
        <Section icon={Eye} title="Hidden Spots">
          <ul className="space-y-1">{data.hiddenSpots.map((s,i) => <li key={i} className="text-sm text-muted-foreground">• {s}</li>)}</ul>
        </Section>
        <Section icon={Star} title="Top Attractions">
          <ol className="space-y-1">{data.attractions.map((a,i) => <li key={i} className="text-sm text-muted-foreground">{i+1}. {a}</li>)}</ol>
        </Section>
      </div>

      {/* Cost Breakdown */}
      <Section icon={DollarSign} title="Estimated Cost Breakdown">
        <div className="space-y-2">
          {data.costs.map((c) => (
            <div key={c.label} className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">{c.label}</span>
              <span className="font-semibold text-foreground">{c.amount}</span>
            </div>
          ))}
          <div className="border-t border-border pt-2 mt-2 flex justify-between items-center">
            <span className="font-bold text-foreground">Total</span>
            <span className="text-lg font-extrabold gradient-text">{data.total}</span>
          </div>
        </div>
      </Section>

      {/* Season Tips */}
      {data.seasonTips && data.seasonTips.length > 0 && (
        <Section icon={Lightbulb} title="Smart Tips for Your Trip">
          <ul className="space-y-1">{data.seasonTips.map((t,i) => <li key={i} className="text-sm text-muted-foreground">💡 {t}</li>)}</ul>
        </Section>
      )}
    </div>
  </section>
);

export default ItineraryResult;
