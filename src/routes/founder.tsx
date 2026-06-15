import { createFileRoute } from "@tanstack/react-router";
import { Founder } from "@/components/site";

export const Route = createFileRoute("/founder")({
  head: () => ({
    meta: [
      { title: "Founder | Sooraj Anil | Terra-X" },
      {
        name: "description",
        content:
          "Meet Sooraj Anil — founder of Terra-X, building AI-driven autonomous heavy machinery.",
      },
      { property: "og:title", content: "Founder | Sooraj Anil | Terra-X" },
      {
        property: "og:description",
        content:
          "Meet Sooraj Anil — founder of Terra-X, building AI-driven autonomous heavy machinery.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/founder" }],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="pt-24">
      <Founder />
    </div>
  );
}
