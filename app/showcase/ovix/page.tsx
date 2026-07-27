import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import OvixBackdrop from "@/components/showcase/ovix/OvixBackdrop";
import TransactionToast from "@/components/showcase/ovix/TransactionToast";
import "@/components/showcase/ovix/ovix.css";

// The dashboard is Outfit (App.css body override); DM Sans is the global
// default from index.css. Both are loaded via next/font/google.
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ovix-outfit",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-ovix-dmsans",
});

export const metadata: Metadata = {
  title: "0VIX Lending Markets - Showcase",
  description:
    "A pixel-faithful port of the 0VIX lending dashboard and its state-machine TransactionToast, replayed on a scripted fake supply/borrow flow.",
};

export default function OvixShowcasePage() {
  return (
    <div
      className={`ovix-root ${outfit.variable} ${dmSans.variable}`}
      style={{ fontFamily: "var(--font-ovix-outfit), sans-serif" }}
    >
      <OvixBackdrop />
      <TransactionToast />
    </div>
  );
}
