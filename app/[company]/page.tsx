import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COMPANIES } from "@/companies";
import StoryOpening from "@/components/story/StoryOpening";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(COMPANIES).map((company) => ({ company }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ company: string }>;
}): Promise<Metadata> {
  const { company } = await params;
  const pitch = COMPANIES[company];
  if (!pitch) return {};
  const title = `Hey ${pitch.company} - I'm Sujin`;
  const description = `An invitation written for ${pitch.company}. A two-minute read.`;
  return {
    title: `Sujin K - for ${pitch.company}`,
    description: pitch.hook,
    robots: pitch.unlisted === false ? undefined : { index: false, follow: false },
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CompanyPitchPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  const pitch = COMPANIES[company];
  if (!pitch) notFound();
  return <StoryOpening pitch={pitch} />;
}
