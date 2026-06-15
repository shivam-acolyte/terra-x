import { createFileRoute } from "@tanstack/react-router";
import { About, Founder } from "@/components/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Terra-X | Vision, Mission & Approach" },
      {
        name: "description",
        content:
          "Deep-tech manufacturing startup developing AI-powered autonomous heavy machines for construction, agriculture, rescue, and defense.",
      },
      { property: "og:title", content: "About Terra-X | Vision, Mission & Approach" },
      {
        property: "og:description",
        content:
          "Deep-tech manufacturing startup developing AI-powered autonomous heavy machines for construction, agriculture, rescue, and defense.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="pt-24">
      <About />
      <Founder />
    </div>
  );
}
