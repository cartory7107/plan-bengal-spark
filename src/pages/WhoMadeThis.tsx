import type { ReactNode, RefObject } from "react";
import { ArrowLeft, BadgeCheck, Mail, MessageCircle, Target, Telescope, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const RevealSection = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
  const ref = useScrollReveal() as RefObject<HTMLElement>;

  return (
    <section
      ref={ref}
      className={`opacity-0 translate-y-6 transition-all duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0 ${className}`}
    >
      {children}
    </section>
  );
};

const WhoMadeThis = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-background to-green-100/70 text-foreground">
      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <span className="rounded-full border border-green-200 bg-green-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-green-900">
            Built with Vision from Bangladesh 🇧🇩
          </span>
        </div>

        <RevealSection className="glass-card-solid rounded-3xl p-6 md:p-10">
          <p className="mb-3 inline-flex rounded-full bg-green-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-green-900">
            WHO MADE THIS
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">Who Made This Platform?</h1>
          <p className="mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">
            Proudly built in Bangladesh 🇧🇩 by a young tech founder building AI-powered global tools from South Asia.
          </p>
        </RevealSection>

        <RevealSection className="mt-8 grid gap-6 rounded-3xl border border-border bg-white/80 p-6 shadow-sm md:grid-cols-[220px,1fr] md:p-8">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <img
              src="/placeholder.svg"
              alt="Creator profile placeholder"
              className="h-40 w-40 rounded-2xl border border-border bg-white object-cover p-3"
            />
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">
              <User className="h-3.5 w-3.5" />
              Creator Profile
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold">Al Amin Jisan</h2>
            <p className="mt-1 text-sm font-semibold text-primary">CEO and Founder of Cartory BD</p>
            <p className="mt-4 text-muted-foreground">
              Al Amin Jisan is a young tech entrepreneur from Bangladesh and the founder of Cartory BD. He is
              building intelligent AI-powered digital platforms designed to help businesses, travelers, and creators
              worldwide.
            </p>
            <p className="mt-3 text-muted-foreground">
              He focuses on creating practical AI solutions that solve real-world problems using automation and smart
              systems.
            </p>
          </div>
        </RevealSection>

        <RevealSection className="mt-8 rounded-3xl border border-green-300/60 bg-gradient-to-r from-green-100 to-emerald-100 p-6 md:p-8">
          <h3 className="text-xl font-bold md:text-2xl">
            First AI Travel Intelligence Platform Concept Represented from Bangladesh 🇧🇩
          </h3>
          <p className="mt-4 text-emerald-950/85">
            This platform represents innovation from Bangladesh and demonstrates how young developers from the country
            are building global-level AI tools and digital solutions.
          </p>
          <p className="mt-3 text-emerald-950/85">
            Cartory BD aims to position Bangladesh as a future technology innovation hub in South Asia.
          </p>
        </RevealSection>

        <RevealSection className="mt-8 rounded-3xl border border-border bg-white/85 p-6 shadow-sm md:p-8">
          <h3 className="text-2xl font-bold">About Cartory BD</h3>
          <p className="mt-4 text-muted-foreground">
            Cartory BD is an emerging AI-focused technology initiative working on smart automation tools, travel
            intelligence platforms, and digital business solutions.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-secondary/60 p-4">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                <Target className="h-4 w-4" /> Mission
              </p>
              <p className="mt-2 font-medium">Build powerful AI tools accessible for everyone</p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary/60 p-4">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                <Telescope className="h-4 w-4" /> Vision
              </p>
              <p className="mt-2 font-medium">Represent Bangladesh globally through innovation</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-background p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Focus Areas</p>
            <ul className="mt-3 grid list-disc gap-1 pl-6 text-muted-foreground md:grid-cols-2">
              <li>AI Travel Planning Systems</li>
              <li>Lead Generation AI Tools</li>
              <li>Website Intelligence Tools</li>
              <li>Automation Platforms</li>
            </ul>
          </div>
        </RevealSection>

        <RevealSection className="mt-8 rounded-3xl border border-border bg-white/85 p-6 shadow-sm md:p-8">
          <h3 className="text-2xl font-bold">Message from the Founder</h3>
          <blockquote className="mt-4 border-l-4 border-primary pl-4 text-muted-foreground">
            This platform was created with the vision of making travel planning smarter using artificial intelligence.
            My goal is to represent Bangladesh through innovation and build tools that help people worldwide.
            <footer className="mt-3 font-semibold text-foreground">— Al Amin Jisan</footer>
          </blockquote>
        </RevealSection>

        <RevealSection className="mt-8 rounded-3xl border border-border bg-white/90 p-6 shadow-sm md:p-8">
          <h3 className="text-2xl font-bold">Connect with the Creator</h3>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="inline-flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 text-primary" />
              Business Email: <span className="font-medium text-foreground">cartorymaingmail.com</span>
            </p>
            <a
              href="https://wa.me/8801843253599"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full gradient-bg px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:shadow-lg hover:shadow-primary/25"
            >
              <MessageCircle className="h-4 w-4" />
              Contact the Founder
            </a>
          </div>
        </RevealSection>

        <RevealSection className="mt-8 rounded-3xl border border-green-200 bg-green-50/90 p-5 text-center">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-green-900 md:text-base">
            <BadgeCheck className="h-4 w-4" />
            Built with Vision from Bangladesh 🇧🇩
          </p>
        </RevealSection>
      </div>
    </main>
  );
};

export default WhoMadeThis;
