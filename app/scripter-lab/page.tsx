import { notFound } from "next/navigation";
import ScripterLab from "@/components/pipeline/ScripterLab";

export const metadata = { title: "Scripter Lab", robots: { index: false, follow: false } };

export default function ScripterLabPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <ScripterLab />;
}
