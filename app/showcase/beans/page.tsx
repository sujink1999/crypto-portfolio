import type { Metadata } from "next";
import BeansDesktop from "@/components/showcase/beans/BeansDesktop";

export const metadata: Metadata = {
  title: "Beans - Showcase",
  description:
    "A faithful recreation of Beans' retro desktop token-launch UI, driven by a scripted local activity feed.",
};

export default function BeansShowcasePage() {
  return <BeansDesktop />;
}
