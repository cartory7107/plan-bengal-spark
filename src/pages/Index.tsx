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
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (form: any) => {
    setLoading(true);
    // Simulate AI processing
    await new Promise((r) => setTimeout(r, 1500));
    const result = generateItinerary(form);
    setItinerary(result);
    setLoading(false);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navbar />
      <HeroSection />
      <TravelForm onSubmit={handleSubmit} loading={loading} />
      {itinerary && (
        <div ref={resultRef}>
          <ItineraryResult data={itinerary} />
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Index;
