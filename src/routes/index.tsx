import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-excavator.jpg";
import { Hero, About, Solutions, Products, Testimonials, Contact } from "@/components/site";
import { ArrowRight, Bot, Cpu, Layers, Phone, Sparkles, Target } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TERRA-X | AI-Powered Autonomous Excavators & Heavy Machinery" },
      {
        name: "description",
        content:
          "TERRA-X builds AI-powered autonomous excavators and robotic heavy machines for agriculture, construction, rescue, and defense using AI, IoT, LiDAR, and remote operation.",
      },
      {
        name: "keywords",
        content:
          "autonomous excavator, AI heavy machinery, agricultural robotics, RoVX-AI, RAMBO-X, Terra-X",
      },
      { property: "og:title", content: "TERRA-X | AI-Powered Autonomous Heavy Machinery" },
      {
        property: "og:description",
        content: "Reinventing heavy machinery with autonomous intelligence.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: heroImg },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroImg },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const explore = [
  {
    to: "/about" as const,
    icon: Sparkles,
    title: "About Terra-X",
    body: "Who we are and what we build.",
  },
  {
    to: "/products" as const,
    icon: Bot,
    title: "Machines",
    body: "RoVX-AI & RAMBO-X autonomous platforms.",
  },
  {
    to: "/technology" as const,
    icon: Cpu,
    title: "Technology",
    body: "AI, LiDAR, robotics, IoT, remote ops.",
  },
  {
    to: "/market" as const,
    icon: Layers,
    title: "Market & Customers",
    body: "$300B+ opportunity, target segments, model.",
  },
  {
    to: "/strategy" as const,
    icon: Target,
    title: "Strategy & Traction",
    body: "GTM, milestones, competitive landscape.",
  },
  {
    to: "/contact" as const,
    icon: Phone,
    title: "Contact",
    body: "Partnerships, pilots, investors.",
  },
];

function Index() {
  return (
    <>
      <Hero />
      <About />
      <Solutions />
      <Products />
      <section className="relative py-20 sm:py-24 border-y border-border bg-card/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-electric">
              <span className="h-px w-8 bg-electric" /> Explore Terra-X
            </div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Dive deeper into <span className="gradient-text">the platform</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Every section of our story now lives on its own page.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {explore.map((e) => (
              <Link
                key={e.to}
                to={e.to}
                className="group rounded-xl border border-border bg-background/60 p-6 transition hover:border-electric hover:-translate-y-1 duration-300"
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-md bg-electric/10 text-electric ring-1 ring-electric/30">
                  <e.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">{e.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{e.body}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-electric">
                  Explore <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Testimonials />
      <Contact />
    </>
  );
}
