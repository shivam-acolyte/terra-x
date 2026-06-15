import { createFileRoute } from "@tanstack/react-router";
import { Strategy, Traction, Competitive } from "@/components/site";

export const Route = createFileRoute("/strategy")({
  head: () => ({
    meta: [
      { title: "Strategy, Traction & Competitive Edge | Terra-X" },
      {
        name: "description",
        content:
          "Terra-X go-to-market strategy, early traction, IP, and how we compare with manual excavators, agri drones and existing autonomous machines.",
      },
      { property: "og:title", content: "Strategy, Traction & Competitive Edge | Terra-X" },
      {
        property: "og:description",
        content:
          "Terra-X go-to-market strategy, early traction, IP, and how we compare with manual excavators, agri drones and existing autonomous machines.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/strategy" }],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="pt-24">
      <Strategy />
      <Traction />
      <Competitive />
    </div>
  );
}
