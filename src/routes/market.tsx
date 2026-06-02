import { createFileRoute } from "@tanstack/react-router";
import { Market, Customers, Business } from "@/components/site";

export const Route = createFileRoute("/market")({
  head: () => ({
    meta: [
      { title: "Market Opportunity & Target Customers | Terra-X" },
      { name: "description", content: "$300B+ market across precision agriculture, autonomous construction equipment and industrial robotics — and the customers Terra-X serves." },
      { property: "og:title", content: "Market Opportunity & Target Customers | Terra-X" },
      { property: "og:description", content: "$300B+ market across precision agriculture, autonomous construction equipment and industrial robotics — and the customers Terra-X serves." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/market" }],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="pt-24">
      <Market />
      <Customers />
      <Business />
    </div>
  );
}
