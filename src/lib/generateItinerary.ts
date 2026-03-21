export interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
}

export interface CostItem {
  label: string;
  amount: string;
}

export interface HotelCard {
  name: string;
  category: string;
  priceRange: string;
  rating: number;
  distance: string;
}

export interface WeatherInfo {
  temperature: string;
  rainChance: string;
  warning: string;
}

export interface Itinerary {
  destination: string;
  days: ItineraryDay[];
  transport: string;
  hotels: HotelCard[];
  restaurants: string[];
  hiddenSpots: string[];
  attractions: string[];
  costs: CostItem[];
  total: string;
  minBudget: string;
  maxBudget: string;
  seasonTips: string[];
  weather: WeatherInfo;
  packingList: string[];
}

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "KRW", symbol: "₩", name: "Korean Won" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong" },
] as const;

export interface FormData {
  from: string;
  destination: string;
  days: number;
  season: string;
  budget: string;
  currency: string;
  travelType: string;
  transport: string;
  hotel: string;
  food: string;
  language: string;
}

const activityPool = [
  (d: string) => [`Arrive at ${d}, check into hotel`, `Explore the city center`, `Evening walk & local street food`],
  (d: string) => [`Visit the top tourist attraction in ${d}`, `Lunch at a popular local restaurant`, `Explore historical or cultural sites`],
  (d: string) => [`Day trip to a scenic spot near ${d}`, `Photography & sightseeing`, `Try local specialty cuisine for dinner`],
  (d: string) => [`Visit local markets and artisan shops`, `Explore a museum, temple, or landmark`, `Sunset viewing at a scenic point`],
  (d: string) => [`Adventure activity — hiking, water sports, or tour`, `Visit a hidden gem recommended by locals`, `Evening cultural show or nightlife`],
  (d: string) => [`Relaxation day — spa, beach, or park`, `Souvenir shopping at local markets`, `Farewell dinner at a top restaurant`],
  (d: string) => [`Visit a nature reserve or botanical garden near ${d}`, `Local cooking class or food tour`, `Rooftop dining experience`],
  (d: string) => [`Explore ${d}'s art district or galleries`, `Boat ride or waterfront experience`, `Night market exploration`],
  (d: string) => [`Cycling tour around ${d}`, `Visit a local festival or event`, `Traditional music or dance performance`],
  (d: string) => [`Mountain or hill viewpoint excursion`, `Visit an archaeological or heritage site`, `Stargazing or evening bonfire`],
];

const titlePool = [
  (d: string) => `Arrival at ${d}`,
  (d: string) => `Iconic ${d} Highlights`,
  (d: string) => `Day Trip & Exploration`,
  (d: string) => `Culture & Markets`,
  (d: string) => `Adventure Day`,
  (d: string) => `Relax & Explore`,
  (d: string) => `Art & Waterfront`,
  (d: string) => `Local Immersion`,
  (d: string) => `Nature & Heritage`,
  (d: string) => `Hidden Gems`,
  (d: string) => `Departure from ${d}`,
];

function generateWeather(season: string, dest: string): WeatherInfo {
  const temps: Record<string, string> = {
    winter: "5°C – 18°C",
    summer: "25°C – 38°C",
    newyear: "2°C – 15°C",
    eid: "20°C – 35°C",
    custom: "15°C – 28°C",
  };
  const rain: Record<string, string> = {
    winter: "15%", summer: "40%", newyear: "20%", eid: "35%", custom: "25%",
  };
  const warnings: Record<string, string> = {
    winter: "Pack warm layers and check for snow advisories",
    summer: "Stay hydrated, use sunscreen, avoid peak heat hours",
    newyear: "Expect crowds at popular spots, book transport early",
    eid: "Many local shops may close, plan meals and transport ahead",
    custom: "Check local weather conditions closer to travel date",
  };
  return {
    temperature: temps[season] ?? temps.custom,
    rainChance: rain[season] ?? rain.custom,
    warning: warnings[season] ?? warnings.custom,
  };
}

function generatePacking(season: string, days: number, dest: string): string[] {
  const base = ["Passport & travel documents", "Phone charger & power bank", "Toiletries kit", "First aid kit", "Reusable water bottle"];
  const clothing = days <= 3 ? ["3 sets of clothes", "1 pair comfortable shoes"] :
    days <= 7 ? ["5-7 sets of clothes", "2 pairs of shoes", "Light jacket"] :
    days <= 30 ? ["10+ sets of clothes", "3 pairs of shoes", "Laundry bag"] :
    ["2 weeks of clothes (plan laundry)", "3-4 pairs of shoes", "Laundry supplies"];
  
  const seasonal: Record<string, string[]> = {
    winter: ["Heavy jacket / coat", "Thermal underwear", "Gloves & scarf", "Warm hat"],
    summer: ["Sunscreen SPF 50+", "Sunglasses", "Light breathable clothes", "Hat / cap"],
    newyear: ["Warm layers", "Festive outfit", "Hand warmers"],
    eid: ["Modest clothing", "Comfortable walking shoes", "Umbrella"],
    custom: ["Layered clothing", "Rain jacket", "Comfortable walking shoes"],
  };

  return [...base, ...clothing, ...(seasonal[season] ?? seasonal.custom)];
}

