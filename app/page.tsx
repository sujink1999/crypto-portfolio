import Navbar from "@/components/Navbar";
import SmokeCanvas from "@/components/story/SmokeCanvas";
import Hero from "@/components/Hero";
import HomeProof from "@/components/HomeProof";
import AboutDeck from "@/components/AboutDeck";

export default function Home() {
  return (
    <main className="relative h-dvh bg-black">
      {/* the one living light source - same fbm smoke as the pitch pages */}
      <div className="pointer-events-none absolute inset-0">
        <SmokeCanvas accent="#4ade80" density={0.16} />
      </div>
      <Navbar />
      {/* one chapter per viewport, like the pitch pages */}
      <div
        id="home-doc"
        className="absolute inset-0 overflow-y-auto snap-y snap-mandatory"
      >
        <Hero />
        <section id="work" className="h-full snap-start border-t border-white/10">
          <HomeProof />
        </section>
        <AboutDeck />
      </div>
    </main>
  );
}
