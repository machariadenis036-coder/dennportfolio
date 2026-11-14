import { useState } from "react";
import { Mail, MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { whatsappLink } from "@/lib/contact";
import type { Profile } from "@/lib/portfolio-types";
import portrait from "@/assets/denis-portrait.jpg.asset.json";

export function ChatWidget({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const message = text.trim() || "Hi Denis, I saw your portfolio and would like to talk.";

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[min(92vw,340px)] overflow-hidden rounded-3xl border border-border bg-popover shadow-card animate-fade-up">
          <div className="flex items-center gap-3 bg-hero p-4">
            <img src={profile.photo_url || portrait.url} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover object-top" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-semibold text-foreground">Chat with {profile.name}</p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-success" /> Usually replies within a day
              </p>
            </div>
            <button aria-label="Close chat" onClick={() => setOpen(false)} className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3 p-4">
            <div className="w-fit max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5 text-sm text-foreground">
              Hi there 👋 Leave me a message and choose how you'd like to send it.
            </div>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 1000))}
              rows={3}
              placeholder="Type your message..."
              className="resize-none bg-background/60"
            />
            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="whatsapp" className="rounded-xl">
                <a href={whatsappLink(profile.whatsapp, message)} target="_blank" rel="noopener noreferrer">
                  <Send /> WhatsApp
                </a>
              </Button>
              <Button asChild variant="glass" className="rounded-xl">
                <a href={`mailto:${profile.email}?subject=${encodeURIComponent("Hello from your portfolio")}&body=${encodeURIComponent(message)}`}>
                  <Mail /> Email
                </a>
              </Button>
            </div>
            <a href="#contact" onClick={() => setOpen(false)} className="block text-center text-xs text-muted-foreground hover:text-primary">
              Or use the contact form
            </a>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-card transition-transform hover:scale-105 animate-pulse-ring"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
