"use client";

import { Outfit, DM_Sans } from "next/font/google";
import OvixBackdrop from "@/components/showcase/ovix/OvixBackdrop";
import TransactionToast from "@/components/showcase/ovix/TransactionToast";
import "@/components/showcase/ovix/ovix.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ovix-outfit",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-ovix-dmsans",
});

/** 0VIX lending dashboard, frameless - StoryOpening supplies the laptop shell. */
export default function OvixDemo() {
  return (
    <div
      className={`ovix-root ${outfit.variable} ${dmSans.variable} h-full w-full overflow-y-auto`}
      style={{ fontFamily: "var(--font-ovix-outfit), sans-serif" }}
    >
      <OvixBackdrop />
      <TransactionToast />
    </div>
  );
}
