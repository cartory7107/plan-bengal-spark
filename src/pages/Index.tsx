import { useState, useRef } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TravelForm from "@/components/TravelForm";
import ItineraryResult from "@/components/ItineraryResult";
import Footer from "@/components/Footer";
import AIChatBubble from "@/components/AIChatBubble";
import { generateDynamicItinerary } from "@/lib/travelApi";
import type { Itinerary, FormData } from "@/lib/generateItinerary";
import { toast } from "sonner";
import { detectUserCurrency } from "@/hooks/useCurrencyRates";

const Index = () => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("English");
  const [displayCurrency, setDisplayCurrency] = useState(() => detectUserCurrency());
  const [originalCurrency, setOriginalCurrency] = useState("USD");
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (form: FormData) => {
    setLoading(true);
    setOriginalCurrency(form.currency);
    setDisplayCurrency(form.currency);
    try {
      const result = await generateDynamicItinerary(form);
      setItinerary(result);
      toast.success("Your AI travel plan is ready!");
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      console.error("Plan generation error:", err);
      toast.error("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navbar language={language} onLanguageChange={setLanguage} />
      <HeroSection language={language} />
      <TravelForm onSubmit={handleSubmit} loading={loading} language={language} />
      {itinerary && (
        <div ref={resultRef}>
          <ItineraryResult
            data={itinerary}
            language={language}
            originalCurrency={originalCurrency}
            displayCurrency={displayCurrency}
            onCurrencyChange={setDisplayCurrency}
          />
        </div>
      )}
      <Footer language={language} />
    </div>
  );
};

export default Index;
