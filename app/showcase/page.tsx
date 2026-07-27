import Link from "next/link";

const showcases = [
  {
    href: "/showcase/beans",
    title: "Beans",
    subtitle: "Solana token-launch game - live desktop UI recreation",
    tag: "Interactive port",
  },
  {
    href: "/showcase/ovix",
    title: "0VIX",
    subtitle: "Transaction widget - production state-machine toast, replayed",
    tag: "Interactive port",
  },
  {
    href: "/showcase/society",
    title: "Vanta Society",
    subtitle: "Consumer mobile app - key screens recreated on web",
    tag: "Recreation",
  },
];

export default function ShowcaseIndex() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
          Internal preview
        </p>
        <h1 className="mt-3 text-3xl font-light tracking-tight text-white/90">
          Project Showcases
        </h1>
        <p className="mt-2 font-light text-white/55">
          Live recreations and ports of shipped products, for use in
          company-specific story routes.
        </p>
        <ul className="mt-10 space-y-4">
          {showcases.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="group flex items-baseline justify-between border border-white/10 px-5 py-4 transition-colors hover:border-white/30 hover:bg-white/[0.03]"
              >
                <span>
                  <span className="font-normal text-white/90">{s.title}</span>
                  <span className="ml-3 text-sm font-light text-white/50">
                    {s.subtitle}
                  </span>
                </span>
                <span className="ml-4 shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 transition-colors group-hover:text-white/70">
                  {s.tag}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
