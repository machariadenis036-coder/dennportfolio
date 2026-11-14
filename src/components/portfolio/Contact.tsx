import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Github, Loader2, Mail, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionHeading } from "./SectionHeading";
import { contactSchema, whatsappLink } from "@/lib/contact";
import { sendContactMessage } from "@/lib/portfolio.functions";
import type { Profile } from "@/lib/portfolio-types";

type Fields = { name: string; email: string; subject: string; message: string; website: string };
const EMPTY: Fields = { name: "", email: "", subject: "", message: "", website: "" };

export function Contact({ profile }: { profile: Profile }) {
  const send = useServerFn(sendContactMessage);
  const [values, setValues] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const errs: Partial<Record<keyof Fields, string>> = {};
      parsed.error.issues.forEach((i) => {
        const k = i.path[0] as keyof Fields;
        if (!errs[k]) errs[k] = i.message;
      });
      setErrors(errs);
      return;
    }
    setStatus("sending");
    try {
      const res = await send({ data: parsed.data });
      if (res.ok) {
        setStatus("sent");
        setValues(EMPTY);
        toast.success("Message sent! I'll get back to you soon.");
      } else {
        setStatus("idle");
        toast.error(res.error);
      }
    } catch {
      setStatus("idle");
      toast.error("Something went wrong. Please try again or reach me on WhatsApp.");
    }
  }

  const channels = [
    { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: MessageCircle, label: "WhatsApp", value: "Chat with me", href: whatsappLink(profile.whatsapp, "Hi Denis, I saw your portfolio and would like to talk.") },
    { icon: Github, label: "GitHub", value: profile.github_url.replace(/^https?:\/\//, ""), href: profile.github_url },
  ];

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something together"
          subtitle="Employers, clients, collaborators and fellow developers — I'd love to hear from you."
        />
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="reveal space-y-4">
            {channels.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card-gradient p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
                  <span className="block truncate font-medium text-foreground">{value}</span>
                </span>
              </a>
            ))}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm text-muted-foreground">
              Prefer a quick chat? Tap the green chat button at the bottom of the page to message me on WhatsApp.
            </div>
          </div>

          <form onSubmit={onSubmit} noValidate className="reveal rounded-3xl border border-border bg-card-gradient p-6 shadow-card sm:p-8">
            {status === "sent" ? (
              <div className="flex min-h-96 flex-col items-center justify-center gap-4 text-center">
                <CheckCircle2 className="h-14 w-14 text-success" />
                <h3 className="text-2xl font-bold text-foreground">Thank you!</h3>
                <p className="max-w-sm text-muted-foreground">Your message has been delivered. I'll reply to your email as soon as possible.</p>
                <Button variant="glass" className="rounded-full" type="button" onClick={() => setStatus("idle")}>
                  Send another message
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="name" label="Name" error={errors.name}>
                    <Input id="name" value={values.name} onChange={set("name")} maxLength={100} placeholder="Your name" className="h-11 bg-background/50" />
                  </Field>
                  <Field id="email" label="Email" error={errors.email}>
                    <Input id="email" type="email" value={values.email} onChange={set("email")} maxLength={255} placeholder="you@example.com" className="h-11 bg-background/50" />
                  </Field>
                </div>
                <Field id="subject" label="Subject" error={errors.subject}>
                  <Input id="subject" value={values.subject} onChange={set("subject")} maxLength={150} placeholder="What's this about?" className="h-11 bg-background/50" />
                </Field>
                <Field id="message" label="Message" error={errors.message}>
                  <Textarea id="message" value={values.message} onChange={set("message")} maxLength={2000} rows={6} placeholder="Tell me about your idea or opportunity..." className="resize-none bg-background/50" />
                </Field>
                <input type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} className="hidden" aria-hidden />
                <Button type="submit" variant="hero" size="xl" className="w-full" disabled={status === "sending"}>
                  {status === "sending" ? (<><Loader2 className="animate-spin" /> Sending...</>) : (<><Send /> Send Message</>)}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string | undefined; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
