import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MessageCircle, Sparkles, Globe, Cpu, Rocket, Users, MapPin, Code, Lightbulb, Heart } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import founderPhoto from "@/assets/founder-photo.png";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const children = el.querySelectorAll(".sr");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("sr-visible"); obs.unobserve(e.target); } }),
      { threshold: 0.15 }
    );
    children.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);
  return ref;
}

const FOCUS_AREAS = [
  { icon: MapPin, label: "AI Travel Planning Systems" },
  { icon: Users, label: "Lead Generation AI Tools" },
  { icon: Globe, label: "Website Intelligence Tools" },
  { icon: Cpu, label: "Automation Platforms" },
];

const WhoMadeThis = () => {
  const pageRef = useReveal();

  return (
    <div className="relative min-h-screen" ref={pageRef}>
      <AnimatedBackground />

      {/* Back nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card-solid py-3">
        <div className="container max-w-5xl mx-auto flex items-center justify-between px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors active:scale-95">
            <ArrowLeft className="w-4 h-4" /> Back to Planner
          </Link>
          <span className="text-sm font-bold tracking-tight text-foreground">
            Cartory <span className="gradient-text">Travel</span> AI
          </span>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-4 md:px-6">
        <div className="container max-w-4xl mx-auto space-y-24">

          {/* ─── SECTION 1: HERO ─── */}
          <section className="text-center space-y-5 sr">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold tracking-wide uppercase text-primary">Built with Vision from Bangladesh 🇧🇩</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.08] tracking-tight text-foreground" style={{ textWrap: "balance" }}>
              Who Made This Platform?
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed" style={{ textWrap: "pretty" }}>
              Proudly built in Bangladesh 🇧🇩 by a young tech founder building AI-powered global tools from South Asia.
            </p>
          </section>

          {/* ─── SECTION 2: CREATOR PROFILE ─── */}
          <section className="sr">
            <div className="glass-card rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
              {/* Avatar placeholder */}
              <div className="shrink-0 w-36 h-36 md:w-44 md:h-44 rounded-2xl gradient-bg flex items-center justify-center shadow-xl shadow-primary/20">
                <span className="text-5xl md:text-6xl font-extrabold text-primary-foreground select-none">AJ</span>
              </div>
              <div className="text-center md:text-left space-y-3 flex-1">
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Al Amin Jisan</h2>
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">CEO &amp; Founder of Cartory BD</p>
                <p className="text-muted-foreground leading-relaxed">
                  Al Amin Jisan is a young tech entrepreneur from Bangladesh and the founder of Cartory BD. He is building intelligent AI-powered digital platforms designed to help businesses, travelers, and creators worldwide.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  He focuses on creating practical AI solutions that solve real-world problems using automation and smart systems.
                </p>
              </div>
            </div>
          </section>

          {/* ─── SECTION 3: REPRESENTING BANGLADESH ─── */}
          <section className="sr">
            <div className="relative rounded-3xl overflow-hidden gradient-bg p-[2px]">
              <div className="bg-background rounded-[calc(1.5rem-2px)] p-8 md:p-12 text-center space-y-4">
                <div className="text-4xl">🇧🇩</div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground" style={{ textWrap: "balance" }}>
                  First AI Travel Intelligence Platform Concept Represented from Bangladesh
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  This platform represents innovation from Bangladesh and demonstrates how young developers from the country are building global-level AI tools and digital solutions.
                </p>
                <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Cartory BD aims to position Bangladesh as a future technology innovation hub in South Asia.
                </p>
              </div>
            </div>
          </section>

          {/* ─── SECTION 4: ABOUT CARTORY BD ─── */}
          <section className="sr space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">About Cartory BD</h2>
              <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Cartory BD is an emerging AI-focused technology initiative working on smart automation tools, travel intelligence platforms, and digital business solutions.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="glass-card rounded-2xl p-6 space-y-2">
                <Rocket className="w-6 h-6 text-primary" />
                <h3 className="font-bold text-foreground">Mission</h3>
                <p className="text-sm text-muted-foreground">Build powerful AI tools accessible for everyone.</p>
              </div>
              <div className="glass-card rounded-2xl p-6 space-y-2">
                <Lightbulb className="w-6 h-6 text-primary" />
                <h3 className="font-bold text-foreground">Vision</h3>
                <p className="text-sm text-muted-foreground">Represent Bangladesh globally through innovation.</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-foreground text-center">Focus Areas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {FOCUS_AREAS.map(({ icon: Icon, label }) => (
                  <div key={label} className="glass-card rounded-xl p-4 text-center space-y-2 transition-shadow hover:shadow-lg">
                    <Icon className="w-5 h-5 text-primary mx-auto" />
                    <p className="text-xs font-semibold text-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── SECTION 5: FOUNDER MESSAGE ─── */}
          <section className="sr">
            <div className="glass-card rounded-3xl p-8 md:p-12 text-center space-y-6">
              <Heart className="w-8 h-8 text-primary mx-auto" />
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">Message from the Founder</h2>
              <blockquote className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto italic">
                "This platform was created with the vision of making travel planning smarter using artificial intelligence. My goal is to represent Bangladesh through innovation and build tools that help people worldwide."
              </blockquote>
              <p className="font-bold text-foreground">— Al Amin Jisan</p>
            </div>
          </section>

          {/* ─── SECTION 6: CONTACT ─── */}
          <section className="sr text-center space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Connect with the Creator</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:cartorymain@gmail.com"
                className="glass-card rounded-2xl px-6 py-4 flex items-center gap-3 transition-all hover:shadow-lg active:scale-95 w-full sm:w-auto"
              >
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-foreground">cartorymain@gmail.com</span>
              </a>
              <a
                href="https://wa.me/8801843253599"
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-bg text-primary-foreground font-bold px-8 py-4 rounded-2xl inline-flex items-center gap-2.5 shadow-xl shadow-primary/20 transition-all hover:shadow-2xl active:scale-95 w-full sm:w-auto justify-center"
              >
                <MessageCircle className="w-5 h-5" />
                Contact the Founder
              </a>
            </div>
          </section>

          {/* ─── SECTION 7: BOTTOM BADGE ─── */}
          <section className="sr text-center">
            <div className="inline-flex items-center gap-2 gradient-bg rounded-full px-6 py-3 shadow-lg shadow-primary/20">
              <Code className="w-4 h-4 text-primary-foreground" />
              <span className="text-sm font-bold text-primary-foreground">Built with Vision from Bangladesh 🇧🇩</span>
            </div>
          </section>
        </div>
      </main>

      {/* Scroll-reveal CSS */}
      <style>{`
        .sr { opacity: 0; transform: translateY(20px); filter: blur(3px); transition: all 0.7s cubic-bezier(0.16,1,0.3,1); }
        .sr-visible { opacity: 1; transform: translateY(0); filter: blur(0); }
      `}</style>
    </div>
  );
};

export default WhoMadeThis;
