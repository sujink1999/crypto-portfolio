import test from "node:test";
import assert from "node:assert/strict";
import { canAdvance } from "./store";
import { PipelineCompanySchema } from "./schema";

const base = {
  slug: "acme",
  company: "Acme",
  role: "Full Stack Engineer",
  source: { channel: "was" },
  posted: { date: "2026-08-01", precision: "day", evergreen: false, verifiedLiveAt: null },
  compensation: {
    min: 150000,
    max: 230000,
    currency: "USD",
    minUsd: 150000,
    maxUsd: 230000,
    equity: false,
    sponsorship: null,
    confidence: "published",
  },
  hq: {},
  hiring: { countries: "worldwide", mode: "remote", usAuthRequired: null },
  status: "proposed",
  updatedAt: "2026-07-31T00:00:00.000Z",
};

test("schema accepts a valid company", () => {
  assert.equal(PipelineCompanySchema.safeParse(base).success, true);
});

test("schema rejects free-text posted dates", () => {
  const bad = { ...base, posted: { ...base.posted, date: "Jul 2026" } };
  assert.equal(PipelineCompanySchema.safeParse(bad).success, false);
});

test("schema rejects min > max compensation", () => {
  const bad = {
    ...base,
    compensation: { ...base.compensation, min: 300000, minUsd: 300000 },
  };
  assert.equal(PipelineCompanySchema.safeParse(bad).success, false);
});

test("schema rejects unknown hiring country codes", () => {
  const bad = { ...base, hiring: { ...base.hiring, countries: ["USA"] } };
  assert.equal(PipelineCompanySchema.safeParse(bad).success, false);
});

test("canAdvance allows forward, rejected-from-anywhere, and backward for redo", () => {
  assert.equal(canAdvance("proposed", "researching"), true);
  assert.equal(canAdvance("page_draft", "build"), true);
  assert.equal(canAdvance("build", "rejected"), true);
  assert.equal(canAdvance("build", "page_draft"), true); // needs changes
  assert.equal(canAdvance("proposed", "applied"), true); // multi-step forward allowed
});

test("canAdvance rejects unknown statuses", () => {
  assert.equal(canAdvance("proposed", "bogus" as never), false);
});
