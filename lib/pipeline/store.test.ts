import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readAll, readCompany, writeCompany, patchCompany, canAdvance } from "./store";
import type { PipelineCompany } from "./types";

const base = (): PipelineCompany => ({
  slug: "acme",
  company: "Acme",
  role: "Full Stack Engineer",
  source: "was",
  status: "proposed",
  updatedAt: "2026-07-31T00:00:00.000Z",
});

test("write then read round-trips", () => {
  const dir = mkdtempSync(join(tmpdir(), "pipe-"));
  writeCompany(dir, base());
  assert.equal(readCompany(dir, "acme")?.company, "Acme");
  assert.equal(readAll(dir).length, 1);
});

test("readCompany returns null for missing slug", () => {
  const dir = mkdtempSync(join(tmpdir(), "pipe-"));
  assert.equal(readCompany(dir, "nope"), null);
});

test("readAll on missing dir returns empty", () => {
  assert.deepEqual(readAll(join(tmpdir(), "does-not-exist-xyz")), []);
});

test("patchCompany replaces top-level keys and bumps updatedAt", () => {
  const dir = mkdtempSync(join(tmpdir(), "pipe-"));
  writeCompany(dir, base());
  const out = patchCompany(dir, "acme", { status: "researching" });
  assert.equal(out.status, "researching");
  assert.notEqual(out.updatedAt, "2026-07-31T00:00:00.000Z");
  assert.equal(readCompany(dir, "acme")?.status, "researching");
});

test("patchCompany throws for unknown slug", () => {
  const dir = mkdtempSync(join(tmpdir(), "pipe-"));
  assert.throws(() => patchCompany(dir, "ghost", { status: "rejected" }));
});

test("canAdvance allows forward, rejected-from-anywhere, and backward for redo", () => {
  assert.equal(canAdvance("proposed", "researching"), true);
  assert.equal(canAdvance("page_draft", "page_approved"), true);
  assert.equal(canAdvance("app_text", "rejected"), true);
  assert.equal(canAdvance("page_approved", "page_draft"), true); // needs changes
  assert.equal(canAdvance("proposed", "applied"), true); // multi-step forward allowed
});

test("canAdvance rejects unknown statuses", () => {
  assert.equal(canAdvance("proposed", "bogus" as never), false);
});
