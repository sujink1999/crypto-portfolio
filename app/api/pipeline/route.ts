import { NextResponse } from "next/server";
import { readAll, readCompany, patchCompany, canAdvance } from "@/lib/pipeline/store";
import { PIPELINE_DIR } from "@/lib/pipeline/dir";

const gone = () => new NextResponse(null, { status: 404 });
const isProd = () => process.env.NODE_ENV === "production";

export const dynamic = "force-dynamic";

export async function GET() {
  if (isProd()) return gone();
  return NextResponse.json({ companies: readAll(PIPELINE_DIR) });
}

export async function PATCH(req: Request) {
  if (isProd()) return gone();
  const { slug, patch } = await req.json();
  if (typeof slug !== "string" || !patch || typeof patch !== "object") {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (typeof patch.status === "string") {
    const existing = readCompany(PIPELINE_DIR, slug);
    if (!existing) return NextResponse.json({ error: "unknown slug" }, { status: 404 });
    if (!canAdvance(existing.status, patch.status)) {
      return NextResponse.json({ error: "illegal transition" }, { status: 400 });
    }
  }
  try {
    return NextResponse.json({ company: patchCompany(PIPELINE_DIR, slug, patch) });
  } catch {
    return NextResponse.json({ error: "unknown slug" }, { status: 404 });
  }
}
