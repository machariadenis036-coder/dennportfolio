import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { portfolioQuery } from "@/lib/portfolio.functions";
import { useReveal } from "@/hooks/use-reveal";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Skills } from "@/components/portfolio/Skills";
import { Projects } from "@/components/portfolio/Projects";
import { Education } from "@/components/portfolio/Education";
import { Resume } from "@/components/portfolio/Resume";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import { ChatWidget } from "@/components/portfolio/ChatWidget";

const TITLE = "Denis — Web Developer & IT Student | Portfolio";
const DESC =
  "Portfolio of Denis, an IT student at Kirinyaga University and aspiring software developer building modern, practical web solutions.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(portfolioQuery),
  component: Index,
});

function Index() {
  const { data } = useSuspenseQuery(portfolioQuery);
  useReveal([data]);
  const profile = data.profile;

  if (!profile) {
    return (
      <div className="grid min-h-screen place-items-center bg-background p-6 text-center text-muted-foreground">
        Portfolio content is unavailable right now. Please refresh in a moment.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar brand={profile.brand} />
      <main>
        <Hero profile={profile} projectCount={data.projects.length} />
        <About profile={profile} />
        <Skills skills={data.skills} />
        <Projects projects={data.projects} />
        <Education profile={profile} />
        <Resume />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
      <ChatWidget profile={profile} />
    </div>
  );
}
