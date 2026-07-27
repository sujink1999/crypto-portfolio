// Self-contained fake data matching the real app shapes.
// Streak mocked at 10 per the spec's edge-case note (avoids the empty-bar case at 7).

export const STREAK = 10;

// cadence: 7 ints (0/1), oldest -> newest (today last)
export const CADENCE: number[] = [1, 1, 0, 1, 1, 1, 1];

// Weekday initials for the last 7 calendar days ending "today" (mock: today = Tuesday).
// moment().subtract(i,"days").day() for i=6..0, left->right.
export const DAY_LABELS: string[] = ["W", "T", "F", "S", "S", "M", "T"];

// Date selector
export const CURRENT_DAY = 24;
export const TOTAL_DAYS = 66;
export const VISUAL_DAY = 24;
export const DATE_SUBTEXT = "Today, July 22";

// Per-day progress fractions (0..1) -> fill height = frac * 40px. Day 24 is last/selected.
export const DAY_PROGRESS: number[] = [
  0.5, 1, 1, 0.66, 1, 1, 0.33, 1, 1, 1, 0.5, 1, 1, 1, 0.75, 1, 0.66, 1, 1, 1,
  0.4, 1, 1, 0.6,
];

// Character
export const CHARACTER_IMAGE_INDEX = 3; // 1..5 -> character/3.png

export type Beacon = {
  id: string;
  type: "character_evolution" | "brand_unlock";
  title: string;
  message: string;
  imageKey: string;
};

export const BEACONS: Beacon[] = [
  {
    id: "beacon_state_1",
    type: "character_evolution",
    title: "STATE EVOLUTION",
    message: "Your current state will evolve in the next 3 days",
    imageKey: "character_4",
  },
  {
    id: "beacon_brand_1",
    type: "brand_unlock",
    title: "BRAND UNLOCK",
    message: "Nuvie unlocking in 3 days",
    imageKey: "brand_nuvie",
  },
];

// Daytime tasks
export const TIME_UNTIL_EVENING = "5 HOURS 12 MINS";
export const PROGRESS_FILL = 0.68; // 0..1

export type Task = {
  id: number;
  taskName: string;
  command: string;
  status: "done" | "todo";
};

// done rows render first, then todos.
export const TASKS: Task[] = [
  { id: 1, taskName: "hydrate", command: "Drink 500ml water", status: "done" },
  { id: 5, taskName: "meditate", command: "Meditate 10 minutes", status: "done" },
  { id: 2, taskName: "read", command: "Read 10 pages", status: "todo" },
  { id: 3, taskName: "workout", command: "Train 45 minutes", status: "todo" },
  { id: 4, taskName: "cold", command: "Cold shower 2 minutes", status: "todo" },
];

// Streak milestones (verbatim)
export const MILESTONES = [
  { days: 3, name: "First Spark" },
  { days: 7, name: "One Week Strong" },
  { days: 14, name: "Fortnight Forged" },
  { days: 21, name: "Pattern Locked" },
  { days: 30, name: "One Month Deep" },
  { days: 45, name: "Relentless" },
  { days: 66, name: "Sovereign Complete" },
];

// For streak = 10: current = "One Week Strong" (7), next = {14,"Fortnight Forged"}
// fromDays 7, range 7, progress (10-7)/7 = 42.857%, "4 days to go"
export function getMilestoneInfo(streak: number) {
  let current = MILESTONES[0];
  let next = MILESTONES[MILESTONES.length - 1];
  for (let i = 0; i < MILESTONES.length; i++) {
    if (streak >= MILESTONES[i].days) {
      current = MILESTONES[i];
      next = MILESTONES[Math.min(i + 1, MILESTONES.length - 1)];
    }
  }
  const fromDays = current.days;
  const range = Math.max(next.days - fromDays, 1);
  const progress = Math.min(Math.max((streak - fromDays) / range, 0), 1);
  const daysToGo = Math.max(next.days - streak, 0);
  return { current, next, progress, daysToGo };
}
