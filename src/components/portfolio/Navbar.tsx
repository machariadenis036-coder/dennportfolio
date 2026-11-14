import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/portfolio-types";
import { cn } from "@/lib/utils";

export function Navbar({ brand }: { brand: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      let current = "home";
      for (const l of NAV_LINKS) {
        const el = document.getElementById(l.id);
        if (el && el.getBoundingClientRect().top <= 120) current = l.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [first = "D", ...rest] = brand.split(" ");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass border-b border-border py-3" : "py-5",
      )}
    >
      <nav className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 sm:px-8 lg:flex lg:justify-between">
        <a href="#home" className="flex min-w-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-primary font-display text-sm font-extrabold text-primary-foreground">
            {first.charAt(0)}
          </span>
          <span className="truncate font-display text-sm font-bold tracking-wide text-foreground">
            {first} <span className="text-muted-foreground">{rest.join(" ")}</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 rounded-full border border-border glass px-2 py-1.5 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm transition-colors",
                  active === l.id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button asChild variant="hero" className="hidden rounded-full sm:inline-flex">
            <a href="#contact">Let's Talk</a>
          </Button>
          <Button
            variant="glass"
            size="icon"
            className="rounded-full lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {open && (
        <div className="glass mx-5 mt-3 rounded-2xl border border-border p-3 lg:hidden animate-fade-up">
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-xl px-4 py-3 text-sm",
                active === l.id ? "bg-primary/15 text-primary" : "text-foreground hover:bg-muted",
              )}
            >
              {l.label}
            </a>
          ))}
          <Button asChild variant="hero" className="mt-2 w-full rounded-xl">
            <a href="#contact" onClick={() => setOpen(false)}>
              Let's Talk
            </a>
          </Button>
        </div>
      )}
    </header>
  );
}
