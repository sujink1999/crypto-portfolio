/**
 * One-off local-scout helper: fetch real application-form questions from
 * Greenhouse (REST) and Ashby (public GraphQL) for proposed rows missing
 * `application`, and patch them into the DB. Non-ATS rows are reported.
 */
import { readAll, patchCompany } from "../lib/pipeline/store";
import type { Application } from "../lib/pipeline/schema";

const slugify = (label: string) =>
  label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 60) || "q";

function ghType(f: { type: string; values?: unknown[] }): "short" | "long" | "select" | "file" | "checkbox" {
  if (f.type === "input_file") return "file";
  if (f.type === "textarea") return "long";
  if (f.type === "multi_value_single_select") return "select";
  if (f.type === "multi_value_multi_select") return "checkbox";
  return "short";
}

async function fetchGreenhouse(board: string, id: string, formUrl: string): Promise<Application | null> {
  const r = await fetch(`https://boards-api.greenhouse.io/v1/boards/${board}/jobs/${id}?questions=true`);
  if (!r.ok) return null;
  const d = (await r.json()) as { questions?: { label: string; required: boolean; fields: { type: string; values?: { label: string }[] }[] }[] };
  if (!d.questions) return null;
  const seen = new Set<string>();
  return {
    formUrl,
    fetchedAt: new Date().toISOString(),
    questions: d.questions.map((q) => {
      let id0 = slugify(q.label);
      while (seen.has(id0)) id0 += "_2";
      seen.add(id0);
      const f = q.fields[0];
      return {
        id: id0,
        label: q.label,
        type: ghType(f),
        options: f.values?.length ? f.values.map((v) => v.label) : undefined,
        required: q.required,
        draft: null,
        status: "pending" as const,
      };
    }),
  };
}

async function fetchAshby(org: string, postingId: string, formUrl: string): Promise<Application | null> {
  const r = await fetch("https://jobs.ashbyhq.com/api/non-user-graphql?op=ApiJobPosting", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      operationName: "ApiJobPosting",
      variables: { organizationHostedJobsPageName: org, jobPostingId: postingId },
      query: `query ApiJobPosting($organizationHostedJobsPageName: String!, $jobPostingId: String!) {
        jobPosting(organizationHostedJobsPageName: $organizationHostedJobsPageName, jobPostingId: $jobPostingId) {
          id title applicationForm { sections { fieldEntries { isRequired field } } }
        }}`,
    }),
  });
  if (!r.ok) return null;
  const d = (await r.json()) as {
    data?: { jobPosting?: { applicationForm?: { sections: { fieldEntries: { isRequired: boolean; field: { title: string; type: string; selectableValues?: { label: string; value?: string }[] | null; isDeactivated?: boolean } }[] }[] } } };
  };
  const form = d.data?.jobPosting?.applicationForm;
  if (!form) return null;
  const map: Record<string, "short" | "long" | "select" | "file" | "checkbox"> = {
    String: "short", Email: "short", Phone: "short", Location: "short", Number: "short",
    LongText: "long", File: "file", Boolean: "select", ValueSelect: "select", MultiValueSelect: "checkbox", SocialLink: "short",
  };
  const seen = new Set<string>();
  const questions = form.sections.flatMap((s) =>
    s.fieldEntries.map((e) => {
      let id0 = slugify(e.field.title);
      while (seen.has(id0)) id0 += "_2";
      seen.add(id0);
      return {
        id: id0,
        label: e.field.title,
        type: map[e.field.type] ?? "short",
        options: e.field.selectableValues?.length ? e.field.selectableValues.map((v) => v.label) : undefined,
        required: e.isRequired,
        draft: null,
        status: "pending" as const,
      };
    }),
  );
  if (!questions.length) return null;
  return { formUrl, fetchedAt: new Date().toISOString(), questions };
}

async function main() {
  const all = await readAll();
  const targets = all.filter((c) => c.status === "proposed" && !c.application && c.jdUrl);
  for (const c of targets) {
    const u = c.jdUrl!;
    let app: Application | null = null;
    let kind = "other";
    let m: RegExpMatchArray | null;
    if ((m = u.match(/greenhouse\.io\/([^/]+)\/jobs\/(\d+)/))) {
      kind = "greenhouse";
      app = await fetchGreenhouse(m[1], m[2], `https://job-boards.greenhouse.io/${m[1]}/jobs/${m[2]}#app`);
    } else if ((m = u.match(/jobs\.ashbyhq\.com\/([^/]+)\/([0-9a-f-]{36})/))) {
      kind = "ashby";
      app = await fetchAshby(decodeURIComponent(m[1]), m[2], `${u.split("?")[0]}/application`);
    }
    if (app) {
      await patchCompany(c.slug, { application: app });
      console.log(`patched ${c.slug} (${kind}): ${app.questions.length} questions`);
    } else {
      console.log(`skipped ${c.slug} (${kind}): ${u}`);
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
