import { NextResponse } from "next/server";
import { readAll, readCompany, patchCompany, canAdvance } from "@/lib/pipeline/store";
import { PipelineCompanySchema } from "@/lib/pipeline/schema";

/** Typo'd keys must 400, not vanish: zod strips unknown keys silently by default. */
const PatchSchema = PipelineCompanySchema.partial().strict();

const gone = () => new NextResponse(null, { status: 404 });
const isProd = () => process.env.NODE_ENV === "production";

export const dynamic = "force-dynamic";
export const preferredRegion = "sin1"; // DB is Neon ap-southeast-1; keep server hops local

export async function GET() {
  if (isProd()) return gone();
  return NextResponse.json({ companies: await readAll() });
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
  const parsed = PatchSchema.safeParse(patch);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid patch", issues: parsed.error.issues.slice(0, 5) },
      { status: 400 },
    );
  }
  if (typeof parsed.data.status === "string") {
    const existing = await readCompany(slug);
    if (!existing) return NextResponse.json({ error: "unknown slug" }, { status: 404 });
    if (!canAdvance(existing.status, parsed.data.status)) {
      return NextResponse.json({ error: "illegal transition" }, { status: 400 });
    }
  }
  try {
    return NextResponse.json({ company: await patchCompany(slug, parsed.data) });
  } catch {
    return NextResponse.json({ error: "unknown slug" }, { status: 404 });
  }
}
