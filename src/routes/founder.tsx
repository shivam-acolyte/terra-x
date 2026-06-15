import { createFileRoute } from "@tanstack/react-router";
import { Founder } from "@/components/site";
import { absoluteUrl } from "@/lib/site-config";

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
      { property: "og:url", content: absoluteUrl("/founder") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/founder") }],
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
