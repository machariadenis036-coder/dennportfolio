import { BookOpen, GraduationCap, School } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import type { Profile } from "@/lib/portfolio-types";

export function Education({ profile }: { profile: Profile }) {
  const items = [
    { icon: School, label: "Institution", value: profile.institution },
    { icon: BookOpen, label: "Qualification", value: profile.course },
    { icon: GraduationCap, label: "Academic level", value: profile.academic_level },
  ];
  return (
    <section id="education" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading eyebrow="Education" title="Where I'm learning" />
        <div className="reveal relative overflow-hidden rounded-3xl border border-border bg-card-gradient p-8 shadow-card sm:p-12">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
              <GraduationCap className="h-10 w-10" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Currently studying</p>
              <h3 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">{profile.course}</h3>
              <p className="mt-1 text-muted-foreground">{profile.institution}</p>
            </div>
          </div>
          <div className="relative mt-10 grid gap-4 sm:grid-cols-3">
            {items.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl border border-border bg-background/50 p-5">
                <Icon className="mb-3 h-5 w-5 text-primary" />
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
                <p className="mt-1 font-medium text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
