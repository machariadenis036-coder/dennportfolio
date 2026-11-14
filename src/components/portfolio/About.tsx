import { CheckCircle2 } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import type { Profile } from "@/lib/portfolio-types";
import portrait from "@/assets/denis-portrait.jpg.asset.json";

export function About({ profile }: { profile: Profile }) {
  const paragraphs = profile.about.split(/\n\s*\n/).filter(Boolean);
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="About me" title="Curious mind, practical builder" />
        <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="reveal relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-primary opacity-20 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-border">
              <img
                src={profile.photo_url || portrait.url}
                alt={`${profile.name} at ${profile.institution}`}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover object-[50%_20%]"
              />
            </div>
            <div className="glass absolute -bottom-5 left-1/2 w-[85%] -translate-x-1/2 rounded-2xl border border-border px-5 py-4 text-center">
              <p className="font-display text-sm font-semibold text-foreground">{profile.course}</p>
              <p className="text-xs text-muted-foreground">{profile.institution}</p>
            </div>
          </div>

          <div className="reveal space-y-6">
            {paragraphs.map((p, i) => (
              <p key={i} className={i === 0 ? "text-lg leading-relaxed text-foreground" : "leading-relaxed text-muted-foreground"}>
                {p}
              </p>
            ))}
            {profile.highlights.length > 0 && (
              <ul className="grid gap-3 pt-2 sm:grid-cols-2">
                {profile.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 rounded-2xl border border-border bg-card-gradient p-4 text-sm text-foreground transition-colors hover:border-primary/40">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
