import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { normalizeEdgeFunctionError } from "@/lib/edgeFunctionErrors";

interface CurrencyRates {
  rates: Record<string, number>;
  base: string;
  date: string;
  loading: boolean;
  error: string | null;
  convert: (amount: number, from: string, to: string) => number | null;
  formatDual: (priceStr: string, originalCurrency: string, targetCurrency: string) => string;
}

// Parse a price string like "$120", "৳14,000", "120 USD", "USD 120" etc.
function parsePrice(priceStr: string): { amount: number; symbol: string } | null {
  const cleaned = priceStr.replace(/,/g, "");
  const match = cleaned.match(/([\d.]+)/);
  if (!match) return null;
  const amount = parseFloat(match[1]);
  if (isNaN(amount)) return null;
  const symbol = cleaned.replace(match[0], "").trim();
  return { amount, symbol };
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£", BDT: "৳", INR: "₹", JPY: "¥",
  CNY: "¥", KRW: "₩", SAR: "﷼", AED: "د.إ", CAD: "C$", AUD: "A$",
  MYR: "RM", THB: "฿", SGD: "S$", TRY: "₺", PKR: "₨", EGP: "E£",
  NGN: "₦", BRL: "R$", MXN: "MX$", ZAR: "R", SEK: "kr", NOK: "kr",
  CHF: "CHF", NZD: "NZ$",
};

export function useCurrencyRates(baseCurrency = "USD"): CurrencyRates {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [base, setBase] = useState(baseCurrency);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchRates() {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fnError } = await supabase.functions.invoke("currency-rates", {
          body: { base: "USD" }, // Always fetch USD-based rates for consistency
        });
        if (fnError) throw new Error(fnError.message);
        if (data?.error) throw new Error(data.error);
        if (!cancelled) {
          setRates(data.rates);
          setBase(data.base);
          setDate(data.date);
        }
      } catch (err: any) {
        console.error("Currency rates fetch error:", err);
        if (!cancelled) setError(normalizeEdgeFunctionError(err, "Failed to load currency rates"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchRates();
    return () => { cancelled = true; };
  }, []);

  const convert = useCallback(
    (amount: number, from: string, to: string): number | null => {
      if (from === to) return amount;
      const fromRate = rates[from];
      const toRate = rates[to];
      if (!fromRate || !toRate) return null;
      // Convert: amount in "from" → USD → "to"
      return (amount / fromRate) * toRate;
    },
    [rates]
  );

  const formatDual = useCallback(
    (priceStr: string, originalCurrency: string, targetCurrency: string): string => {
      if (originalCurrency === targetCurrency) return priceStr;
      const parsed = parsePrice(priceStr);
      if (!parsed) return priceStr;
      const converted = convert(parsed.amount, originalCurrency, targetCurrency);
      if (converted === null) return priceStr;
      const sym = CURRENCY_SYMBOLS[targetCurrency] || targetCurrency;
      const formatted = converted >= 1000
        ? converted.toLocaleString(undefined, { maximumFractionDigits: 0 })
        : converted.toLocaleString(undefined, { maximumFractionDigits: 2 });
      return `${priceStr} (≈ ${sym}${formatted} ${targetCurrency})`;
    },
    [convert]
  );

  return { rates, base, date, loading, error, convert, formatDual };
}

// Auto-detect user's likely currency from browser locale
export function detectUserCurrency(): string {
  try {
    const locale = navigator.language || "en-US";
    const regionMap: Record<string, string> = {
      BD: "BDT", US: "USD", GB: "GBP", IN: "INR", AE: "AED",
      CA: "CAD", AU: "AUD", JP: "JPY", CN: "CNY", KR: "KRW",
      SA: "SAR", MY: "MYR", TH: "THB", SG: "SGD", TR: "TRY",
      PK: "PKR", EG: "EGP", NG: "NGN", BR: "BRL", MX: "MXN",
      ZA: "ZAR", SE: "SEK", NO: "NOK", CH: "CHF", NZ: "NZD",
      DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", NL: "EUR", PT: "EUR",
    };
    const parts = locale.split("-");
    const region = parts.length > 1 ? parts[1].toUpperCase() : parts[0].toUpperCase();
    return regionMap[region] || "USD";
  } catch {
    return "USD";
  }
}
