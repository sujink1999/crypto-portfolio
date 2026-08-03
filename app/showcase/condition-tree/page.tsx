import type { Metadata } from "next";
import ConditionTreeDemo from "@/components/showcase/condition-tree/ConditionTreeDemo";

export const metadata: Metadata = {
  title: "Condition Tree Engine - Showcase",
  description:
    "A pure-TypeScript engine for nested AND/OR condition trees: immutable operations, command-history undo/redo with coalescing, validation, and canonical serialization.",
  robots: { index: false, follow: false },
};

export default async function ConditionTreeShowcasePage({
  searchParams,
}: {
  searchParams: Promise<{ embed?: string }>;
}) {
  const { embed } = await searchParams;
  return <ConditionTreeDemo embed={embed === "1"} />;
}
