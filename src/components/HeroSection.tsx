import { MapPin, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { t } from "@/lib/translations";

const HeroSection = ({ language = "English" }: { language?: string }) => {
  const ref = useScrollReveal();

  return (
    <section className="min-h-[92vh] flex items-center justify-center section-padding pt-28" ref={ref}>
      <div className="container max-w-4xl mx-auto text-center">
        <div className="reveal inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-8">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">
            {t(language, "heroBadge")}
          </span>
        </div>

        <h1 className="reveal reveal-d1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-foreground mb-6" style={{ textWrap: "balance" }}>
          {t(language, "heroTitle1")}{" "}
          <span className="gradient-text">{t(language, "heroTitle2")}</span> {t(language, "heroTitle3")}
        </h1>

        <p className="reveal reveal-d2 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed" style={{ textWrap: "pretty" }}>
          {t(language, "heroSubtitle")}
        </p>

        <a
          href="#planner"
          className="reveal reveal-d3 inline-flex items-center gap-2.5 gradient-bg text-primary-foreground font-bold text-lg px-8 py-4 rounded-2xl shadow-xl shadow-primary/25 transition-all duration-200 hover:shadow-2xl hover:shadow-primary/30 active:scale-[0.97]"
        >
          <Sparkles className="w-5 h-5" />
          {t(language, "heroCta")}
        </a>

        <div className="reveal reveal-d4 mt-16 flex items-center justify-center gap-8 md:gap-12 text-muted-foreground">
          {[
            ["🌍", t(language, "heroWorldwide")],
            ["AI", t(language, "heroPowered")],
            ["20+", t(language, "heroLanguages")],
          ].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold gradient-text">{num}</div>
              <div className="text-xs font-medium mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
