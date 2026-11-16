import { Download, GraduationCap, Heart, Languages, Mail, MapPin, Phone, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./SectionHeading";

const CV = {
  name: "Denis Macharia Nguru",
  title: "IT Student",
  email: "machariadenis036@gmail.com",
  phone: "0117244681",
  location: "Runyenjes, Kenya",
  skills: [
    "Web development",
    "Database management",
    "IT troubleshooting",
    "Programming fundamentals",
    "Software development",
    "Data analysis",
    "Technical documentation",
  ],
  education: [
    { period: "Sep 2025 – Apr 2029", school: "Kirinyaga University", detail: "BSc. Information Technology — Undergraduate student" },
    { period: "Jan 2020 – Nov 2023", school: "Gatumbi Secondary School", detail: "High School" },
  ],
  languages: ["English"],
  hobbies: ["Building computer projects", "Web development"],
};

export function Resume() {
  return (
    <section id="cv" className="relative py-24 sm:py-32 print:py-0">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading eyebrow="CV" title="My resume" subtitle="A quick overview of my background, skills and education." />
        <div className="reveal rounded-3xl border border-border bg-card-gradient p-6 shadow-card sm:p-10">
          <div className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="font-display text-3xl font-bold text-foreground">{CV.name}</h3>
              <p className="mt-1 text-primary">{CV.title}</p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" />{CV.email}</span>
                <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />{CV.phone}</span>
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{CV.location}</span>
              </div>
            </div>
            <Button variant="hero" className="rounded-full print:hidden" onClick={() => window.print()}>
              <Download /> Download CV
            </Button>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-[1.3fr_1fr]">
            <div>
              <h4 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary"><GraduationCap className="h-4 w-4" /> Education</h4>
              <ol className="space-y-5 border-l border-border pl-5">
                {CV.education.map((e) => (
                  <li key={e.school} className="relative">
                    <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{e.period}</p>
                    <p className="mt-1 font-semibold text-foreground">{e.school}</p>
                    <p className="text-sm text-muted-foreground">{e.detail}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary"><Wrench className="h-4 w-4" /> Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {CV.skills.map((s) => (
                    <span key={s} className="rounded-full border border-border bg-background/50 px-3 py-1 text-sm text-foreground">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary"><Languages className="h-4 w-4" /> Languages</h4>
                <p className="text-sm text-foreground">{CV.languages.join(", ")}</p>
              </div>
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary"><Heart className="h-4 w-4" /> Hobbies</h4>
                <p className="text-sm text-foreground">{CV.hobbies.join(" · ")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
