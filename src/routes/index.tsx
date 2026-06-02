import { createFileRoute } from "@tanstack/react-router";
import heroImg from "@/assets/hero-excavator.jpg";
import slideExcavator from "@/assets/slide-excavator.jpg";
import slideAgri from "@/assets/slide-agri.jpg";
import slideAmphibious from "@/assets/slide-amphibious.jpg";
import slideTech from "@/assets/slide-tech.jpg";
import rovxImg from "@/assets/product-rovx.jpg";
import ramboImg from "@/assets/product-rambo.jpg";
import terraLogo from "@/assets/terra-x-logo.png.asset.json";
import rovxLogo from "@/assets/rovx-ai-logo.png.asset.json";
import ramboLogo from "@/assets/rambo-x-logo.png.asset.json";
import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import {
  Brain, Radar, Cpu, Bot, Smartphone, RefreshCw,
  Tractor, Waves, Layers, ShieldCheck, Sparkles,
  AlertTriangle, Users, DollarSign, Wrench, Sprout,
  Building2, Landmark, Network, ArrowRight, Check, X,
  Phone, Mail, Linkedin, ChevronRight, Zap, MapPin,
  Eye, Radio, Wifi, Activity, Target, Rocket,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TERRA-X | AI-Powered Autonomous Excavators & Heavy Machinery" },
      {
        name: "description",
        content:
          "TERRA-X builds AI-powered autonomous excavators and robotic heavy machines for agriculture, construction, rescue, and defense using AI, IoT, LiDAR, and remote operation systems.",
      },
      {
        name: "keywords",
        content:
          "autonomous excavator, AI heavy machinery, agricultural robotics, precision farming machine, amphibious excavator, construction automation, LiDAR excavator, robotic machinery, Terra-X, RoVX-AI, RAMBO-X",
      },
      { property: "og:title", content: "TERRA-X | AI-Powered Autonomous Heavy Machinery" },
      {
        property: "og:description",
        content:
          "Reinventing heavy machinery with autonomous intelligence. AI-powered excavators for agriculture, construction, rescue & defense.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: heroImg },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroImg },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "TERRA-X (OPC) PRIVATE LIMITED",
          description:
            "Deep-tech startup building AI-powered autonomous heavy machines for construction, agriculture, rescue, and defense.",
          url: "/",
          email: "soorajanil71@gmail.com",
          telephone: "+91 87147 51947",
          sameAs: ["https://www.linkedin.com/in/sooraj-anil-43a9872b8"],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <About />
        <Problems />
        <Solutions />
        <Products />
        <HowItWorks />
        <TechStack />
        <Moat />
        <Market />
        <Customers />
        <Business />
        <Strategy />
        <Traction />
        <Competitive />
        <Founder />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

/* ------------------------------ NAV ------------------------------ */
const navLinks = [
  { href: "#about", label: "About" },
  { href: "#products", label: "Machines" },
  { href: "#technology", label: "Technology" },
  { href: "#market", label: "Market" },
  { href: "#contact", label: "Contact" },
];

function Nav() {
  return (
    <header className="fixed top-0 z-50 w-full">
      <TopBar />
      <div className="w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2 font-bold tracking-tight" aria-label="TERRA-X home">
          <img
            src={terraLogo.url}
            alt="TERRA-X (OPC) Pvt Ltd logo"
            className="h-10 w-auto sm:h-11"
          />
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted-foreground transition hover:text-electric">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Get in touch <ArrowRight className="h-4 w-4" />
        </a>
      </div>
      </div>
    </header>
  );
}

/* ------------------------------ TOP BAR (PAATI) ------------------------------ */
function TopBar() {
  const items = [
    { icon: Sparkles, text: "Deep-Tech Robotics · Made in India" },
    { icon: Phone, text: "+91 87147 51947" },
    { icon: Mail, text: "soorajanil71@gmail.com" },
    { icon: ShieldCheck, text: "Patent-Linked IP · 2 Platforms" },
    { icon: Rocket, text: "RoVX-AI · RAMBO-X Now in Pilot" },
    { icon: MapPin, text: "TERRA-X (OPC) Pvt. Ltd. · India" },
  ];
  const loop = [...items, ...items];
  return (
    <div className="relative h-8 w-full overflow-hidden bg-gradient-rainbow text-white shadow-[var(--shadow-soft)]">
      <div className="pointer-events-none absolute inset-0 bg-foreground/10" />
      <div className="relative flex h-full items-center">
        <div className="flex shrink-0 animate-marquee gap-10 whitespace-nowrap px-6 text-xs font-medium tracking-wide">
          {loop.map((it, i) => (
            <span key={i} className="inline-flex items-center gap-2">
              <it.icon className="h-3.5 w-3.5" />
              {it.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}


/* ------------------------------ HERO ------------------------------ */
function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-24">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute -left-32 top-32 h-96 w-96 rounded-full bg-[oklch(0.72_0.19_245)] opacity-20 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[oklch(0.55_0.18_230)] opacity-20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-32 lg:px-8">
        <div className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-electric/30 bg-electric/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-electric">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-electric" />
            </span>
            Deep-Tech Robotics · Made in India
          </div>
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Reinventing Heavy Machinery with{" "}
            <span className="gradient-text">Autonomous Intelligence</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            AI-powered autonomous excavators designed for agriculture, construction, rescue, and defense applications.
          </p>
          <p className="mt-4 max-w-xl text-base text-muted-foreground/80">
            TERRA-X is building next-generation heavy machinery that reduces human dependency, improves safety, and enables precision operations across land, farms, and challenging environments.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#products"
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 glow-electric"
            >
              Explore Our Machines
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
            <a
              href="#technology"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card/50 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-electric hover:text-electric"
            >
              View Technology
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-md border border-accent/40 bg-accent/5 px-6 py-3 text-sm font-semibold text-accent transition hover:bg-accent/10"
            >
              Contact Us
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
            <Stat label="Machine Platforms" value="2" />
            <Stat label="Novel Features" value="15+" />
            <Stat label="Patent-Linked IP" value="2" />
          </div>
        </div>

        <HeroSlider />
      </div>
    </section>
  );
}

/* ------------------------------ HERO SLIDER ------------------------------ */
const slides = [
  {
    img: slideExcavator,
    tag: "Autonomous Construction",
    title: "AI-Driven Excavation",
    caption: "LiDAR-guided digging, mapping & navigation at sub-centimeter precision.",
  },
  {
    img: slideAgri,
    tag: "Precision Agriculture",
    title: "RoVX-AI Orchard Rover",
    caption: "Tree-level health detection and robotic fertilizer dosing.",
  },
  {
    img: slideAmphibious,
    tag: "Defense & Rescue",
    title: "RAMBO-X Amphibious",
    caption: "Land + water operations for flood rescue and tactical deployment.",
  },
  {
    img: slideTech,
    tag: "Smart Sensor Stack",
    title: "LiDAR · AI · IoT",
    caption: "Multi-modal perception built for the harshest environments.",
  },
];

function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 4500, stopOnInteraction: false })],
  );
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="relative">
      <div
        ref={emblaRef}
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elevated)]"
      >
        <div className="flex">
          {slides.map((s, i) => (
            <div key={s.title} className="relative min-w-0 flex-[0_0_100%]">
              <img
                src={s.img}
                alt={s.title}
                width={1600}
                height={1024}
                loading={i === 0 ? "eager" : "lazy"}
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
              {/* HUD corners */}
              {["top-3 left-3 border-l-2 border-t-2", "top-3 right-3 border-r-2 border-t-2",
                "bottom-3 left-3 border-l-2 border-b-2", "bottom-3 right-3 border-r-2 border-b-2"].map((p) => (
                <div key={p} className={`absolute h-5 w-5 border-electric ${p}`} />
              ))}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-background">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-mono uppercase tracking-widest backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {s.tag}
                </span>
                <h3 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">{s.title}</h3>
                <p className="mt-1.5 max-w-md text-sm text-background/80">{s.caption}</p>
              </div>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric to-transparent animate-scan" />
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {/* Prev / Next controls */}
      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/80 text-foreground shadow-[var(--shadow-soft)] backdrop-blur transition hover:bg-primary hover:text-primary-foreground hover:border-primary"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/80 text-foreground shadow-[var(--shadow-soft)] backdrop-blur transition hover:bg-primary hover:text-primary-foreground hover:border-primary"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Pagination dots */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.title}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={selected === i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-2 rounded-full transition-all ${selected === i ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/50"}`}
          />
        ))}
      </div>

      {/* Floating telemetry card */}
      <div className="absolute -bottom-8 -left-4 hidden rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:block">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs uppercase text-muted-foreground">AI Decision Engine</div>
            <div className="font-mono text-sm text-foreground">12.4ms · 99.7% acc</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-3xl font-bold text-electric">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

/* ---------------------------- SECTION SHELL ---------------------------- */
function SectionHeader({
  eyebrow, title, subtitle, center = false,
}: { eyebrow?: string; title: React.ReactNode; subtitle?: string; center?: boolean }) {
  return (
    <div className={`mx-auto max-w-3xl ${center ? "text-center" : ""}`}>
      {eyebrow && (
        <div className="mb-3 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-electric">
          <span className="h-px w-8 bg-electric" /> {eyebrow}
        </div>
      )}
      <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function Section({
  id, children, className = "",
}: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative py-20 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

/* ------------------------------ ABOUT ------------------------------ */
function About() {
  const activities = [
    { icon: Bot, title: "Autonomous Excavator Development" },
    { icon: Radar, title: "AI + LiDAR Integration" },
    { icon: Sprout, title: "Precision Agriculture Machines" },
    { icon: Layers, title: "Multi-Domain Robotics Systems" },
    { icon: Smartphone, title: "App-Based Remote Operation" },
  ];
  return (
    <Section id="about">
      <SectionHeader
        eyebrow="Who We Are"
        title={<>Building intelligent machines for the <span className="gradient-text">future of work</span></>}
        subtitle="TERRA-X is a deep-tech manufacturing startup developing AI-powered autonomous heavy machines for construction, agriculture, rescue, and defense — transforming traditional excavators into smart robotic platforms using AI, IoT, LiDAR, cameras, robotics, and remote-control systems."
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {activities.map((a) => (
          <div
            key={a.title}
            className="group rounded-xl border border-border bg-card/40 p-5 transition hover:border-electric hover:bg-card"
          >
            <div className="mb-4 grid h-10 w-10 place-items-center rounded-md bg-electric/10 text-electric transition group-hover:bg-electric group-hover:text-primary-foreground">
              <a.icon className="h-5 w-5" />
            </div>
            <div className="text-sm font-semibold leading-snug">{a.title}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <VMCard
          tag="Vision"
          icon={Eye}
          text="To revolutionize heavy machinery into fully autonomous, multi-domain intelligent systems."
          accent="electric"
        />
        <VMCard
          tag="Mission"
          icon={Target}
          text="To reduce human dependency, improve safety, and enable AI-driven efficiency across industries."
          accent="safety"
        />
      </div>
    </Section>
  );
}

function VMCard({
  tag, icon: Icon, text, accent,
}: { tag: string; icon: React.ElementType; text: string; accent: "electric" | "safety" }) {
  const isE = accent === "electric";
  return (
    <div className={`relative overflow-hidden rounded-2xl border ${isE ? "border-electric/30" : "border-accent/30"} bg-card/40 p-8`}>
      <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full ${isE ? "bg-electric/15" : "bg-accent/15"} blur-2xl`} />
      <div className="relative">
        <div className={`mb-4 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] ${isE ? "text-electric" : "text-accent"}`}>
          <Icon className="h-4 w-4" /> {tag}
        </div>
        <p className="text-xl font-medium leading-snug text-foreground">{text}</p>
      </div>
    </div>
  );
}

/* ---------------------------- PROBLEMS ---------------------------- */
function Problems() {
  const items = [
    { icon: DollarSign, title: "High Equipment Cost", body: "Multiple machines are required for agriculture, construction, land preparation, rescue, and industrial work — increasing capital cost and operational complexity." },
    { icon: Users, title: "Operator Dependency", body: "Skilled machine operators are expensive, limited, and inconsistent, making execution difficult in remote and high-risk locations." },
    { icon: AlertTriangle, title: "Safety Risks", body: "Mining, flood zones, construction sites, and disaster areas expose human operators to serious hazards every single day." },
    { icon: Sprout, title: "Inefficient Farming", body: "Farmers lack precision tools for tree-level crop monitoring, fertilizer application, and plant health assessment." },
  ];
  return (
    <Section className="border-y border-border bg-card/20">
      <SectionHeader eyebrow="Problems We Solve" title={<>The Challenge with <span className="text-accent">Traditional Heavy Machinery</span></>} />
      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {items.map((p, i) => (
          <div key={p.title} className="group relative rounded-xl border border-border bg-background/60 p-6 transition hover:border-accent/50">
            <div className="mb-4 flex items-center justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-md bg-accent/10 text-accent">
                <p.icon className="h-5 w-5" />
              </div>
              <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
            </div>
            <h3 className="text-lg font-bold">{p.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------- SOLUTIONS ---------------------------- */
function Solutions() {
  const items = [
    { icon: Brain, title: "AI-Powered Autonomous Machines", body: "Excavation and agriculture capabilities integrated into one intelligent machine platform." },
    { icon: Radar, title: "Smart Sensor Integration", body: "LiDAR, AI cameras, and sensor systems enable 3D mapping, object detection, and environment awareness." },
    { icon: Sprout, title: "Precision Farming Capability", body: "Tree-level fertilizer application, crop monitoring, and plant health assessment for orchard farming." },
    { icon: Smartphone, title: "App-Based & Voice Control", body: "Remote operation, smart commands, feedback loops, and operator-assist features for safer execution." },
  ];
  return (
    <Section id="solutions">
      <SectionHeader
        eyebrow="Our Solution"
        title={<>Autonomous Machines Built for <span className="gradient-text">Multi-Domain Operations</span></>}
        subtitle="One intelligent platform combining excavation, sensing, mobility, and automation."
      />
      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {items.map((s) => (
          <div key={s.title} className="group flex gap-5 rounded-2xl border border-border bg-card/40 p-6 transition hover:border-electric hover:-translate-y-1 duration-300">
            <div className="shrink-0">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br from-electric/20 to-electric/5 text-electric ring-1 ring-electric/30">
                <s.icon className="h-6 w-6" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------- PRODUCTS ---------------------------- */
function Products() {
  return (
    <Section id="products" className="border-y border-border bg-card/20">
      <SectionHeader
        eyebrow="Products / Machines"
        title={<>Our <span className="gradient-text">Autonomous Machine</span> Platforms</>}
      />
      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <ProductCard
          name="RoVX-AI"
          logo={rovxLogo.url}
          subtitle="Engineered for Precision Farming"
          tag="Autonomous Agricultural Vehicle"
          image={rovxImg}
          description="RoVX-AI is an autonomous agricultural vehicle designed for plant health assessment, fertilizer application, orchard monitoring, and robotic farm operations."
          features={[
            "Multi-mode platform: Tractor · Excavator · Orchard Monitoring",
            "AI-based plant health detection",
            "Robotic fertilizer dispensing",
            "Tree-level crop and fertilizer management",
            "Rugged all-terrain mobility",
            "Remote and app-based control",
          ]}
          note='Design representation filed for "Autonomous Agricultural Vehicle for Plant Health Assessment and Fertilizer Application".'
          accent="gold"
        />
        <ProductCard
          name="RAMBO-X"
          logo={ramboLogo.url}
          subtitle="Built for Land, Water, Rescue & Defense"
          tag="Autonomous Amphibious Excavator"
          image={ramboImg}
          description="RAMBO-X is an autonomous excavator platform designed for land and amphibious operations, enabling deployment across construction, rescue, disaster response, and defense environments."
          features={[
            "Land + water operational capability",
            "Autonomous excavation and navigation",
            "Rescue and defense applications",
            "Drone, sonar, and radar integration readiness",
            "Medical evacuation capability",
            "Remote control and AI-assisted operation",
          ]}
          note='Design representation filed for "Autonomous Excavator for Land and Amphibious Operations".'
          accent="rambo"
        />
      </div>
    </Section>
  );
}

function ProductCard({
  name, logo, subtitle, tag, image, description, features, note, accent,
}: {
  name: string; logo: string; subtitle: string; tag: string; image: string;
  description: string; features: string[]; note: string; accent: "gold" | "rambo";
}) {
  const isGold = accent === "gold";
  const theme = isGold
    ? {
        border: "border-[oklch(0.72_0.15_80)]/40",
        ring: "ring-[oklch(0.72_0.15_80)]/30",
        bg: "bg-[oklch(0.98_0.04_85)]",
        chip: "bg-[oklch(0.95_0.06_85)] text-[oklch(0.40_0.10_70)] border-[oklch(0.72_0.15_80)]/50",
        text: "text-[oklch(0.45_0.12_70)]",
        check: "text-[oklch(0.55_0.13_70)]",
        gradient: "from-[oklch(0.95_0.08_85)] via-background to-[oklch(0.97_0.05_80)]",
      }
    : {
        border: "border-[oklch(0.55_0.22_27)]/40",
        ring: "ring-[oklch(0.55_0.22_27)]/30",
        bg: "bg-[oklch(0.98_0.03_27)]",
        chip: "bg-[oklch(0.95_0.06_27)] text-[oklch(0.45_0.20_27)] border-[oklch(0.55_0.22_27)]/50",
        text: "text-[oklch(0.50_0.22_27)]",
        check: "text-[oklch(0.55_0.22_27)]",
        gradient: "from-[oklch(0.96_0.06_27)] via-background to-[oklch(0.98_0.04_27)]",
      };
  return (
    <article className={`group relative overflow-hidden rounded-2xl border ${theme.border} bg-gradient-to-br ${theme.gradient} transition hover:shadow-[var(--shadow-elevated)]`}>
      <div className={`flex items-center justify-center border-b ${theme.border} ${theme.bg} px-6 py-6`}>
        <img
          src={logo}
          alt={`${name} logo`}
          className="h-16 w-auto sm:h-20 object-contain drop-shadow-md"
        />
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt={`${name} – ${tag}`}
          width={1280}
          height={960}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className={`rounded-md ${theme.chip} border px-2 py-1 text-[10px] font-mono uppercase tracking-widest backdrop-blur`}>
            {tag}
          </span>
        </div>
      </div>
      <div className="p-6 sm:p-8">
        <div className="flex items-baseline gap-3">
          <h3 className="text-3xl font-black tracking-tight">{name}</h3>
          <span className={`text-xs font-mono uppercase ${theme.text}`}>{subtitle}</span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{description}</p>
        <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm">
              <Check className={`mt-0.5 h-4 w-4 shrink-0 ${theme.check}`} />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 rounded-md border border-border bg-card/60 p-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">IP Note: </span>{note}
        </div>
      </div>
    </article>
  );
}

/* ---------------------------- HOW IT WORKS ---------------------------- */
function HowItWorks() {
  const steps = [
    { icon: Smartphone, title: "User / AI Input", body: "User or AI assigns a task" },
    { icon: Radar, title: "Sensor Mapping", body: "LiDAR, cameras, and sensors map the environment" },
    { icon: Cpu, title: "AI Processing", body: "AI processes terrain, object, crop, or excavation data" },
    { icon: Wrench, title: "Task Execution", body: "Machine performs autonomously or with operator assist" },
    { icon: RefreshCw, title: "Feedback Loop", body: "System collects feedback for smarter future decisions" },
  ];
  const features = ["Autonomous navigation", "Precision excavation", "Smart decision-making", "Remote monitoring", "Predictive alerts"];
  return (
    <Section id="how">
      <SectionHeader
        eyebrow="How It Works"
        title={<>How <span className="gradient-text">Terra-X Machines</span> Operate</>}
      />
      <div className="mt-14 grid gap-3 lg:grid-cols-5">
        {steps.map((s, i) => (
          <div key={s.title} className="relative">
            <div className="h-full rounded-xl border border-border bg-card/40 p-5 transition hover:border-electric">
              <div className="mb-3 flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-electric/10 text-electric ring-1 ring-electric/30">
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-xs text-muted-foreground">STEP 0{i + 1}</span>
              </div>
              <h3 className="text-sm font-bold">{s.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{s.body}</p>
            </div>
            {i < steps.length - 1 && (
              <ChevronRight className="absolute -right-2 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-electric lg:block" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        {features.map((f) => (
          <span key={f} className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-2 text-xs">
            <Zap className="h-3.5 w-3.5 text-electric" /> {f}
          </span>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------- TECH STACK ---------------------------- */
function TechStack() {
  const items = [
    { icon: Brain, title: "Artificial Intelligence", body: "Real-time decision-making, crop health analysis, object detection, and adaptive task planning." },
    { icon: Radar, title: "LiDAR & 3D Mapping", body: "Terrain scanning, mapping, obstacle detection, and spatial awareness." },
    { icon: Wifi, title: "IoT & Sensor Fusion", body: "Integrated sensor network for machine health, environmental data, and operational feedback." },
    { icon: Bot, title: "Robotics & Automation", body: "Robotic arms, modular tools, smart actuation, and autonomous task execution." },
    { icon: Radio, title: "Remote Operation Platform", body: "App-based booking, monitoring, control, and machine operation." },
    { icon: RefreshCw, title: "AI Feedback Loop", body: "Continuous improvement using machine data, task history, and field performance." },
  ];
  return (
    <Section id="technology" className="border-y border-border bg-card/20">
      <SectionHeader
        eyebrow="Technology Stack"
        title={<>Technology Built Into <span className="gradient-text-rainbow">Every Machine</span></>}
      />
      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => {
          const palette = [
            { tx: "text-electric", bg: "bg-electric/10", ring: "ring-electric/30", blob: "bg-electric/20" },
            { tx: "text-cyan-brand", bg: "bg-cyan-brand/10", ring: "ring-cyan-brand/30", blob: "bg-cyan-brand/20" },
            { tx: "text-violet-brand", bg: "bg-violet-brand/10", ring: "ring-violet-brand/30", blob: "bg-violet-brand/20" },
            { tx: "text-emerald-brand", bg: "bg-emerald-brand/10", ring: "ring-emerald-brand/30", blob: "bg-emerald-brand/20" },
            { tx: "text-magenta-brand", bg: "bg-magenta-brand/10", ring: "ring-magenta-brand/30", blob: "bg-magenta-brand/20" },
            { tx: "text-accent", bg: "bg-accent/10", ring: "ring-accent/30", blob: "bg-accent/20" },
          ];
          const p = palette[i % palette.length];
          return (
          <div key={t.title} className={`group relative overflow-hidden rounded-xl border border-border bg-background/60 p-6 transition hover:border-electric`}>
            <div className={`absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full ${p.blob} opacity-0 blur-2xl transition group-hover:opacity-100`} />
            <div className="relative">
              <div className={`mb-4 grid h-11 w-11 place-items-center rounded-md ${p.bg} ${p.tx} ring-1 ${p.ring}`}>
                <t.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold">{t.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
            </div>
          </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ---------------------------- MOAT / USP ---------------------------- */
function Moat() {
  const items = [
    { icon: Layers, title: "Multi-Domain Capability", body: "One platform designed for agriculture, construction, rescue, and defense." },
    { icon: Bot, title: "Autonomous Operation", body: "AI-driven digging, mapping, navigation, monitoring, and execution." },
    { icon: Waves, title: "Amphibious Technology", body: "RAMBO-X supports land and water-based applications for flood, rescue, and challenging terrains." },
    { icon: Wrench, title: "Modular System", body: "Plug-and-play tools for agriculture, excavation, rescue, monitoring, and future machine upgrades." },
    { icon: ShieldCheck, title: "Strong IP Foundation", body: "Terra-X has developed protected designs and IP around RoVX-AI and RAMBO-X machine platforms." },
  ];
  return (
    <Section id="moat">
      <SectionHeader
        eyebrow="Technology Moat"
        title={<>Why <span className="gradient-text">Terra-X</span> Is Different</>}
      />
      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((m, i) => (
          <div
            key={m.title}
            className={`rounded-xl border border-border bg-card/40 p-6 transition hover:border-electric ${i === 4 ? "lg:col-start-2" : ""}`}
          >
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-md bg-accent/10 text-accent">
              <m.icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">{m.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{m.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------- MARKET ---------------------------- */
function Market() {
  const tiers = [
    { label: "TAM · Total Addressable", value: "$300B+", body: "Global heavy machinery, agriculture & robotics market" },
    { label: "SAM · Serviceable Available", value: "$35B", body: "Precision agriculture + autonomous construction equipment" },
    { label: "SOM · Serviceable Obtainable", value: "$300M", body: "Initial India + emerging market opportunity" },
  ];
  return (
    <Section id="market" className="border-y border-border bg-card/20">
      <SectionHeader
        eyebrow="Market Opportunity"
        title={<>A Large Opportunity Across <span className="gradient-text-sunset">Agriculture, Construction & Automation</span></>}
        subtitle="TERRA-X operates at the intersection of precision agriculture, construction equipment, autonomous machinery, and industrial robotics — addressing labor shortages, safety risks, climate disasters, and the need for precision automation."
      />
      <div className="mt-14 grid items-end gap-6 md:grid-cols-3">
        {tiers.map((t, i) => {
          const widths = ["w-full", "w-[78%]", "w-[55%]"];
          const tints = [
            { border: "border-electric/30 hover:border-electric", label: "text-electric", val: "gradient-text" },
            { border: "border-cyan-brand/30 hover:border-cyan-brand", label: "text-cyan-brand", val: "gradient-text-sunset" },
            { border: "border-violet-brand/30 hover:border-violet-brand", label: "text-violet-brand", val: "gradient-text-rainbow" },
          ];
          const c = tints[i];
          return (
            <div
              key={t.label}
              className={`relative mx-auto ${widths[i]} rounded-2xl border ${c.border} bg-gradient-to-br from-card to-background p-8 text-center transition`}
            >
              <div className={`font-mono text-xs uppercase tracking-widest ${c.label}`}>{t.label}</div>
              <div className={`mt-4 text-5xl font-black tracking-tight ${c.val}`}>{t.value}</div>
              <p className="mt-3 text-sm text-muted-foreground">{t.body}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ---------------------------- CUSTOMERS ---------------------------- */
function Customers() {
  const items = [
    { icon: Sprout, title: "Orchard Farmers", body: "Farmers growing coconut, mango, and other orchard crops needing precise fertilizer application, disease detection, and tree-level monitoring." },
    { icon: Building2, title: "Small Contractors", body: "Contractors who need cost-effective excavation and land preparation without depending heavily on skilled operators." },
    { icon: Landmark, title: "Government Bodies", body: "Agriculture departments, disaster response agencies, rural development programs, and infrastructure bodies." },
    { icon: Network, title: "Agri-Tech Platforms", body: "Farm analytics, automation, and precision agriculture companies integrating Terra-X machines into service networks." },
  ];
  return (
    <Section id="customers">
      <SectionHeader
        eyebrow="Target Customers"
        title={<>Built for <span className="gradient-text-rainbow">High-Need, High-Impact</span> Customers</>}
      />
      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {items.map((c, i) => {
          const tints = [
            { tx: "text-emerald-brand", bg: "bg-emerald-brand/10", br: "hover:border-emerald-brand" },
            { tx: "text-cyan-brand", bg: "bg-cyan-brand/10", br: "hover:border-cyan-brand" },
            { tx: "text-violet-brand", bg: "bg-violet-brand/10", br: "hover:border-violet-brand" },
            { tx: "text-magenta-brand", bg: "bg-magenta-brand/10", br: "hover:border-magenta-brand" },
          ];
          const t = tints[i % tints.length];
          return (
          <div key={c.title} className={`rounded-xl border border-border bg-card/40 p-6 transition ${t.br} hover:-translate-y-1 duration-300`}>
            <div className={`mb-4 grid h-11 w-11 place-items-center rounded-md ${t.bg} ${t.tx}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">{c.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
          </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ---------------------------- BUSINESS MODEL ---------------------------- */
function Business() {
  const items = [
    { title: "Machine Sales", body: "B2B and government sales of autonomous agricultural and amphibious excavator platforms.", tag: "Hardware" },
    { title: "Rental Platform", body: "Hourly machine rental model starting from ₹2,100+/hour to make advanced machinery accessible.", tag: "Access" },
    { title: "AI + Software Subscription", body: "Recurring revenue through AI features, software upgrades, analytics, monitoring, and automation tools.", tag: "SaaS" },
    { title: "Service & Maintenance", body: "Annual maintenance, spare parts, field support, machine servicing, and fleet uptime support.", tag: "Services" },
    { title: "Platform Model", body: "Online platform for heavy machinery booking, automation, machine usage data, and remote operation.", tag: "Platform" },
  ];
  return (
    <Section id="business" className="border-y border-border bg-card/20">
      <SectionHeader
        eyebrow="Business Model"
        title={<>Multiple Revenue Streams for <span className="gradient-text-sunset">Scalable Growth</span></>}
      />
      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((b, i) => (
          <div key={b.title} className="relative rounded-xl border border-border bg-background/60 p-6 transition hover:border-electric">
            <div className="flex items-start justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-electric">{b.tag}</span>
              <span className="font-mono text-xs text-muted-foreground">R0{i + 1}</span>
            </div>
            <h3 className="mt-4 text-lg font-bold">{b.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{b.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------- STRATEGY ---------------------------- */
function Strategy() {
  const steps = [
    { title: "Pilot Deployment", body: "Start with controlled orchard and field pilots to validate performance, ROI, safety, and precision outcomes." },
    { title: "Rental-Led Adoption", body: "Use affordable hourly rental to lower entry barriers for farmers, small contractors, and local operators." },
    { title: "Focused Targeting", body: "Begin with orchard farmers where tree-level crop monitoring and fertilizer application create visible value." },
    { title: "Strategic Partnerships", body: "Collaborate with FPOs, agri-tech companies, government bodies, and machinery rental networks." },
    { title: "Expansion Roadmap", body: "Scale from agriculture to construction, rescue, disaster response, and defense-linked applications." },
  ];
  return (
    <Section id="strategy">
      <SectionHeader
        eyebrow="Market Strategy"
        title={<>Our <span className="gradient-text">Go-To-Market</span> Strategy</>}
      />
      <div className="mt-14 relative">
        <div className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-electric via-electric/40 to-transparent md:left-1/2" />
        <ol className="space-y-6">
          {steps.map((s, i) => (
            <li key={s.title} className={`relative flex flex-col gap-4 md:flex-row md:items-center ${i % 2 ? "md:flex-row-reverse" : ""}`}>
              <div className="ml-12 flex-1 rounded-xl border border-border bg-card/40 p-6 transition hover:border-electric md:ml-0">
                <div className={`text-xs font-mono uppercase tracking-widest text-electric ${i % 2 ? "md:text-right" : ""}`}>Step 0{i + 1}</div>
                <h3 className={`mt-2 text-xl font-bold ${i % 2 ? "md:text-right" : ""}`}>{s.title}</h3>
                <p className={`mt-2 text-sm text-muted-foreground ${i % 2 ? "md:text-right" : ""}`}>{s.body}</p>
              </div>
              <div className="absolute left-6 top-6 grid h-6 w-6 -translate-x-1/2 place-items-center rounded-full bg-electric ring-4 ring-background md:left-1/2 md:top-1/2 md:-translate-y-1/2">
                <span className="text-[10px] font-bold text-primary-foreground">{i + 1}</span>
              </div>
              <div className="hidden flex-1 md:block" />
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

/* ---------------------------- TRACTION ---------------------------- */
function Traction() {
  const items = [
    "2 machine concepts developed: RoVX-AI and RAMBO-X",
    "Design representations created for agricultural and amphibious platforms",
    "15+ novel machine features compared to traditional excavators",
    "AI + LiDAR + robotics architecture defined",
    "Prototype development targeted within 6–12 months post funding",
    "Trademark and IP protection efforts initiated",
  ];
  return (
    <Section id="traction" className="border-y border-border bg-card/20">
      <SectionHeader
        eyebrow="Traction & Status"
        title={<>Early Validation & <span className="gradient-text">IP-Backed Development</span></>}
      />
      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <div key={t} className="flex items-start gap-4 rounded-xl border border-border bg-background/60 p-5 transition hover:border-electric">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-electric/10 font-mono text-sm font-bold text-electric ring-1 ring-electric/30">
              0{i + 1}
            </div>
            <p className="text-sm font-medium leading-snug">{t}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------- COMPETITIVE ---------------------------- */
function Competitive() {
  const cols = ["Feature", "Manual Excavators", "Existing Autonomous", "Agri Drones", "TERRA-X"];
  const rows: Array<[string, boolean, boolean, boolean, boolean]> = [
    ["Autonomous Operation", false, true, true, true],
    ["Dual Use: Agri + Construction", false, false, false, true],
    ["AI-Based Detection", false, true, true, true],
    ["Precision Fertilizer Dosing", false, false, true, true],
    ["Remote Operation", false, true, false, true],
    ["Land + Amphibious Capability", false, false, false, true],
    ["Modular Tools", false, false, false, true],
    ["Data & Analytics", false, true, true, true],
  ];
  return (
    <Section id="competitive">
      <SectionHeader
        eyebrow="Competitive Landscape"
        title={<>Our <span className="gradient-text-rainbow">Competitive Advantage</span></>}
      />
      <div className="mt-14 overflow-x-auto rounded-2xl border border-border bg-card/40">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              {cols.map((c, i) => (
                <th
                  key={c}
                  className={`p-4 text-xs font-mono uppercase tracking-widest ${
                    i === 4 ? "bg-electric/10 text-electric" : "text-muted-foreground"
                  }`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([feat, a, b, c, d], idx) => (
              <tr key={feat} className={idx % 2 ? "bg-background/30" : ""}>
                <td className="p-4 font-medium">{feat}</td>
                <Cell on={a} />
                <Cell on={b} />
                <Cell on={c} />
                <Cell on={d} highlight />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-muted-foreground">
        Unlike conventional excavators, agri drones, or single-use precision tools, Terra-X combines excavation, crop intelligence, robotic actuation, AI sensing, and remote operation into one multi-domain machine platform.
      </p>
    </Section>
  );
}

function Cell({ on, highlight = false }: { on: boolean; highlight?: boolean }) {
  return (
    <td className={`p-4 ${highlight ? "bg-electric/5" : ""}`}>
      {on ? (
        <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${highlight ? "bg-electric text-primary-foreground" : "bg-electric/15 text-electric"}`}>
          <Check className="h-4 w-4" />
        </span>
      ) : (
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground/60">
          <X className="h-4 w-4" />
        </span>
      )}
    </td>
  );
}

/* ---------------------------- FOUNDER ---------------------------- */
function Founder() {
  const points = [
    "B.Tech Graduate, KTU",
    "Multi-round finalist, IIT Palakkad DISHA Program",
    "2 utility patent-linked innovations",
    "Focused on AI-driven industrial machinery and autonomous systems",
  ];
  return (
    <Section id="founder" className="border-y border-border bg-card/20">
      <SectionHeader
        eyebrow="Founder / Promoter"
        title={<>Led by <span className="gradient-text">Technical Innovation</span></>}
      />
      <div className="mt-14 grid gap-8 lg:grid-cols-[320px_1fr] lg:items-center">
        <div className="relative mx-auto w-full max-w-xs">
          <div className="aspect-square overflow-hidden rounded-2xl border border-electric/30 bg-gradient-to-br from-electric/20 via-background to-accent/10 p-8">
            <div className="grid h-full w-full place-items-center rounded-xl border border-border bg-background/40">
              <div className="text-center">
                <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-electric to-[oklch(0.45_0.18_240)] text-3xl font-black text-primary-foreground glow-electric">
                  SA
                </div>
                <div className="mt-4 text-lg font-bold">Sooraj Anil</div>
                <div className="text-xs font-mono uppercase tracking-widest text-electric">Founder · Promoter</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="text-lg text-foreground/90 leading-relaxed">
            <span className="font-semibold text-foreground">Sooraj Anil</span> is a B.Tech graduate from KTU with a strong record of transforming advanced machine concepts into protected intellectual property. He has been a multi-round finalist in the IIT Palakkad DISHA program and brings a rare combination of technical rigor, disruptive thinking, and deep interest in industrial innovation.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-lg border border-border bg-background/60 p-4">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="text-sm font-medium">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

/* ---------------------------- CONTACT ---------------------------- */
function Contact() {
  return (
    <Section id="contact">
      <div className="relative overflow-hidden rounded-3xl border border-electric/30 bg-gradient-to-br from-card via-background to-card p-8 sm:p-12 lg:p-16">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-electric/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-electric">
            <Rocket className="h-4 w-4" /> Let's Build
          </div>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Build the Future of Autonomous Machinery with <span className="gradient-text">Terra-X</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            For partnerships, investment, pilots, and strategic collaborations, connect with Terra-X.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <ContactLink icon={Phone} label="Phone" value="+91 87147 51947" href="tel:+918714751947" />
            <ContactLink icon={Mail} label="Email" value="soorajanil71@gmail.com" href="mailto:soorajanil71@gmail.com" />
            <ContactLink icon={Linkedin} label="LinkedIn" value="Sooraj Anil" href="https://www.linkedin.com/in/sooraj-anil-43a9872b8" />
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href="mailto:soorajanil71@gmail.com" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 glow-electric">
              Contact Founder <ArrowRight className="h-4 w-4" />
            </a>
            <a href="mailto:soorajanil71@gmail.com?subject=Partnership%20Inquiry" className="inline-flex items-center gap-2 rounded-md border border-accent/50 bg-accent/10 px-6 py-3 text-sm font-semibold text-accent transition hover:bg-accent/20">
              Request Partnership
            </a>
            <a href="mailto:soorajanil71@gmail.com?subject=Pilot%20Deployment" className="inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-6 py-3 text-sm font-semibold transition hover:border-electric hover:text-electric">
              Discuss Pilot Deployment
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}

function ContactLink({
  icon: Icon, label, value, href,
}: { icon: React.ElementType; label: string; value: string; href: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="group flex items-center gap-3 rounded-xl border border-border bg-background/60 p-4 text-left transition hover:border-electric"
    >
      <div className="grid h-10 w-10 place-items-center rounded-md bg-electric/10 text-electric transition group-hover:bg-electric group-hover:text-primary-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-medium">{value}</div>
      </div>
    </a>
  );
}

/* ---------------------------- FOOTER ---------------------------- */
function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <div>
          <img
            src={terraLogo.url}
            alt="TERRA-X (OPC) Pvt Ltd logo"
            className="h-14 w-auto"
          />
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Reinventing heavy machinery with autonomous intelligence — for agriculture, construction, rescue, and defense.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 text-xs text-muted-foreground sm:items-end">
          <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> India</div>
          <div>© {new Date().getFullYear()} TERRA-X. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
