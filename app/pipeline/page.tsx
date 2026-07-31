import { notFound } from "next/navigation";
import Board from "@/components/pipeline/Board";

export const metadata = { title: "Pipeline", robots: { index: false, follow: false } };

export default function PipelinePage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Board />;
}
