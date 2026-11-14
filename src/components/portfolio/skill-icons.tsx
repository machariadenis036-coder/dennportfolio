import type { IconType } from "react-icons";
import { SiHtml5, SiCss, SiJavascript, SiPython, SiCplusplus, SiMysql, SiTypescript, SiReact, SiGit, SiPhp, SiNodedotjs, SiTailwindcss } from "react-icons/si";
import { Code2, Database, Wrench, Palette, FileSpreadsheet, MessageSquare, Crown, Clock, Users, Sparkles as Star, Monitor, Terminal } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const MAP: Record<string, IconType | LucideIcon> = {
  html: SiHtml5,
  css: SiCss,
  javascript: SiJavascript,
  typescript: SiTypescript,
  react: SiReact,
  python: SiPython,
  "c++": SiCplusplus,
  mysql: SiMysql,
  git: SiGit,
  php: SiPhp,
  "node.js": SiNodedotjs,
  tailwind: SiTailwindcss,
  "computer troubleshooting": Wrench,
  "graphic design": Palette,
  "microsoft office": FileSpreadsheet,
  "communication skills": MessageSquare,
  leadership: Crown,
  "time management": Clock,
  "teamwork and collaboration": Users,
};

const CATEGORY_ICON: Record<string, LucideIcon> = {
  "Web Development": Monitor,
  Programming: Terminal,
  "Database Management": Database,
  "Other Technical Skills": Wrench,
  "Professional Skills": Star,
};

export function skillIcon(name: string): IconType | LucideIcon {
  return MAP[name.trim().toLowerCase()] ?? Code2;
}
export function categoryIcon(cat: string): LucideIcon {
  return CATEGORY_ICON[cat] ?? Code2;
}
