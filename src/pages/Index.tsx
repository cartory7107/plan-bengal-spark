import { useState, useRef } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TravelForm from "@/components/TravelForm";
import ItineraryResult, { type Itinerary } from "@/components/ItineraryResult";
import Footer from "@/components/Footer";
import { generateItinerary } from "@/lib/generateItinerary";

const Index = () => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("English");
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (form: any) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const result = generateItinerary({ ...form, language });
    setItinerary(result);
    setLoading(false);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navbar language={language} onLanguageChange={setLanguage} />
      <HeroSection language={language} />
      <TravelForm onSubmit={handleSubmit} loading={loading} language={language} />
      {itinerary && (
        <div ref={resultRef}>
          <ItineraryResult data={itinerary} language={language} />
        </div>
      )}
      <Footer language={language} />
    </div>
  );
};

export default Index;
