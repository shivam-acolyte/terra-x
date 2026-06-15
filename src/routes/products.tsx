import { createFileRoute } from "@tanstack/react-router";
import { Products, HowItWorks } from "@/components/site";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Machines | RoVX-AI & RAMBO-X Autonomous Platforms" },
      {
        name: "description",
        content:
          "Explore RoVX-AI agricultural rover and RAMBO-X amphibious autonomous excavator from Terra-X.",
      },
      { property: "og:title", content: "Machines | RoVX-AI & RAMBO-X Autonomous Platforms" },
      {
        property: "og:description",
        content:
          "Explore RoVX-AI agricultural rover and RAMBO-X amphibious autonomous excavator from Terra-X.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="pt-24">
      <Products />
      <HowItWorks />
    </div>
  );
}
