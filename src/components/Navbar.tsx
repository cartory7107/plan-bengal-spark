import { useState, useEffect } from "react";
import { Plane } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-8 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-card-solid py-3" : "py-5 bg-transparent"
      }`}
    >
      <div className="container max-w-6xl mx-auto flex items-center justify-between px-4">
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="gradient-bg rounded-xl p-2 transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
            <Plane className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Trip<span className="gradient-text">Budget</span> AI
          </span>
        </a>
        <a
          href="#planner"
          className="gradient-bg text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 active:scale-95"
        >
          Start Planning
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
