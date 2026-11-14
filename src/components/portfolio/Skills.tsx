import { SectionHeading } from "./SectionHeading";
import { categoryIcon, skillIcon } from "./skill-icons";
import { SKILL_CATEGORIES, type Skill } from "@/lib/portfolio-types";

export function Skills({ skills }: { skills: Skill[] }) {
  const known = SKILL_CATEGORIES as readonly string[];
  const extra = Array.from(new Set(skills.map((s) => s.category))).filter((c) => !known.includes(c));
  const categories = [...known, ...extra].filter((c) => skills.some((s) => s.category === c));
  const technical = categories.filter((c) => c !== "Professional Skills");
  const professional = skills.filter((s) => s.category === "Professional Skills");

  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="Skills" title="Tools I work with" subtitle="Technologies and abilities I've been building through study and hands-on projects." />

        <div className="grid gap-5 md:grid-cols-2">
          {technical.map((cat) => {
            const CatIcon = categoryIcon(cat);
            return (
              <div key={cat} className="reveal rounded-3xl border border-border bg-card-gradient p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary/40">
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <CatIcon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">{cat}</h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {skills.filter((s) => s.category === cat).map((s) => {
                    const Icon = skillIcon(s.name);
                    return (
                      <span key={s.id} className="group flex items-center gap-2 rounded-xl border border-border bg-background/50 px-3.5 py-2 text-sm text-foreground transition-colors hover:border-primary/50 hover:text-primary">
                        <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                        {s.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {professional.length > 0 && (
          <div className="reveal mt-5 rounded-3xl border border-primary/20 bg-card-gradient p-6 sm:p-8">
            <h3 className="mb-5 text-lg font-semibold text-foreground">Professional Skills</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {professional.map((s) => {
                const Icon = skillIcon(s.name);
                return (
                  <div key={s.id} className="flex items-center gap-3 rounded-2xl bg-background/50 p-4">
                    <Icon className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm text-foreground">{s.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
