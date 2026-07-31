import { notFound } from "next/navigation";
import Detail from "@/components/pipeline/Detail";

export const metadata = { title: "Pipeline", robots: { index: false, follow: false } };

export default async function CompanyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { slug } = await params;
  return <Detail slug={slug} />;
}
