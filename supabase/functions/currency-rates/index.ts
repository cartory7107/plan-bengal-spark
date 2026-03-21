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

    // frankfurter doesn't include base or some currencies - add approximations for unsupported ones
    const rates: Record<string, number> = { [base]: 1, ...data.rates };

    // Add commonly requested currencies not in frankfurter (approximate from USD cross-rates)
    const usdRate = rates["USD"] || 1;
    const fallbacks: Record<string, number> = {
      BDT: 121.5, AED: 3.6725, PKR: 278.5, EGP: 50.5,
      NGN: 1550, SAR: 3.75, TWD: 32.5, VND: 25450,
    };
    for (const [code, approxUsd] of Object.entries(fallbacks)) {
      if (!rates[code]) {
        rates[code] = approxUsd * usdRate;
      }
    }


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
