import { createFileRoute } from "@tanstack/react-router";
import { TechStack, Moat } from "@/components/site";

export const Route = createFileRoute("/technology")({
  head: () => ({
    meta: [
      { title: "Technology | AI, LiDAR, Robotics & Remote Ops" },
      {
        name: "description",
        content:
          "Inside the Terra-X technology stack: AI, LiDAR, IoT sensor fusion, robotics, remote operation and feedback loops.",
      },
      { property: "og:title", content: "Technology | AI, LiDAR, Robotics & Remote Ops" },
      {
        property: "og:description",
        content:
          "Inside the Terra-X technology stack: AI, LiDAR, IoT sensor fusion, robotics, remote operation and feedback loops.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/technology" }],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="pt-24">
      <TechStack />
      <Moat />
    </div>
  );
}
