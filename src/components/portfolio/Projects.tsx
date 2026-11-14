import { ExternalLink, Github, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./SectionHeading";
import type { Project } from "@/lib/portfolio-types";

function ConverterArt({ title }: { title: string }) {
  const rows = [
    ["BIN", "1010 1101"],
    ["OCT", "255"],
    ["DEC", "173"],
    ["HEX", "AD"],
  ];
  return (
    <div className="relative flex h-full min-h-64 items-center justify-center overflow-hidden bg-hero p-8">
      <div className="absolute inset-0 grid-pattern" />
      <div className="glass relative w-full max-w-xs rounded-2xl border border-border p-5 shadow-glow">
        <div className="mb-4 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-chart-4/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
          <span className="ml-2 truncate text-[10px] uppercase tracking-widest text-muted-foreground">{title}</span>
        </div>
        <div className="space-y-2 font-mono text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between rounded-lg bg-background/60 px-3 py-2">
              <span className="text-xs text-primary">{k}</span>
              <span className="text-foreground">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="Projects" title="Things I've built" subtitle="A growing collection of projects — each one a step in my learning journey." />
        <div className="space-y-6">
          {projects.map((p, i) => (
            <article
              key={p.id}
              className={`reveal group grid overflow-hidden rounded-3xl border border-border bg-card-gradient shadow-card transition-all hover:border-primary/40 ${p.featured || projects.length === 1 ? "lg:grid-cols-2" : "md:grid-cols-[0.8fr_1.2fr]"}`}
            >
              <div className={`overflow-hidden ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                {p.image_url ? (
                  <img src={p.image_url} alt={`${p.title} preview`} loading="lazy" className="h-full min-h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <ConverterArt title={p.title} />
                )}
              </div>
              <div className="flex flex-col justify-center gap-5 p-7 sm:p-10">
                {p.featured && (
                  <span className="flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <Star className="h-3.5 w-3.5" /> Featured project
                  </span>
                )}
                <h3 className="text-2xl font-bold text-foreground sm:text-3xl">{p.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{p.description}</p>
                {p.tech.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <span key={t} className="rounded-full border border-border px-3 py-1 font-mono text-xs text-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-3 pt-2">
                  {p.repo_url && (
                    <Button asChild variant="hero" size="xl">
                      <a href={p.repo_url} target="_blank" rel="noopener noreferrer">
                        <Github /> View Source Code
                      </a>
                    </Button>
                  )}
                  {p.demo_url && (
                    <Button asChild variant="glass" size="xl">
                      <a href={p.demo_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink /> Live Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </article>
          ))}
          {projects.length === 0 && <p className="text-center text-muted-foreground">Projects coming soon.</p>}
        </div>
      </div>
    </section>
  );
}
