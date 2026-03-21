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

export function generateItinerary(form: FormData): Itinerary {
  const mult = budgetMultiplier[form.budget] ?? 1;
  const baseCost = Math.round(800 * mult);

  const transportMap: Record<string, string> = {
    bus: "AC Bus from Dhaka (Shyamoli / Green Line)",
    train: "Intercity Train from Kamalapur",
    flight: "Domestic Flight (US-Bangla / Biman)",
    auto: form.budget === "low" ? "Non-AC Bus (most affordable)" : "AC Bus (best value)",
  };

  const hotelMap: Record<string, string[]> = {
    budget: ["Hotel Sea Crown", "Hotel Neelima", "Hotel Saimon"],
    seaview: ["Sayeman Beach Resort", "Royal Tulip Sea Pearl", "Long Beach Hotel"],
    luxury: ["Marriott Cox's Bazar", "Sayeman Beach Resort (Premium Suite)", "Royal Tulip Penthouse"],
    auto: form.budget === "premium"
      ? ["Sayeman Beach Resort", "Long Beach Hotel"]
      : ["Hotel Sea Crown", "Hotel Neelima"],
  };

  const itineraryDays = Array.from({ length: form.days }, (_, i) => {
    const dayNum = i + 1;
    if (dayNum === 1) return {
      day: 1, title: `Arrival at ${form.destination}`,
      activities: ["Check into hotel", "Evening beach walk at Laboni Point", "Sunset viewing & street food"],
    };
    if (dayNum === form.days) return {
      day: dayNum, title: "Departure Day",
      activities: ["Morning beach visit", "Souvenir shopping at Burmese Market", "Depart for Dhaka"],
    };
    const midActivities = [
      ["Visit Inani Beach", "Lunch at beachside restaurant", "Explore Himchari National Park"],
      ["Day trip to Maheshkhali Island", "Visit Adinath Temple", "Fresh seafood dinner"],
      ["Marine Drive road trip", "Visit Ramu Buddhist Temple", "Night beach bonfire"],
      ["Snorkeling experience", "Visit local fishing village", "Sunset photography session"],
      ["Cox's Bazar city tour", "Visit Aggameda Khyang monastery", "Shopping at local markets"],
    ];
    return {
      day: dayNum,
      title: `Explore ${form.destination} – Day ${dayNum}`,
      activities: midActivities[(dayNum - 2) % midActivities.length],
    };
  });

  const transportCost = Math.round((form.transport === "flight" ? 4500 : form.transport === "train" ? 900 : 700) * (form.budget === "premium" ? 1.5 : 1));
  const hotelCost = Math.round(baseCost * form.days);
  const foodCost = Math.round(400 * (form.food === "premium" ? 2.5 : form.food === "mixed" ? 1.5 : 1) * form.days);
  const ticketCost = Math.round(300 * form.days * mult * 0.5);
  const emergency = Math.round((transportCost + hotelCost + foodCost) * 0.1);

  return {
    destination: form.destination,
    days: itineraryDays,
    transport: transportMap[form.transport] ?? transportMap.auto,
    hotels: hotelMap[form.hotel] ?? hotelMap.auto,
    restaurants: ["Jhaubon Restaurant", "Poushee Restaurant", "Thai Monastery Kitchen", "Sea Gull Café"],
    hiddenSpots: ["Naf River Sunset Point", "Teknaf Zero Point", "Dulahazra Safari Park", "Sonadia Island"],
    attractions: ["Laboni Beach", "Inani Beach", "Himchari Waterfall", "Marine Drive", "Maheshkhali Island", "Burmese Market"],
    costs: [
      { label: "🚌 Transport (round trip)", amount: `৳${transportCost.toLocaleString()}` },
      { label: `🏨 Hotel (${form.days} nights)`, amount: `৳${hotelCost.toLocaleString()}` },
      { label: `🍛 Food (${form.days} days)`, amount: `৳${foodCost.toLocaleString()}` },
      { label: "🎫 Entry Tickets", amount: `৳${ticketCost.toLocaleString()}` },
      { label: "🆘 Emergency Fund", amount: `৳${emergency.toLocaleString()}` },
    ],
    total: `৳${(transportCost + hotelCost + foodCost + ticketCost + emergency).toLocaleString()}`,
  };
}
