
# Plan: Add Real-Time Ticket & Transport Expense Section

## What We're Building
A new "Ticket & Transport Prices" section in the itinerary results that shows estimated real-time prices for buses, trains, flights, local rickshaws/taxis, metro, and other country-specific transport — all dynamically generated per destination.

## Approach
Since there's no single free API for worldwide transport ticket prices, we'll extend the **AI travel planner prompt** to generate destination-specific transport ticket estimates. The AI already produces realistic, location-aware pricing — we'll add a dedicated `ticketPrices` array to its output.

## Changes

### 1. Update AI Prompt (Edge Function)
**File:** `supabase/functions/ai-travel-planner/index.ts`
- Add `ticketPrices` to the JSON schema in the prompt
- Each ticket item: `{ mode, route, price, duration, frequency, tip }`
- Modes: bus, train, flight, metro, taxi, rickshaw, ferry, tuk-tuk, etc.
- Request 8-10 ticket estimates covering both intercity and local transport
- Prices must be destination-specific and in the user's selected currency

### 2. Add TypeScript Type
**File:** `src/lib/generateItinerary.ts`
- Add `TicketPrice` interface: `{ mode, route, price, duration, frequency, tip }`
- Add `ticketPrices` to the `Itinerary` interface

### 3. Update API Layer
**File:** `src/lib/travelApi.ts`
- Map `ticketPrices` from AI response with fallback to empty array

### 4. Add UI Section
**File:** `src/components/ItineraryResult.tsx`
- New `TicketPriceCard` component showing transport mode icon, route, price, duration, frequency
- New section with `Ticket` icon between Transport Estimates and Packing Checklist
- Each card shows: mode emoji, route (e.g. "Dhaka → Cox's Bazar"), price, duration, frequency, and a pro tip

### 5. Update Translations
**File:** `src/lib/translations.ts`
- Add translation key for "Ticket & Transport Prices" section title

## Example Output
For **Cox's Bazar, Bangladesh**:
- 🚌 Bus: Dhaka → Cox's Bazar — ৳800-1200 — 10-12 hrs — Every 30 min
- ✈️ Flight: Dhaka → Cox's Bazar — ৳3500-6000 — 1 hr — 3 daily
- 🛺 CNG Auto: Local — ৳50-150 — varies
- 🚢 Ferry: Cox's Bazar → Saint Martin — ৳600-1000 — 3 hrs

For **New York, USA**:
- ✈️ Flight: JFK → LaGuardia shuttle — $150-300
- 🚇 Metro: Subway pass — $2.90/ride or $34/week
- 🚕 Taxi: Manhattan to Brooklyn — $25-40
- 🚌 Bus: NYC → Washington DC — $15-45

## Technical Details
- No new API keys needed — uses existing AI gateway
- Redeploy edge function after prompt update
- Fallback: empty array if AI doesn't return ticket data
