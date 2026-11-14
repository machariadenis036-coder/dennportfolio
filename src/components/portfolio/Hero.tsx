import { ArrowDownRight, ArrowRight, Github, GraduationCap, Mail, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/contact";
import type { Profile } from "@/lib/portfolio-types";
import portrait from "@/assets/denis-portrait.jpg.asset.json";

const FOCUS = ["Web Development", "Programming", "Database Management", "Graphic Design", "Problem Solving"];

export function Hero({ profile, projectCount }: { profile: Profile; projectCount: number }) {
  const photo = profile.photo_url || portrait.url;
  const roles = profile.title.split("|").map((r) => r.trim()).filter(Boolean);

  return (
    <section id="home" className="relative isolate overflow-hidden bg-hero pt-28 lg:min-h-screen lg:pt-24">
      <div className="pointer-events-none absolute inset-0 -z-10 grid-pattern" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Giant name behind the portrait */}
        <h1
          aria-label={`${profile.name} — ${profile.title}`}
          className="pointer-events-none select-none text-center font-display font-extrabold uppercase leading-[0.8] tracking-[-0.06em] text-foreground animate-fade-up text-[26vw] lg:absolute lg:inset-x-0 lg:top-6 lg:text-[15.5rem] xl:text-[18rem]"
        >
          {profile.name}
        </h1>

        <div className="relative grid items-end gap-10 lg:min-h-[calc(100vh-6rem)] lg:grid-cols-[1fr_minmax(0,420px)_1fr]">
          {/* Left column */}
          <div className="order-2 space-y-7 pb-10 animate-fade-up [animation-delay:200ms] lg:order-1 lg:pb-28">
            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
                <span className="h-px w-8 bg-primary" /> Hello, I'm {profile.name}
              </p>
              <div className="flex flex-wrap gap-2">
                {roles.map((r) => (
                  <span key={r} className="rounded-full border border-border glass px-3 py-1 text-xs text-foreground">
                    {r}
                  </span>
                ))}
              </div>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{profile.hero_intro}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <a href="#projects">
                  Explore My Projects <ArrowRight />
                </a>
              </Button>
              <Button asChild variant="glass" size="xl">
                <a href="#contact">Contact Me</a>
              </Button>
            </div>
          </div>

          {/* Portrait */}
          <div className="relative order-1 mx-auto w-full max-w-[340px] animate-fade-up [animation-delay:100ms] lg:order-2 lg:max-w-none lg:self-end">
            <div className="absolute -inset-6 -z-10 rounded-full bg-gradient-primary opacity-30 blur-3xl" />
            <div className="relative overflow-hidden rounded-t-[999px] rounded-b-3xl border border-primary/30 shadow-glow">
              <img
                src={photo}
                alt={`Portrait of ${profile.name}`}
                width={656}
                height={1430}
                fetchPriority="high"
                className="aspect-[3/4] w-full object-cover object-[50%_18%]"
              />
              <div className="absolute inset-0 bg-fade-bottom" />
            </div>

            {/* Floating badges */}
            <div className="glass absolute -left-6 top-1/3 hidden items-center gap-2 rounded-2xl border border-border px-3 py-2 text-xs shadow-card animate-float-slow sm:flex">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
              </span>
              Open to opportunities
            </div>
            <div className="glass absolute -right-5 bottom-28 hidden items-center gap-2 rounded-2xl border border-border px-3 py-2 text-xs shadow-card animate-float-slow [animation-delay:1.5s] sm:flex">
              <GraduationCap className="h-4 w-4 text-primary" /> {profile.institution}
            </div>

            {/* Outlined word overlapping the portrait */}
            <p
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-3 text-center font-display text-5xl font-extrabold uppercase tracking-[-0.04em] text-outline sm:text-6xl lg:-left-40 lg:-right-40 lg:text-8xl"
            >
              Developer
            </p>
          </div>

          {/* Right column */}
          <div className="order-3 hidden flex-col items-end gap-10 pb-28 text-right animate-fade-up [animation-delay:300ms] lg:flex">
            <div className="space-y-1 text-sm">
              <p className="flex items-center justify-end gap-1.5 text-foreground">
                <MapPin className="h-4 w-4 text-primary" /> Based in {profile.location}
              </p>
              <p className="text-muted-foreground">Available for collaboration</p>
            </div>
            <div>
              <p className="font-display text-6xl font-bold text-gradient">
                {String(projectCount).padStart(2, "0")}
              </p>
              <p className="text-sm text-muted-foreground">
                {projectCount === 1 ? "Featured project" : "Projects"} on GitHub
              </p>
            </div>
            <div className="flex gap-2">
              <SocialIcon href={profile.github_url} label="GitHub"><Github /></SocialIcon>
              <SocialIcon href={`mailto:${profile.email}`} label="Email"><Mail /></SocialIcon>
              <SocialIcon href={whatsappLink(profile.whatsapp)} label="WhatsApp"><MessageCircle /></SocialIcon>
            </div>
            <a href="#about" className="group flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary">
              Scroll <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </a>
          </div>

          {/* Mobile socials */}
          <div className="order-4 -mt-4 flex gap-2 pb-8 lg:hidden">
            <SocialIcon href={profile.github_url} label="GitHub"><Github /></SocialIcon>
            <SocialIcon href={`mailto:${profile.email}`} label="Email"><Mail /></SocialIcon>
            <SocialIcon href={whatsappLink(profile.whatsapp)} label="WhatsApp"><MessageCircle /></SocialIcon>
          </div>
        </div>
      </div>

      {/* Focus marquee */}
      <div className="relative border-y border-border bg-background/60 py-4 backdrop-blur">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {[...FOCUS, ...FOCUS, ...FOCUS, ...FOCUS].map((f, i) => (
            <span key={i} className="flex items-center gap-10 font-display text-sm uppercase tracking-[0.2em] text-muted-foreground">
              {f} <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  return (
    <Button asChild variant="glass" size="icon" className="h-11 w-11 rounded-full">
      <a href={href} aria-label={label} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    </Button>
  );
}
