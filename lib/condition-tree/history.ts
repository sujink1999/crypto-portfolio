import type { Clock, ConditionTree } from "./types";

/**
 * Command history over immutable trees. The history itself is immutable:
 * `apply` / `undo` / `redo` return a new History. Because trees share
 * structure, keeping past states is cheap.
 *
 * - bounded stack: oldest entries fall off past `limit`
 * - coalescing: rapid edits with the same coalesceKey merge into one entry
 * - redo stack clears the moment a new edit lands
 */

export interface HistoryEntry {
  tree: ConditionTree;
  /** Human label for the edit, e.g. "Edit condition" */
  label: string;
  /**
   * Edits with the same key, applied within `coalesceMs` of each other,
   * collapse into one undo step (e.g. `edit:<nodeId>` while typing).
   * Pass null to never coalesce.
   */
  coalesceKey: string | null;
  at: number;
}

export interface History {
  past: HistoryEntry[];
  present: HistoryEntry;
  future: HistoryEntry[];
  limit: number;
  coalesceMs: number;
  now: Clock;
}

export interface HistoryOptions {
  limit?: number;
  coalesceMs?: number;
  now: Clock;
}

export function createHistory(
  initial: ConditionTree,
  { limit = 100, coalesceMs = 400, now }: HistoryOptions,
): History {
  return {
    past: [],
    present: { tree: initial, label: "Start", coalesceKey: null, at: now() },
    future: [],
    limit,
    coalesceMs,
    now,
  };
}

export function apply(
  history: History,
  tree: ConditionTree,
  label: string,
  coalesceKey: string | null = null,
): History {
  if (tree === history.present.tree) return history;
  const at = history.now();
  const entry: HistoryEntry = { tree, label, coalesceKey, at };
  const coalesce =
    coalesceKey !== null &&
    history.present.coalesceKey === coalesceKey &&
    at - history.present.at <= history.coalesceMs;
  if (coalesce) {
    // Replace the present in place: undo still lands before the burst began.
    return { ...history, present: entry, future: [] };
  }
  const past = [...history.past, history.present].slice(-history.limit);
  return { ...history, past, present: entry, future: [] };
}

export function canUndo(history: History): boolean {
  return history.past.length > 0;
}

export function canRedo(history: History): boolean {
  return history.future.length > 0;
}

export function undo(history: History): History {
  if (!canUndo(history)) return history;
  const past = history.past.slice(0, -1);
  const present = history.past[history.past.length - 1];
  return { ...history, past, present, future: [history.present, ...history.future] };
}

export function redo(history: History): History {
  if (!canRedo(history)) return history;
  const [present, ...future] = history.future;
  return { ...history, past: [...history.past, history.present], present, future };
}
