import type { Database } from "@/integrations/supabase/types";

export type Profile = Database["public"]["Tables"]["site_profile"]["Row"];
export type Skill = Database["public"]["Tables"]["skills"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];

export const SKILL_CATEGORIES = [
  "Web Development",
  "Programming",
  "Database Management",
  "Other Technical Skills",
  "Professional Skills",
] as const;

export const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "cv", label: "CV" },
  { id: "contact", label: "Contact" },
] as const;
