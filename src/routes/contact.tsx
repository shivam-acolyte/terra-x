import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/components/site";
import { absoluteUrl } from "@/lib/site-config";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Terra-X | Partnerships, Pilots & Investment" },
      {
        name: "description",
        content:
          "Reach Terra-X for partnerships, investment, pilot deployments and strategic collaborations.",
      },
      { property: "og:title", content: "Contact Terra-X | Partnerships, Pilots & Investment" },
      {
        property: "og:description",
        content:
          "Reach Terra-X for partnerships, investment, pilot deployments and strategic collaborations.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/contact") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/contact") }],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="pt-24">
      <Contact />
    </div>
  );
}
