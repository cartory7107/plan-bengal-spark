import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { base = "USD" } = await req.json().catch(() => ({}));

    // Use frankfurter.app - completely free, no API key needed
    const res = await fetch(
      `https://api.frankfurter.app/latest?from=${encodeURIComponent(base)}`
    );

    if (!res.ok) {
      throw new Error(`Frankfurter API error [${res.status}]`);
    }

    const data = await res.json();

    // frankfurter doesn't include the base currency in rates, add it
    const rates: Record<string, number> = { [base]: 1, ...data.rates };

    return new Response(
      JSON.stringify({ base: data.base, date: data.date, rates }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Currency rates error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
