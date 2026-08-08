/**
 * One-time seed: move the hardcoded /outreach runsheet targets into the DB.
 *   npx dotenv -e .env.local -- npx tsx scripts/seed-outreach.ts
 */
import { patchCompany } from "../lib/pipeline/store";
import type { OutreachTarget } from "../lib/pipeline/types";

const t = (
  name: string,
  role: string,
  url: string,
  noteKind: OutreachTarget["noteKind"],
  status: OutreachTarget["status"] = "to_send",
): OutreachTarget => ({ name, role, url, noteKind, status });

const SEED: Record<string, OutreachTarget[]> = {
  respan: [
    t("Andy Li", "Co-founder & CEO", "https://www.linkedin.com/in/hanheli", "senior"),
    t("Raymond Huang", "Co-founder & CTO", "https://www.linkedin.com/in/yunrui-huang", "senior"),
    t("Ruifeng Z.", "Founding Software Engineer", "https://www.linkedin.com/in/ruifeng-zhang", "peer"),
    t("Hendrix Liu", "Co-founder", "https://www.linkedin.com/in/hendrix-liu-7a015822b", null),
    t("Ruiqing Yu", "Product Engineer", "https://www.linkedin.com/in/ruiqingyu0237", null),
    t("Yuyang Liu", "Software Engineer", "https://www.linkedin.com/in/yuyang-liu-6791811aa", null),
    t("Frank Chen", "Head of DevRel", "https://www.linkedin.com/in/sihan-frank-chen", null),
    t("Zongyu (Taro) M.", "LLM Observability & Evals", "https://www.linkedin.com/in/zongyuma", null),
    t("Shehin Shihab", "Team", "https://www.linkedin.com/in/shehinshihab", null),
  ],
  seeq: [
    t("Thiago Abdo", "Senior Software Engineer", "https://www.linkedin.com/in/abdothiago", "peer", "sent"),
    t("Michael Friesen", "Senior Software Engineer", "https://www.linkedin.com/in/michael-friesen-99201", "peer", "sent"),
    t("Andres Barbaro", "VP of Engineering", "https://www.linkedin.com/in/afbarbaro", "senior", "sent"),
    t("Abby Cayer", "Talent Acquisition", "https://www.linkedin.com/in/abby-cayer-1b017a62", "senior"),
    t("Luigi Polvani", "Software Architect, full stack", "https://www.linkedin.com/in/luigipolvani", "peer"),
    t("Jason Pankow", "HR / Talent Acquisition", "https://www.linkedin.com/in/jpankow", null),
    t("Seth Gilchrist", "Managing Principal SDE", "https://www.linkedin.com/in/sethgilchrist", null),
    t("Steven Oxley", "Senior Principal Software Engineer", "https://www.linkedin.com/in/stevenoxley", null),
    t("Kate Galle", "Staff Software Engineer", "https://www.linkedin.com/in/kate-galle-4a7a97190", null),
    t("Josh Stabback", "Principal Software Engineer", "https://www.linkedin.com/in/stabback", null),
  ],
};

async function main() {
  for (const [slug, outreach] of Object.entries(SEED)) {
    await patchCompany(slug, { outreach });
    console.log(`seeded ${slug}: ${outreach.length} targets`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
