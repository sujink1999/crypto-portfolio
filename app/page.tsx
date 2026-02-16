import Hero from "@/components/Hero";
import Capabilities from "@/components/Capabilities";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Capabilities />
      <Projects />
      <About />
      <Contact />
    </main>
  );
}
