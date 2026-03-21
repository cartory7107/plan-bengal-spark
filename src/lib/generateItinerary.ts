import type { Itinerary } from "@/components/ItineraryResult";

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

const budgetMultiplier: Record<string, number> = { low: 1, standard: 1.8, premium: 3.2 };

// Generic activity templates that work for any destination worldwide
const activityTemplates = [
  (dest: string) => [`Arrive at ${dest} and check into hotel`, `Explore the city center and nearby landmarks`, `Evening walk and local street food experience`],
  (dest: string) => [`Visit the most popular tourist attraction in ${dest}`, `Lunch at a highly-rated local restaurant`, `Explore historical or cultural sites nearby`],
  (dest: string) => [`Day trip to a scenic spot near ${dest}`, `Photography and sightseeing`, `Try local specialty cuisine for dinner`],
  (dest: string) => [`Visit local markets and artisan shops in ${dest}`, `Explore a museum, temple, or natural landmark`, `Sunset viewing at a scenic point`],
  (dest: string) => [`Adventure activity (hiking, water sports, or tour)`, `Visit a hidden gem recommended by locals`, `Evening cultural show or nightlife`],
  (dest: string) => [`Relaxation day — spa, beach, or park in ${dest}`, `Souvenir shopping at local markets`, `Farewell dinner at a top restaurant`],
];

const dayTitles = [
  (dest: string) => `Arrival at ${dest}`,
  (dest: string) => `Iconic ${dest} Highlights`,
  (dest: string) => `Day Trip & Exploration`,
  (dest: string) => `Culture & Markets`,
  (dest: string) => `Adventure Day`,
  (dest: string) => `Relax & Explore`,
  (dest: string) => `Departure from ${dest}`,
];

export function generateItinerary(form: FormData): Itinerary {
  const dest = form.destination || "Your Destination";
  const mult = budgetMultiplier[form.budget] ?? 1;

  // Currency & cost estimation based on destination
  const isLocal = dest.toLowerCase().includes("bangladesh") || 
    ["cox's bazar","sundarbans","sylhet","bandarban","rangamati","saint martin","kuakata","sajek","dhaka","chittagong"]
      .some(b => dest.toLowerCase().includes(b));

  const currency = isLocal ? "৳" : "$";
  const baseHotel = isLocal ? 800 : 60;
  const baseFood = isLocal ? 400 : 30;
  const baseTransport = isLocal ? 700 : 80;
  const baseTicket = isLocal ? 300 : 20;

  const transportLabels: Record<string, string> = {
    bus: `Intercity Bus / Coach Service`,
    train: `Train / Rail Service`,
    flight: `Domestic / International Flight`,
    auto: form.budget === "premium" ? "Flight (recommended)" : "Bus / Train (best value)",
  };

  const hotelTiers: Record<string, string[]> = {
    budget: [`Budget Inn near ${dest} center`, `Hostel / Guesthouse`, `Affordable Hotel`],
    seaview: [`Waterfront Hotel in ${dest}`, `Resort with scenic views`, `Boutique stay near coast`],
    luxury: [`5-Star Hotel in ${dest}`, `Luxury Resort & Spa`, `Premium Suite with city view`],
    auto: form.budget === "premium"
      ? [`Top-rated Hotel in ${dest}`, `Luxury Resort`]
      : [`Budget-friendly Hotel in ${dest}`, `Well-rated Guesthouse`],
  };

  // Build day-by-day
  const itineraryDays = Array.from({ length: form.days }, (_, i) => {
    const dayNum = i + 1;
    if (dayNum === 1) return {
      day: 1,
      title: dayTitles[0](dest),
      activities: activityTemplates[0](dest),
    };
    if (dayNum === form.days) return {
      day: dayNum,
      title: dayTitles[6](dest),
      activities: [`Morning visit to a final landmark`, `Souvenir shopping`, `Depart from ${dest}`],
    };
    const idx = ((dayNum - 2) % (activityTemplates.length - 1)) + 1;
    return {
      day: dayNum,
      title: dayTitles[Math.min(idx, dayTitles.length - 2)](dest),
      activities: activityTemplates[idx](dest),
    };
  });

  const transportCost = Math.round(baseTransport * (form.transport === "flight" ? 5 : form.transport === "train" ? 1.3 : 1) * mult);
  const hotelCost = Math.round(baseHotel * mult * form.days);
  const foodCost = Math.round(baseFood * (form.food === "premium" ? 2.5 : form.food === "mixed" ? 1.5 : 1) * form.days);
  const ticketCost = Math.round(baseTicket * mult * 0.5 * form.days);
  const emergency = Math.round((transportCost + hotelCost + foodCost) * 0.1);
  const total = transportCost + hotelCost + foodCost + ticketCost + emergency;

  const fmt = (n: number) => `${currency}${n.toLocaleString()}`;

  // Smart suggestions based on season
  const seasonTips: Record<string, string[]> = {
    newyear: [`Best fireworks & New Year spots in ${dest}`, `Book hotels early — peak season pricing`, `Check local NYE events and festivals`],
    eid: [`Explore local Eid celebrations in ${dest}`, `Many shops may close — plan meals ahead`, `Best cultural experiences during Eid`],
    winter: [`Pack warm layers for ${dest}`, `Great weather for outdoor sightseeing`, `Off-peak discounts may be available`],
    summer: [`Stay hydrated — carry water bottles`, `Early morning is best for outdoor activities`, `Beach and water activities are ideal`],
  };

  return {
    destination: dest,
    days: itineraryDays,
    transport: transportLabels[form.transport] ?? transportLabels.auto,
    hotels: hotelTiers[form.hotel] ?? hotelTiers.auto,
    restaurants: [
      `Top-rated local restaurant in ${dest}`,
      `Street food market / food court`,
      `Rooftop or scenic dining experience`,
      `Traditional cuisine restaurant`,
    ],
    hiddenSpots: [
      `Secret viewpoint near ${dest}`,
      `Local artisan village or neighborhood`,
      `Off-the-beaten-path nature spot`,
      `Underground or lesser-known cultural site`,
    ],
    attractions: [
      `#1 Tourist Attraction in ${dest}`,
      `Most photographed landmark`,
      `Top-rated museum or heritage site`,
      `Popular natural wonder nearby`,
      `Best local market or bazaar`,
      `Scenic walking trail or waterfront`,
    ],
    costs: [
      { label: "🚌 Transport (round trip)", amount: fmt(transportCost) },
      { label: `🏨 Hotel (${form.days} nights)`, amount: fmt(hotelCost) },
      { label: `🍛 Food (${form.days} days)`, amount: fmt(foodCost) },
      { label: "🎫 Entry Tickets", amount: fmt(ticketCost) },
      { label: "🆘 Emergency Fund", amount: fmt(emergency) },
    ],
    total: fmt(total),
    seasonTips: seasonTips[form.season] ?? seasonTips.winter,
  };
}
