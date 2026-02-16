import HeroTitle from "@/components/HeroTitle";
import DashboardWireframe from "@/components/DashboardWireframe";
import ScrollReveal from "@/components/ScrollReveal";

export default function Hero() {
  return (
    <section className="relative h-screen max-h-[1200px] overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center grayscale"
        style={{
          backgroundImage:
            'url("https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/fc03fa5a-129a-4943-8063-30b7b6d88a78_3840w.webp")',
          maskImage:
            "linear-gradient(to bottom, transparent, black 0%, black 20%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 0%, black 20%, transparent)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center px-6 md:px-16 lg:px-24">
        <div className="flex w-full items-center justify-between gap-12">
          <ScrollReveal className="flex max-w-4xl flex-col gap-8">
            <HeroTitle />

            <p className="max-w-lg text-base leading-relaxed text-white md:text-lg">
              I build fast, polished interfaces that make complex systems feel
              simple. Obsessed with performance, precision, and getting the
              details right.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-105"
              >
                View Projects
                <span aria-hidden="true">&rarr;</span>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-white/30"
              >
                Contact
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal
            delay={200}
            className="hidden lg:block shrink-0"
          >
            <div
              style={{
                maskImage: "linear-gradient(to bottom, white, transparent)",
                WebkitMaskImage: "linear-gradient(to bottom, white, transparent)",
              }}
            >
              <DashboardWireframe />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
