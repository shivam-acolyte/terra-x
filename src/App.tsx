import {
  About,
  Business,
  Competitive,
  Contact,
  Customers,
  FAQs,
  Footer,
  Founder,
  Hero,
  HowItWorks,
  Market,
  Moat,
  Nav,
  Products,
  SectionHeader,
  Solutions,
  Strategy,
  TechStack,
  Testimonials,
  Traction,
} from "@/components/site";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Cpu, Layers, Phone, Sparkles, Target } from "lucide-react";
import { useEffect } from "react";

// Page metadata configuration
const pageMetadata = {
  "/": {
    title: "TERRA-X | Autonomous AI Excavators for Construction, Agriculture & Rescue",
    description: "See how TERRA-X's autonomous excavators cut labor costs and improve safety across construction, farming, and rescue operations. Get a demo.",
  },
  "/about": {
    title: "About TERRA-X | Autonomous Heavy Machinery Company",
    description: "Learn about TERRA-X's mission to make autonomous AI excavation safe, accessible, and reliable across construction, agriculture, rescue, and defense.",
  },
  "/products": {
    title: "TERRA-X Products | Autonomous Excavators & Heavy Machinery",
    description: "Explore TERRA-X's autonomous excavator models built for construction, agriculture, rescue, and defense operations.",
  },
  "/technology": {
    title: "TERRA-X Technology | How Autonomous Excavation Works",
    description: "A technical look at the AI, sensors, and planning systems behind TERRA-X's autonomous excavators.",
  },
  "/market": {
    title: "The Autonomous Heavy Machinery Market | TERRA-X",
    description: "An overview of the market for autonomous excavators and AI-powered heavy machinery across construction, agriculture, rescue, and defense.",
  },
  "/strategy": {
    title: "TERRA-X Strategy | Our Approach to Autonomous Heavy Machinery",
    description: "How TERRA-X is building and scaling autonomous excavators across construction, agriculture, rescue, and defense.",
  },
  "/founder": {
    title: "Sooraj Anil — Founder of TERRA-X",
    description: "Meet Sooraj Anil, founder of TERRA-X, building AI-powered autonomous excavators for construction, agriculture, rescue, and defense.",
  },
  "/contact": {
    title: "Contact TERRA-X | Request a Demo or Get Support",
    description: "Get in touch with TERRA-X for demo requests, partnership inquiries, or support.",
  },
} as const;

// Helper function to update page metadata
function updatePageMetadata(path: string) {
  const cleanPath = path.replace(/\/+$/, "") || "/";
  const metadata = pageMetadata[cleanPath as keyof typeof pageMetadata];
  
  if (metadata) {
    document.title = metadata.title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", metadata.description);
    }
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", metadata.title);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute("content", metadata.description);
    }
  }
}

const explore = [
  {
    to: "/about",
    icon: Sparkles,
    title: "About Terra-X",
    text: "The story behind autonomous, AI-powered heavy machines.",
  },
  {
    to: "/products",
    icon: Bot,
    title: "Machines",
    text: "Explore RoVX-AI, RAMBO-X and future product platforms.",
  },
  {
    to: "/technology",
    icon: Cpu,
    title: "Technology",
    text: "AI autonomy, sensors, rugged hardware and IP-backed systems.",
  },
  {
    to: "/market",
    icon: Layers,
    title: "Market & Customers",
    text: "Agriculture, construction, disaster response and industrial robotics.",
  },
  {
    to: "/strategy",
    icon: Target,
    title: "Strategy & Traction",
    text: "Go-to-market, competitive moat and development validation.",
  },
  {
    to: "/contact",
    icon: Phone,
    title: "Contact",
    text: "Connect for pilots, partnerships, investment and collaboration.",
  },
] as const;

function ExploreSection() {
  return (
    <section className="relative border-y border-border bg-card/20 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Explore Terra-X"
          title="Dive deeper into the platform"
          subtitle="Every section of our story now lives on its own page."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {explore.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.to}
                href={item.to}
                className="group rounded-2xl border border-border bg-background/75 p-6 shadow-soft transition hover:-translate-y-1 hover:border-electric/50 hover:shadow-glow"
              >
                <div className="mb-5 inline-flex rounded-2xl bg-electric/10 p-3 text-electric">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
                <Button
                  variant="ghost"
                  className="mt-5 px-0 text-electric hover:bg-transparent hover:text-electric/80"
                >
                  Open page <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Button>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Solutions />
      <Products />
      <ExploreSection />
      <Testimonials />
      <Contact />
      <FAQs />
    </>
  );
}

function AboutPage() {
  return (
    <div className="pt-24">
      <About />
      <Founder />
    </div>
  );
}

function ProductsPage() {
  return (
    <div className="pt-24">
      <Products />
      <HowItWorks />
    </div>
  );
}

function TechnologyPage() {
  return (
    <div className="pt-24">
      <TechStack />
      <Moat />
    </div>
  );
}

function MarketPage() {
  return (
    <div className="pt-24">
      <Market />
      <Customers />
      <Business />
    </div>
  );
}

function StrategyPage() {
  return (
    <div className="pt-24">
      <Strategy />
      <Traction />
      <Competitive />
    </div>
  );
}

function FounderPage() {
  return (
    <div className="pt-24">
      <Founder />
    </div>
  );
}

function ContactPage() {
  return (
    <div className="pt-24">
      <Contact />
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 pt-24">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

function CurrentPage() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  // Update page metadata when route changes
  useEffect(() => {
    updatePageMetadata(path);
  }, [path]);

  switch (path) {
    case "/":
      return <HomePage />;
    case "/about":
      return <AboutPage />;
    case "/products":
      return <ProductsPage />;
    case "/technology":
      return <TechnologyPage />;
    case "/market":
      return <MarketPage />;
    case "/strategy":
      return <StrategyPage />;
    case "/founder":
      return <FounderPage />;
    case "/contact":
      return <ContactPage />;
    default:
      return <NotFoundPage />;
  }
}

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <CurrentPage />
      </main>
      <Footer />
    </div>
  );
}
