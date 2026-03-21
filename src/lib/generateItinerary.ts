// Types and constants for the travel planner

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
  priceRange?: string;
  pricePerNight?: string;
  rating: number;
  distance: string;
}

export interface RestaurantCard {
  name: string;
  rating: number;
  cuisine: string;
  priceLevel: string;
  distance: string;
}

export interface AttractionCard {
  name: string;
  description: string;
  distance: string;
  category: string;
}

export interface WeatherDay {
  date: string;
  tempHigh: number;
  tempLow: number;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  description: string;
  icon: string;
}

export interface WeatherInfo {
  temperature: string;
  rainChance: string;
  warning: string;
  daily?: WeatherDay[];
  current?: {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    description: string;
    icon: string;
  };
  city?: string;
  country?: string;
}

export interface TicketPrice {
  mode: string;
  route: string;
  price: string;
  duration: string;
  frequency: string;
  tip: string;
}

export interface TransportEstimate {
  from: string;
  to: string;
  distance: string;
  duration: string;
  suggestion: string;
}

export interface Itinerary {
  destination: string;
  days: ItineraryDay[];
  transport: string;
  hotels: HotelCard[];
  restaurants: RestaurantCard[];
  hiddenSpots: AttractionCard[];
  attractions: AttractionCard[];
  costs: CostItem[];
  total: string;
  minBudget: string;
  maxBudget: string;
  seasonTips: string[];
  weather: WeatherInfo;
  packingList: string[];
  travelTips: string[];
  travelInsights: string[];
  transportEstimates: TransportEstimate[];
  safetyLevel: string;
  bestTimeToVisit: string;
  crowdLevel: string;
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

// Static fallback generator (used when AI is unavailable)
export function generateFallbackItinerary(form: FormData): Itinerary {
  const dest = form.destination || "Your Destination";
  const numDays = Math.max(1, Math.min(365, form.days));
  const userBudget = parseFloat(form.budget) || 500;
  const currencyInfo = CURRENCIES.find((c) => c.code === form.currency) ?? CURRENCIES[0];
  const fmt = (n: number) => `${currencyInfo.symbol}${n.toLocaleString()}`;
  const dailyBudget = userBudget / numDays;

  const days: ItineraryDay[] = Array.from({ length: numDays }, (_, i) => ({
    day: i + 1,
    title: i === 0 ? `Arrival at ${dest}` : i === numDays - 1 ? `Departure from ${dest}` : `Day ${i + 1} Exploration`,
    activities: i === 0
      ? [`Arrive at ${dest}`, "Check into hotel", "Evening city walk"]
      : i === numDays - 1
      ? ["Final sightseeing", "Souvenir shopping", `Depart from ${dest}`]
      : [`Explore ${dest} attractions`, "Local food experience", "Cultural site visit"],
  }));

  const transportCost = Math.round(userBudget * 0.25);
  const hotelCost = Math.round(userBudget * 0.35);
  const foodCost = Math.round(userBudget * 0.2);
  const ticketCost = Math.round(userBudget * 0.08);
  const localTravel = Math.round(userBudget * 0.05);
  const emergency = Math.round(userBudget * 0.07);
  const total = transportCost + hotelCost + foodCost + ticketCost + localTravel + emergency;

  return {
    destination: dest,
    days,
    transport: "Auto-suggested based on budget",
    hotels: [
      { name: `Budget Inn ${dest}`, category: "budget", pricePerNight: `${fmt(Math.round(dailyBudget * 0.15))}/night`, rating: 3.8, distance: "0.5 km" },
      { name: `Comfort Stay ${dest}`, category: "mid-range", pricePerNight: `${fmt(Math.round(dailyBudget * 0.3))}/night`, rating: 4.2, distance: "1.2 km" },
      { name: `Grand ${dest} Hotel`, category: "luxury", pricePerNight: `${fmt(Math.round(dailyBudget * 0.6))}/night`, rating: 4.7, distance: "0.8 km" },
    ],
    restaurants: [
      { name: `Top Restaurant in ${dest}`, rating: 4.5, cuisine: "Local", priceLevel: "$$", distance: "0.3 km" },
      { name: `Street Food Market`, rating: 4.2, cuisine: "Street Food", priceLevel: "$", distance: "0.5 km" },
    ],
    hiddenSpots: [
      { name: `Secret viewpoint near ${dest}`, description: "A hidden gem with panoramic views", distance: "2 km", category: "Viewpoint" },
    ],
    attractions: [
      { name: `Top attraction in ${dest}`, description: "Must-visit landmark", distance: "1 km", category: "Landmark" },
    ],
    costs: [
      { label: "🚌 Transport", amount: fmt(transportCost) },
      { label: `🏨 Hotel (${numDays} nights)`, amount: fmt(hotelCost) },
      { label: `🍛 Food (${numDays} days)`, amount: fmt(foodCost) },
      { label: "🎫 Entry Tickets", amount: fmt(ticketCost) },
      { label: "🚕 Local Travel", amount: fmt(localTravel) },
      { label: "🆘 Emergency Fund", amount: fmt(emergency) },
    ],
    total: fmt(total),
    minBudget: fmt(Math.round(total * 0.8)),
    maxBudget: fmt(Math.round(total * 1.3)),
    seasonTips: [`Check local conditions for ${dest}`, "Book accommodations early", "Keep emergency cash"],
    weather: { temperature: "N/A", rainChance: "N/A", warning: "Weather data loading..." },
    packingList: ["Passport & travel documents", "Phone charger", "Toiletries", "Comfortable shoes", "Weather-appropriate clothing"],
    travelTips: [`Research ${dest} before traveling`, "Keep copies of important documents", "Learn basic local phrases"],
    travelInsights: [`${dest} offers unique cultural experiences`, "Local transport is often the most affordable option"],
    transportEstimates: [
      { from: "Airport/Station", to: "City Center", distance: "~15 km", duration: "~30 min", suggestion: "Taxi or shuttle" },
    ],
    safetyLevel: "Generally safe for tourists",
    bestTimeToVisit: "Check seasonal guides",
    crowdLevel: "Moderate",
  };
}
