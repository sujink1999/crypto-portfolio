import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

export default function About() {
  return (
    <section id="about" className="relative px-6 md:px-16 lg:px-24 py-32">
      {/* Two-column layout */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <ScrollReveal>
          <div className="relative rounded-2xl overflow-hidden">
            <Image
              src="/shizo1.png"
              alt="Sujin"
              width={600}
              height={720}
              className="max-w-xs mx-auto h-auto object-cover"
            />
          </div>
        </ScrollReveal>

        {/* Text */}
        <ScrollReveal delay={150}>
          <div className="flex flex-col gap-6">
            <span className="text-sm font-mono text-white/30">// WHO I AM</span>
            <h3 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
              8 years of building what people actually use.
            </h3>
            <p className="text-base text-white/50 leading-relaxed">
              Mobile apps, websites, full-stack platforms, crypto infrastructure
              &mdash; if it ships to production, I&apos;ve probably built
              something like it. I care about clean architecture, solid
              engineering, and software that holds up in the real world.
            </p>
            <p className="text-base text-white/50 leading-relaxed">
              When I&apos;m not coding, you&apos;ll find me at the gym, listening
              to music, or planning the next trip somewhere new.
            </p>
            <span className="text-xs font-mono text-white/20 mt-4">
              Based in Bali
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
