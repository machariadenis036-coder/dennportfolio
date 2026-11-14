import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Inbox, Loader2, LogOut, Mail, MailOpen, Plus, Save, Trash2, User, Wrench, FolderGit2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SKILL_CATEGORIES, type Message, type Profile, type Project, type Skill } from "@/lib/portfolio-types";
import { whatsappLink } from "@/lib/contact";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin dashboard — Denis Portfolio" },
      { name: "description", content: "Edit portfolio content and read messages." },
      { property: "og:title", content: "Admin dashboard — Denis Portfolio" },
      { property: "og:description", content: "Edit portfolio content and read messages." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function useIsAdmin() {
  const { user } = Route.useRouteContext();
  return useQuery({
    queryKey: ["is-admin", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });
}

function AdminPage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isAdmin = useIsAdmin();

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-40 border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:px-8">
          <div className="min-w-0">
            <p className="font-display text-lg font-bold text-foreground">Portfolio admin</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="glass" size="sm" className="rounded-full">
              <Link to="/"><ExternalLink /> View site</Link>
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full" onClick={signOut}>
              <LogOut /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        {isAdmin.isLoading ? (
          <div className="grid place-items-center py-24"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : !isAdmin.data ? (
          <div className="mx-auto max-w-md rounded-3xl border border-border bg-card-gradient p-8 text-center">
            <h1 className="text-xl font-bold text-foreground">No editing access</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This account isn't the portfolio owner. Sign in with machariadenis036@gmail.com (and confirm the email) to manage the site.
            </p>
          </div>
        ) : (
          <Tabs defaultValue="messages">
            <TabsList className="mb-8 flex h-auto flex-wrap gap-1 bg-muted p-1">
              <TabsTrigger value="messages" className="gap-2"><Inbox className="h-4 w-4" /> Messages</TabsTrigger>
              <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" /> Profile</TabsTrigger>
              <TabsTrigger value="skills" className="gap-2"><Wrench className="h-4 w-4" /> Skills</TabsTrigger>
              <TabsTrigger value="projects" className="gap-2"><FolderGit2 className="h-4 w-4" /> Projects</TabsTrigger>
            </TabsList>
            <TabsContent value="messages"><MessagesPanel /></TabsContent>
            <TabsContent value="profile"><ProfilePanel /></TabsContent>
            <TabsContent value="skills"><SkillsPanel /></TabsContent>
            <TabsContent value="projects"><ProjectsPanel /></TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}

const card = "rounded-3xl border border-border bg-card-gradient p-6";

/* ---------------- Messages ---------------- */
function MessagesPanel() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Message[];
    },
  });
  const [selected, setSelected] = useState<string | null>(null);
  const current = data.find((m) => m.id === selected) ?? null;

  const markRead = useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      const { error } = await supabase.from("messages").update({ is_read }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-messages"] }),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      setSelected(null);
      toast.success("Message deleted");
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
    },
  });

  function open(m: Message) {
    setSelected(m.id);
    if (!m.is_read) markRead.mutate({ id: m.id, is_read: true });
  }

  if (isLoading) return <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />;
  if (data.length === 0)
    return (
      <div className={`${card} text-center`}>
        <Inbox className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
        <p className="text-foreground">No messages yet</p>
        <p className="text-sm text-muted-foreground">Messages from your contact form appear here and in your Gmail.</p>
      </div>
    );

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <ul className="space-y-2">
        {data.map((m) => (
          <li key={m.id}>
            <button
              onClick={() => open(m)}
              className={`w-full rounded-2xl border p-4 text-left transition-colors ${selected === m.id ? "border-primary/50 bg-primary/10" : "border-border bg-card hover:border-primary/30"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2">
                  {!m.is_read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  <span className={`truncate text-sm ${m.is_read ? "text-muted-foreground" : "font-semibold text-foreground"}`}>{m.name}</span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</span>
              </div>
              <p className="mt-1 truncate text-sm text-foreground">{m.subject}</p>
            </button>
          </li>
        ))}
      </ul>
      <div className={card}>
        {current ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">{current.subject}</h3>
              <p className="text-sm text-muted-foreground">
                {current.name} · <a href={`mailto:${current.email}`} className="text-primary hover:underline">{current.email}</a> · {new Date(current.created_at).toLocaleString()}
              </p>
            </div>
            <p className="whitespace-pre-wrap leading-relaxed text-foreground">{current.message}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button asChild variant="hero" size="sm" className="rounded-full">
                <a href={`mailto:${current.email}?subject=${encodeURIComponent("Re: " + current.subject)}`}><Mail /> Reply by email</a>
              </Button>
              <Button variant="glass" size="sm" className="rounded-full" onClick={() => markRead.mutate({ id: current.id, is_read: !current.is_read })}>
                <MailOpen /> Mark as {current.is_read ? "unread" : "read"}
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full text-destructive" onClick={() => remove.mutate(current.id)}>
                <Trash2 /> Delete
              </Button>
            </div>
          </div>
        ) : (
          <p className="py-16 text-center text-sm text-muted-foreground">Select a message to read it.</p>
        )}
      </div>
    </div>
  );
}

/* ---------------- Profile ---------------- */
function ProfilePanel() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_profile").select("*").eq("id", 1).single();
      if (error) throw error;
      return data as Profile;
    },
  });
  const [form, setForm] = useState<Profile | null>(null);
  const [highlights, setHighlights] = useState("");
  useEffect(() => {
    if (data) {
      setForm(data);
      setHighlights(data.highlights.join("\n"));
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      if (!form) return;
      const { id: _id, updated_at: _u, ...rest } = form;
      const { error } = await supabase
        .from("site_profile")
        .update({ ...rest, photo_url: rest.photo_url?.trim() || null, highlights: highlights.split("\n").map((h) => h.trim()).filter(Boolean) })
        .eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile saved");
      qc.invalidateQueries({ queryKey: ["admin-profile"] });
      qc.invalidateQueries({ queryKey: ["portfolio"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  if (!form) return <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />;
  const f = (k: keyof Profile) => ({
    value: (form[k] as string | null) ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value }),
  });

  return (
    <form className={`${card} space-y-6`} onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Row label="Display name"><Input {...f("name")} maxLength={60} /></Row>
        <Row label="Brand (logo & footer)"><Input {...f("brand")} maxLength={60} /></Row>
        <Row label="Professional title (separate with |)" full><Input {...f("title")} maxLength={150} /></Row>
        <Row label="Hero introduction" full><Textarea {...f("hero_intro")} rows={4} maxLength={600} /></Row>
        <Row label="About me (blank line between paragraphs)" full><Textarea {...f("about")} rows={7} maxLength={3000} /></Row>
        <Row label="Highlights (one per line)" full>
          <Textarea value={highlights} onChange={(e) => setHighlights(e.target.value)} rows={5} />
        </Row>
        <Row label="Email"><Input {...f("email")} type="email" maxLength={255} /></Row>
        <Row label="WhatsApp number"><Input {...f("whatsapp")} maxLength={20} /></Row>
        <Row label="GitHub URL"><Input {...f("github_url")} maxLength={200} /></Row>
        <Row label="Location"><Input {...f("location")} maxLength={80} /></Row>
        <Row label="Institution"><Input {...f("institution")} maxLength={120} /></Row>
        <Row label="Course"><Input {...f("course")} maxLength={150} /></Row>
        <Row label="Academic level"><Input {...f("academic_level")} maxLength={60} /></Row>
        <Row label="Footer tagline"><Input {...f("footer_tagline")} maxLength={160} /></Row>
        <Row label="Photo link (leave empty to use your current photo)" full><Input {...f("photo_url")} placeholder="https://..." maxLength={500} /></Row>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="hero" className="rounded-full" disabled={save.isPending}>
          {save.isPending ? <Loader2 className="animate-spin" /> : <Save />} Save profile
        </Button>
        <a href={whatsappLink(form.whatsapp)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
          <MessageCircle className="h-4 w-4" /> Test WhatsApp link
        </a>
      </div>
    </form>
  );
}

function Row({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={`space-y-2 ${full ? "sm:col-span-2" : ""}`}>
      <Label className="text-foreground">{label}</Label>
      {children}
    </div>
  );
}

/* ---------------- Skills ---------------- */
function SkillsPanel() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["admin-skills"],
    queryFn: async () => {
      const { data, error } = await supabase.from("skills").select("*").order("sort_order");
      if (error) throw error;
      return data as Skill[];
    },
  });
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>(SKILL_CATEGORIES[0]);
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-skills"] });
    qc.invalidateQueries({ queryKey: ["portfolio"] });
  };
  const add = useMutation({
    mutationFn: async () => {
      const n = name.trim();
      if (!n) throw new Error("Enter a skill name");
      const order = data.filter((s) => s.category === category).length + 1;
      const { error } = await supabase.from("skills").insert({ name: n.slice(0, 60), category, sort_order: order });
      if (error) throw error;
    },
    onSuccess: () => { setName(""); toast.success("Skill added"); refresh(); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: refresh,
  });

  return (
    <div className="space-y-5">
      <form className={`${card} grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end`} onSubmit={(e) => { e.preventDefault(); add.mutate(); }}>
        <Row label="New skill"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. React" maxLength={60} /></Row>
        <Row label="Group">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground">
            {SKILL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Row>
        <Button type="submit" variant="hero" className="rounded-full" disabled={add.isPending}><Plus /> Add</Button>
      </form>
      {SKILL_CATEGORIES.map((c) => (
        <div key={c} className={card}>
          <h3 className="mb-3 font-semibold text-foreground">{c}</h3>
          <div className="flex flex-wrap gap-2">
            {data.filter((s) => s.category === c).map((s) => (
              <span key={s.id} className="flex items-center gap-1.5 rounded-full border border-border bg-background/50 py-1 pl-3 pr-1 text-sm text-foreground">
                {s.name}
                <button aria-label={`Remove ${s.name}`} onClick={() => del.mutate(s.id)} className="rounded-full p-1 text-muted-foreground hover:bg-destructive/20 hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
            {data.filter((s) => s.category === c).length === 0 && <span className="text-sm text-muted-foreground">No skills yet</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Projects ---------------- */
type ProjectDraft = { title: string; description: string; tech: string; repo_url: string; demo_url: string; image_url: string; featured: boolean };
const emptyDraft: ProjectDraft = { title: "", description: "", tech: "", repo_url: "", demo_url: "", image_url: "", featured: false };

function ProjectsPanel() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("sort_order");
      if (error) throw error;
      return data as Project[];
    },
  });
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<ProjectDraft>(emptyDraft);
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-projects"] });
    qc.invalidateQueries({ queryKey: ["portfolio"] });
  };

  function startEdit(p?: Project) {
    if (p) {
      setEditing(p.id);
      setDraft({ title: p.title, description: p.description, tech: p.tech.join(", "), repo_url: p.repo_url ?? "", demo_url: p.demo_url ?? "", image_url: p.image_url ?? "", featured: p.featured });
    } else {
      setEditing("new");
      setDraft(emptyDraft);
    }
  }

  const save = useMutation({
    mutationFn: async () => {
      if (!draft.title.trim()) throw new Error("Project title is required");
      const row = {
        title: draft.title.trim().slice(0, 120),
        description: draft.description.trim().slice(0, 2000),
        tech: draft.tech.split(",").map((t) => t.trim()).filter(Boolean),
        repo_url: draft.repo_url.trim() || null,
        demo_url: draft.demo_url.trim() || null,
        image_url: draft.image_url.trim() || null,
        featured: draft.featured,
      };
      const { error } = editing === "new"
        ? await supabase.from("projects").insert({ ...row, sort_order: data.length + 1 })
        : await supabase.from("projects").update(row).eq("id", editing!);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Project saved"); setEditing(null); refresh(); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Project removed"); refresh(); },
  });

  return (
    <div className="space-y-5">
      <Button variant="hero" className="rounded-full" onClick={() => startEdit()}><Plus /> Add project</Button>

      {editing && (
        <form className={`${card} grid gap-5 sm:grid-cols-2`} onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
          <Row label="Title" full><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} maxLength={120} /></Row>
          <Row label="Description" full><Textarea rows={4} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} maxLength={2000} /></Row>
          <Row label="Technologies (comma separated)" full><Input value={draft.tech} onChange={(e) => setDraft({ ...draft, tech: e.target.value })} placeholder="HTML, CSS, JavaScript" /></Row>
          <Row label="GitHub link"><Input value={draft.repo_url} onChange={(e) => setDraft({ ...draft, repo_url: e.target.value })} placeholder="https://github.com/..." /></Row>
          <Row label="Live demo link (optional)"><Input value={draft.demo_url} onChange={(e) => setDraft({ ...draft, demo_url: e.target.value })} placeholder="https://..." /></Row>
          <Row label="Screenshot link (optional)" full><Input value={draft.image_url} onChange={(e) => setDraft({ ...draft, image_url: e.target.value })} placeholder="https://..." /></Row>
          <label className="flex items-center gap-3 text-sm text-foreground sm:col-span-2">
            <Switch checked={draft.featured} onCheckedChange={(v) => setDraft({ ...draft, featured: v })} /> Featured project
          </label>
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit" variant="hero" className="rounded-full" disabled={save.isPending}>
              {save.isPending ? <Loader2 className="animate-spin" /> : <Save />} Save project
            </Button>
            <Button type="button" variant="ghost" className="rounded-full" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </form>
      )}

      {data.map((p) => (
        <div key={p.id} className={`${card} grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4`}>
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">{p.title} {p.featured && <span className="ml-2 rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">Featured</span>}</p>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
            <p className="mt-2 font-mono text-xs text-muted-foreground">{p.tech.join(" · ")}</p>
          </div>
          <div className="flex gap-1">
            <Button variant="glass" size="sm" className="rounded-full" onClick={() => startEdit(p)}>Edit</Button>
            <Button variant="ghost" size="icon" aria-label="Delete project" className="rounded-full text-destructive" onClick={() => { if (confirm(`Delete "${p.title}"?`)) del.mutate(p.id); }}><Trash2 /></Button>
          </div>
        </div>
      ))}
    </div>
  );
}
