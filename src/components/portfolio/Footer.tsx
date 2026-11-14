import { Github, Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { NAV_LINKS, type Profile } from "@/lib/portfolio-types";

export function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.3fr_1fr_auto]">
        <div>
          <p className="font-display text-lg font-bold text-foreground">{profile.brand}</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">{profile.footer_tagline}</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-2 text-sm">
          {NAV_LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} className="text-muted-foreground hover:text-primary">{l.label}</a>
          ))}
        </nav>
        <div className="flex gap-3">
          <a href={profile.github_url} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary"><Github className="h-4 w-4" /></a>
          <a href={`mailto:${profile.email}`} aria-label="Email" className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary"><Mail className="h-4 w-4" /></a>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-5 py-5 text-xs text-muted-foreground sm:px-8">
          <p>© {new Date().getFullYear()} {profile.brand}. All rights reserved.</p>
          <Link to="/admin" className="hover:text-primary">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
