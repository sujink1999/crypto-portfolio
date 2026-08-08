import { notFound } from "next/navigation";
import { COMPANIES } from "@/companies";
import ReferencePicker, { type RefItem } from "@/components/pipeline/ReferencePicker";

export const metadata = { title: "Reference Picker", robots: { index: false, follow: false } };

export default function ReferencePickerPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const items: RefItem[] = [];
  for (const pitch of Object.values(COMPANIES)) {
    pitch.story.forEach((text, i) => {
      const group = i === 0 ? "beat-1" : i === 1 ? "beat-2" : "beat-3";
      items.push({ id: `${pitch.slug}:${group}:${i}`, slug: pitch.slug, company: pitch.company, group, text });
    });
    pitch.requirements.forEach((r, i) => {
      items.push({ id: `${pitch.slug}:claim:${i}`, slug: pitch.slug, company: pitch.company, group: "claim", text: r.claim });
    });
    items.push({
      id: `${pitch.slug}:closing:0`,
      slug: pitch.slug,
      company: pitch.company,
      group: "closing",
      text: pitch.closing.line,
    });
  }

  return <ReferencePicker items={items} />;
}
