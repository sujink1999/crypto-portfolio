import DesignDemo from "@/components/capabilities/DesignDemo";
import TokenListDemo from "@/components/capabilities/TokenListDemo";
import ApiDemo from "@/components/capabilities/ApiDemo";
import TxBuilderDemo from "@/components/capabilities/TxBuilderDemo";
import ScrollReveal from "@/components/ScrollReveal";

const cards = [
  {
    title: "Design with",
    highlight: "purpose",
    description:
      "From Figma to production, designing systems that translate cleanly into real, shippable interfaces.",
    Demo: DesignDemo,
  },
  {
    title: "Build interfaces that",
    highlight: "feel alive",
    description:
      "React, React Native, real-time data, fluid animations. Frontends that users remember.",
    Demo: TokenListDemo,
  },
  {
    title: "Wire the full",
    highlight: "stack",
    description:
      "Node.js, Express, databases, APIs. Connecting every layer from client to server to data.",
    Demo: ApiDemo,
  },
  {
    title: "Connect to the",
    highlight: "chain",
    description:
      "Transaction builders, signing flows, live chain reads. Making protocol interactions feel native.",
    Demo: TxBuilderDemo,
  },
];

const tags = ["DESIGN", "FRONTEND", "BACKEND", "WEB3"];

export default function Capabilities() {
  return (
    <section
      id="capabilities"
      className="relative px-6 md:px-16 lg:px-24 py-32"
    >
      {/* Section header */}
      <ScrollReveal>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tight">
            Core Skills
          </h2>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-xs sm:text-sm font-mono text-white/40">
            {tags.map((tag) => (
              <span key={tag}>// {tag}</span>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {cards.map((card, i) => (
          <ScrollReveal key={card.highlight} delay={i * 100}>
            <div className="group rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:p-6 overflow-hidden transition-colors duration-300 hover:border-white/10">
              <h3 className="text-lg font-medium text-white/80 mb-2">
                {card.title}{" "}
                <span className="bg-gradient-to-r from-accent to-emerald-300 bg-clip-text text-transparent">
                  {card.highlight}
                </span>
              </h3>
              <p className="text-sm text-white/35 leading-relaxed mb-5">
                {card.description}
              </p>
              <div className="rounded-xl bg-white/[0.01] border border-white/5 p-3 transition-transform duration-300 will-change-transform group-hover:scale-[1.03] origin-center">
                <card.Demo />
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
