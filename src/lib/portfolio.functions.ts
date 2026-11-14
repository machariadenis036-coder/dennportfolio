import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { contactSchema } from "./contact";
import { publicSupabase } from "./portfolio.server";
import { sendGmail } from "./gmail.server";

export const getPortfolio = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicSupabase();
  const [profile, skills, projects] = await Promise.all([
    sb.from("site_profile").select("*").eq("id", 1).maybeSingle(),
    sb.from("skills").select("*").order("sort_order"),
    sb.from("projects").select("*").order("featured", { ascending: false }).order("sort_order"),
  ]);
  if (profile.error) console.error("profile load failed", profile.error);
  if (skills.error) console.error("skills load failed", skills.error);
  if (projects.error) console.error("projects load failed", projects.error);
  return {
    profile: profile.data ?? null,
    skills: skills.data ?? [],
    projects: projects.data ?? [],
  };
});

export const portfolioQuery = queryOptions({
  queryKey: ["portfolio"],
  queryFn: () => getPortfolio(),
});

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const sb = publicSupabase();
    const { error } = await sb.from("messages").insert({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });
    if (error) {
      console.error("message insert failed", error);
      return { ok: false as const, error: "We couldn't send your message. Please try again." };
    }

    // Email notification to the owner (message is already saved in the inbox).
    try {
      const { data: profile } = await sb.from("site_profile").select("email").eq("id", 1).maybeSingle();
      const to = profile?.email || "machariadenis036@gmail.com";
      await sendGmail({
        to,
        replyTo: data.email,
        subject: `New portfolio message: ${data.subject}`,
        body: `You received a new message from your portfolio website.\n\nName: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\n\n${data.message}\n\n— Reply to this email to respond directly to ${data.name}.`,
      });
    } catch (e) {
      console.error("email notification failed", e);
    }
    return { ok: true as const };
  });
