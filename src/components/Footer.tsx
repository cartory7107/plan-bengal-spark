import { Link } from "react-router-dom";
import { Plane, MessageCircle, Mail } from "lucide-react";
import { t } from "@/lib/translations";

const Footer = ({ language = "English" }: { language?: string }) => (
  <footer className="section-padding-sm border-t border-border/50">
    <div className="container max-w-4xl mx-auto text-center space-y-6">
      <a href="#" className="inline-flex items-center gap-2.5 group">
        <div className="gradient-bg rounded-xl p-2">
          <Plane className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold tracking-tight text-foreground">
          Cartory <span className="gradient-text">Travel</span> AI
        </span>
      </a>

      <p className="text-sm text-muted-foreground">
        {t(language, "footerTagline")}
      </p>

      <div className="flex items-center justify-center gap-4">
        <a href="https://wa.me/" target="_blank" rel="noopener noreferrer"
          className="glass-card rounded-full p-3 transition-all duration-200 hover:shadow-lg active:scale-95"
          aria-label="WhatsApp Support"
        >
          <MessageCircle className="w-5 h-5 text-primary" />
        </a>
        <a href="mailto:support@cartorytravel.ai"
          className="glass-card rounded-full p-3 transition-all duration-200 hover:shadow-lg active:scale-95"
          aria-label="Email Support"
        >
          <Mail className="w-5 h-5 text-primary" />
        </a>
      </div>

      <p className="text-xs text-muted-foreground pt-4">
        {t(language, "madeBy")} <span className="font-semibold text-foreground">AL-AMIN JISAN</span>
      </p>
    </div>
  </footer>
);

export default Footer;
