import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const PICKS_PATH = join(process.cwd(), "content", "reference-picks.json");

export async function GET() {
  if (process.env.NODE_ENV === "production") return new NextResponse(null, { status: 404 });
  if (!existsSync(PICKS_PATH)) return NextResponse.json({ picks: [] });
  return NextResponse.json(JSON.parse(readFileSync(PICKS_PATH, "utf8")));
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") return new NextResponse(null, { status: 404 });
  const body = await req.json();
  if (!Array.isArray(body.picks)) {
    return NextResponse.json({ error: "picks must be an array" }, { status: 400 });
  }
  writeFileSync(PICKS_PATH, JSON.stringify({ picks: body.picks, savedAt: new Date().toISOString() }, null, 2) + "\n");
  return NextResponse.json({ ok: true, count: body.picks.length });
}
