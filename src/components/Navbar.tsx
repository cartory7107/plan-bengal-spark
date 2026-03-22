import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plane, Globe } from "lucide-react";
import { t } from "@/lib/translations";

const LANGUAGES = [
  "English","Bangla","Hindi","Urdu","Arabic","Spanish","French","German","Chinese",
  "Japanese","Korean","Turkish","Malay","Indonesian","Portuguese","Italian","Russian",
  "Thai","Vietnamese","Dutch"
];

interface NavbarProps {
  language?: string;
  onLanguageChange?: (lang: string) => void;
}

const Navbar = ({ language = "English", onLanguageChange }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "glass-card-solid py-3" : "py-5 bg-transparent"
    }`}>
      <div className="container max-w-6xl mx-auto flex items-center justify-between px-4">
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="gradient-bg rounded-xl p-2 transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
            <Plane className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Cartory <span className="gradient-text">Travel</span> AI
          </span>
        </a>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Globe className="w-4 h-4" />
            <select value={language} onChange={(e) => onLanguageChange?.(e.target.value)}
              className="bg-transparent text-sm font-medium text-foreground border-none outline-none cursor-pointer"
            >
              {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <Link to="/who-made-this" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Who Made This
          </Link>
          <a href="#planner"
            className="gradient-bg text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 active:scale-95"
          >
            {t(language, "startPlanning")}
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