export function generateItinerary(form: FormData): Itinerary {
  const dest = form.destination || "Your Destination";
  const userBudget = parseFloat(form.budget) || 500;
  const numDays = Math.max(1, Math.min(365, form.days));

  // Build day-by-day
  const itineraryDays: ItineraryDay[] = Array.from({ length: numDays }, (_, i) => {
    const dayNum = i + 1;
    if (dayNum === 1) return { day: 1, title: titlePool[0](dest), activities: activityPool[0](dest) };
    if (dayNum === numDays && numDays > 1) return {
      day: dayNum,
      title: titlePool[titlePool.length - 1](dest),
      activities: [`Morning visit to a final landmark`, `Souvenir shopping`, `Depart from ${dest}`],
    };
    const idx = ((dayNum - 2) % (activityPool.length - 1)) + 1;
    return {
      day: dayNum,
      title: titlePool[Math.min(idx, titlePool.length - 2)](dest),
      activities: activityPool[idx](dest),
    };
  });

  // Cost estimation based on budget
  const dailyBudget = userBudget / numDays;
  const transportPct = form.transport === "flight" ? 0.35 : form.transport === "car" ? 0.2 : 0.15;
  const hotelPct = 0.35;
  const foodPct = form.food === "premium" ? 0.25 : form.food === "mixed" ? 0.18 : 0.12;
  const ticketPct = 0.08;
  const emergencyPct = 0.07;

  const transportCost = Math.round(userBudget * transportPct);
  const hotelCost = Math.round(userBudget * hotelPct);
  const foodCost = Math.round(userBudget * foodPct);
  const ticketCost = Math.round(userBudget * ticketPct);
  const emergency = Math.round(userBudget * emergencyPct);
  const localTravel = Math.round(userBudget * 0.05);
  const total = transportCost + hotelCost + foodCost + ticketCost + emergency + localTravel;

  const currencyInfo = CURRENCIES.find(c => c.code === form.currency) ?? CURRENCIES[0];
  const fmt = (n: number) => `${currencyInfo.symbol}${n.toLocaleString()}`;

  // Hotel suggestions
  const hotelSuggestions: HotelCard[] = [
    { name: `Budget Inn near ${dest} center`, category: "cheapest", priceRange: `${fmt(Math.round(dailyBudget * 0.15))}/night`, rating: 3.8, distance: "0.5 km from center" },
    { name: `Comfort Stay ${dest}`, category: "bestValue", priceRange: `${fmt(Math.round(dailyBudget * 0.3))}/night`, rating: 4.2, distance: "1.2 km from center" },
    { name: `Grand ${dest} Hotel & Spa`, category: "luxury", priceRange: `${fmt(Math.round(dailyBudget * 0.6))}/night`, rating: 4.7, distance: "0.8 km from center" },
    { name: `${dest} Travelers' Choice`, category: "popular", priceRange: `${fmt(Math.round(dailyBudget * 0.25))}/night`, rating: 4.5, distance: "0.3 km from center" },
    { name: `Heritage House ${dest}`, category: "historic", priceRange: `${fmt(Math.round(dailyBudget * 0.35))}/night`, rating: 4.3, distance: "1.5 km from center" },
  ];

  const transportLabels: Record<string, string> = {
    bus: "Intercity Bus / Coach Service",
    train: "Train / Rail Service",
    flight: "Domestic / International Flight",
    car: "Rental Car / Self-Drive",
    auto: dailyBudget > 100 ? "Flight (recommended for your budget)" : "Bus / Train (best value)",
  };

  const seasonTips: Record<string, string[]> = {
    newyear: [`Best fireworks & New Year spots in ${dest}`, `Book hotels early — peak season`, `Check local NYE events`],
    eid: [`Explore local Eid celebrations in ${dest}`, `Many shops may close — plan ahead`, `Best cultural experiences during Eid`],
    winter: [`Pack warm layers for ${dest}`, `Great weather for sightseeing`, `Off-peak discounts available`],
    summer: [`Stay hydrated — carry water`, `Early morning best for outdoor activities`, `Beach and water activities ideal`],
    custom: [`Check local events calendar for ${dest}`, `Flexible dates can save money`, `Compare prices across seasons`],
  };

  return {
    destination: dest,
    days: itineraryDays,
    transport: transportLabels[form.transport] ?? transportLabels.auto,
    hotels: hotelSuggestions,
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
      { label: `🏨 Hotel (${numDays} nights)`, amount: fmt(hotelCost) },
      { label: `🍛 Food (${numDays} days)`, amount: fmt(foodCost) },
      { label: "🎫 Entry Tickets", amount: fmt(ticketCost) },
      { label: "🚕 Local Travel", amount: fmt(localTravel) },
      { label: "🆘 Emergency Fund", amount: fmt(emergency) },
    ],
    total: fmt(total),
    minBudget: fmt(Math.round(total * 0.8)),
    maxBudget: fmt(Math.round(total * 1.3)),
    seasonTips: seasonTips[form.season] ?? seasonTips.custom,
    weather: generateWeather(form.season, dest),
    packingList: generatePacking(form.season, numDays, dest),
  };
}
